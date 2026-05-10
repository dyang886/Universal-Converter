use indexmap::IndexMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

use tauri::AppHandle;
use tokio::fs;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use uuid::Uuid;

use crate::{emit_cancelled, emit_delta, emit_error, emit_success, run_cli_command};

const DOCUMENT_INPUT_EXTS: &[&str] = &["ai", "eps", "pdf", "ps"];
const DOCUMENT_OUTPUT_EXTS: &[&str] = &["ai", "eps", "pdf", "ps"];
const DOCUMENT_PAGE_ENCODER_OUTPUT_EXTS: &[&str] = &["heic", "heif", "jxr", "wdp"];

fn path_extension(path: &str) -> Option<String> {
    PathBuf::from(path).extension().and_then(|ext| ext.to_str()).map(str::to_ascii_lowercase)
}

fn has_option(options: &IndexMap<String, String>, arg: &str) -> bool {
    options.keys().any(|key| key.split_whitespace().any(|part| part == arg))
}

fn magick_input_path(path: &str) -> String {
    match path_extension(path).as_deref() {
        Some("psd" | "xcf") => format!("{}[0]", path),
        _ => path.to_string(),
    }
}

fn is_document_input(path: &str) -> bool {
    path_extension(path).is_some_and(|ext| DOCUMENT_INPUT_EXTS.contains(&ext.as_str()))
}

fn is_document_output(output_ext: &str) -> bool {
    DOCUMENT_OUTPUT_EXTS.contains(&output_ext.to_ascii_lowercase().as_str())
}

fn needs_document_page_encoder(output_ext: &str) -> bool {
    DOCUMENT_PAGE_ENCODER_OUTPUT_EXTS.contains(&output_ext.to_ascii_lowercase().as_str())
}

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: IndexMap<String, String>, combine: bool, cancel_flag: Arc<AtomicBool>,
    max_threads: usize,
) -> Result<bool, String> {
    // In combine mode the whole batch is a single task; otherwise one task per file.
    let batches: Vec<Vec<String>> = if combine {
        vec![input_paths]
    } else {
        input_paths.into_iter().map(|p| vec![p]).collect()
    };

    let semaphore = Arc::new(Semaphore::new(max_threads));
    let all_ok = Arc::new(AtomicBool::new(true));
    let mut join_set = JoinSet::new();

    for batch in batches {
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let permit = Arc::clone(&semaphore).acquire_owned().await.unwrap();
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let handle = handle.clone();
        let output_ext = output_ext.clone();
        let options = options.clone();
        let cancel = Arc::clone(&cancel_flag);
        let all_ok = Arc::clone(&all_ok);

        join_set.spawn(async move {
            let _permit = permit;
            if !convert_batch(&handle, batch, &output_ext, &options, &cancel).await {
                all_ok.store(false, Ordering::Relaxed);
            }
        });
    }

    while join_set.join_next().await.is_some() {}

    Ok(all_ok.load(Ordering::Relaxed))
}

async fn convert_batch(
    handle: &AppHandle, batch: Vec<String>, output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>,
) -> bool {
    let representative = PathBuf::from(&batch[0]);
    emit_delta(handle, &batch[0], &representative, String::new());
    let output = representative.with_file_name(format!(
        "{}_UCT.{}",
        representative.file_stem().unwrap_or_default().to_string_lossy(),
        output_ext
    ));

    let has_document_input = batch.iter().any(|path| is_document_input(path));
    let is_rasterized_document = has_document_input && !is_document_output(output_ext);

    if is_rasterized_document && needs_document_page_encoder(output_ext) {
        return convert_document_pages_with_encoder(handle, &batch, output_ext, options, cancel_flag, &representative, &output).await;
    }

    let mut args = Vec::new();
    let mut moved_options = Vec::new();

    if is_rasterized_document {
        if let Some(density) = options.get("-density").filter(|value| !value.is_empty()) {
            append_option(&mut args, "-density", density);
            moved_options.push("-density");
        } else {
            args.extend(["-density".to_string(), "300".to_string()]);
        }
    }

    args.extend(batch.iter().map(|path| magick_input_path(path)));

    if is_rasterized_document {
        if let Some(background) = options.get("-background").filter(|value| !value.is_empty()) {
            append_option(&mut args, "-background", background);
            moved_options.push("-background");
        } else {
            args.extend(["-background".to_string(), "white".to_string()]);
        }

        if !has_option(options, "-alpha") && !has_option(options, "-flatten") {
            args.extend(["-alpha".to_string(), "remove".to_string(), "-alpha".to_string(), "off".to_string()]);
        }
    }

    append_options_except(&mut args, options, &moved_options);
    args.push(output.to_string_lossy().to_string());

    println!("Full magick command: magick {}", args.join(" "));

    match run_cli_command(handle, &batch[0], "magick", &args, cancel_flag).await {
        Ok(()) => {
            emit_success(handle, &batch[0], &representative);
            true
        }
        Err(e) if e == "cancelled" => {
            emit_cancelled(handle, &batch[0], &representative);
            false
        }
        Err(_) => {
            emit_error(handle, &batch[0], &representative);
            false
        }
    }
}

async fn convert_document_pages_with_encoder(
    handle: &AppHandle, batch: &[String], output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>,
    representative: &PathBuf, output: &Path,
) -> bool {
    let temp_dir = std::env::temp_dir().join(Uuid::new_v4().to_string());
    if let Err(e) = fs::create_dir_all(&temp_dir).await {
        eprintln!("Failed to create temp directory '{}': {}", temp_dir.display(), e);
        return false;
    }

    let result = convert_document_pages_with_encoder_inner(handle, batch, output_ext, options, cancel_flag, output, &temp_dir).await;

    if let Err(e) = fs::remove_dir_all(&temp_dir).await {
        eprintln!("Failed to clean up temp directory '{}': {}", temp_dir.display(), e);
    }

    match result {
        Ok(()) => {
            emit_success(handle, &batch[0], representative);
            true
        }
        Err(e) if e == "cancelled" => {
            emit_cancelled(handle, &batch[0], representative);
            false
        }
        Err(e) => {
            eprintln!("Document page encoding failed: {}", e);
            emit_error(handle, &batch[0], representative);
            false
        }
    }
}

async fn convert_document_pages_with_encoder_inner(
    handle: &AppHandle, batch: &[String], output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>, output: &Path,
    temp_dir: &Path,
) -> Result<(), String> {
    let intermediate_ext = match output_ext.to_ascii_lowercase().as_str() {
        "heic" | "heif" => "png",
        "jxr" | "wdp" => "bmp",
        _ => return Err(format!("Unsupported document page encoder output: {}", output_ext)),
    };
    let intermediate_pattern = temp_dir.join(format!("page-%d.{}", intermediate_ext));

    let mut args = Vec::new();
    let mut moved_options = Vec::new();

    if let Some(density) = options.get("-density").filter(|value| !value.is_empty()) {
        append_option(&mut args, "-density", density);
        moved_options.push("-density");
    } else {
        args.extend(["-density".to_string(), "300".to_string()]);
    }

    args.extend(batch.iter().map(|path| magick_input_path(path)));

    if let Some(background) = options.get("-background").filter(|value| !value.is_empty()) {
        append_option(&mut args, "-background", background);
        moved_options.push("-background");
    } else {
        args.extend(["-background".to_string(), "white".to_string()]);
    }

    if !has_option(options, "-alpha") && !has_option(options, "-flatten") {
        args.extend(["-alpha".to_string(), "remove".to_string(), "-alpha".to_string(), "off".to_string()]);
    }

    moved_options.push("-quality");
    append_options_except(&mut args, options, &moved_options);

    if intermediate_ext == "bmp" {
        args.push(format!("BMP3:{}", intermediate_pattern.to_string_lossy()));
    } else {
        args.push(intermediate_pattern.to_string_lossy().to_string());
    }

    run_cli_command(handle, &batch[0], "magick", &args, cancel_flag).await?;

    let pages = collect_intermediate_pages(temp_dir, intermediate_ext).await?;
    if pages.is_empty() {
        return Err("Document rasterization succeeded, but no page images were produced.".to_string());
    }

    for (index, page) in pages.iter().enumerate() {
        let final_output = page_output_path(output, output_ext, index, pages.len());
        encode_document_page(handle, &batch[0], page, &final_output, output_ext, options, cancel_flag).await?;
    }

    Ok(())
}

async fn collect_intermediate_pages(temp_dir: &Path, intermediate_ext: &str) -> Result<Vec<PathBuf>, String> {
    let mut entries = fs::read_dir(temp_dir).await.map_err(|e| e.to_string())?;
    let mut pages = Vec::new();

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        let is_page = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .is_some_and(|stem| stem.starts_with("page-"))
            && path
                .extension()
                .and_then(|ext| ext.to_str())
                .is_some_and(|ext| ext.eq_ignore_ascii_case(intermediate_ext));

        if is_page {
            pages.push(path);
        }
    }

    pages.sort_by_key(|path| {
        path.file_stem()
            .and_then(|stem| stem.to_str())
            .and_then(|stem| stem.strip_prefix("page-"))
            .and_then(|index| index.parse::<usize>().ok())
            .unwrap_or(usize::MAX)
    });

    Ok(pages)
}

fn page_output_path(output: &Path, output_ext: &str, index: usize, total_pages: usize) -> PathBuf {
    if total_pages == 1 {
        return output.to_path_buf();
    }

    let stem = output.file_stem().unwrap_or_default().to_string_lossy();
    output.with_file_name(format!("{}-{}.{}", stem, index, output_ext))
}

async fn encode_document_page(
    handle: &AppHandle, original_path: &str, page: &Path, output: &Path, output_ext: &str, options: &IndexMap<String, String>,
    cancel_flag: &Arc<AtomicBool>,
) -> Result<(), String> {
    match output_ext.to_ascii_lowercase().as_str() {
        "heic" | "heif" => {
            let mut args = Vec::new();
            if let Some(quality) = options.get("-quality").filter(|value| !value.is_empty()) {
                args.extend(["-q".to_string(), quality.to_string()]);
            }
            args.extend(["-o".to_string(), output.to_string_lossy().to_string(), page.to_string_lossy().to_string()]);
            run_cli_command(handle, original_path, "heif-enc", &args, cancel_flag).await
        }
        "jxr" | "wdp" => {
            let mut args = vec![
                "-i".to_string(),
                page.to_string_lossy().to_string(),
                "-o".to_string(),
                output.to_string_lossy().to_string(),
            ];
            if let Some(quality) = jxr_quality_arg(options) {
                args.extend(["-q".to_string(), quality]);
            }
            run_cli_command(handle, original_path, "JXREncApp", &args, cancel_flag).await
        }
        _ => Err(format!("Unsupported document page encoder output: {}", output_ext)),
    }
}

fn jxr_quality_arg(options: &IndexMap<String, String>) -> Option<String> {
    let quality = options.get("-quality")?.parse::<f64>().ok()?;
    if quality >= 100.0 {
        return None;
    }

    Some(
        format!("{:.4}", (quality / 100.0).clamp(0.0, 0.9999))
            .trim_end_matches('0')
            .trim_end_matches('.')
            .to_string(),
    )
}

fn append_option(args: &mut Vec<String>, key: &str, value: &str) {
    for part in key.split_whitespace() {
        args.push(part.trim_matches('"').trim_matches('\'').to_string());
    }
    if !value.is_empty() {
        for part in value.split_whitespace() {
            args.push(part.trim_matches('"').trim_matches('\'').to_string());
        }
    }
}

fn append_options_except(args: &mut Vec<String>, options: &IndexMap<String, String>, excluded_args: &[&str]) {
    for (key, value) in options {
        if key.split_whitespace().any(|part| excluded_args.contains(&part)) {
            continue;
        }
        append_option(args, key, value);
    }
}
