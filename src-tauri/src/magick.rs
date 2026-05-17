use indexmap::IndexMap;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

use tauri::AppHandle;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;

use crate::routing;
use crate::{emit_cancelled, emit_delta, emit_error, emit_success, run_cli_command};

fn path_extension(path: &str) -> Option<String> {
    PathBuf::from(path).extension().and_then(|ext| ext.to_str()).map(str::to_ascii_lowercase)
}

fn magick_input_path(path: &str) -> String {
    match path_extension(path).as_deref() {
        Some("psd" | "xcf") => format!("{}[0]", path),
        _ => path.to_string(),
    }
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

    let mut args: Vec<String> = batch.iter().map(|path| magick_input_path(path)).collect();
    append_options(&mut args, options);
    args.push(output.to_string_lossy().to_string());

    println!("Full magick command: magick {}", args.join(" "));

    let pack_ids = routing::command_packs("magick");
    match run_cli_command(handle, &batch[0], "magick", &args, cancel_flag, &pack_ids).await {
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

fn append_options(args: &mut Vec<String>, options: &IndexMap<String, String>) {
    for (key, value) in options {
        for part in key.split_whitespace() {
            args.push(part.trim_matches('"').trim_matches('\'').to_string());
        }
        if !value.is_empty() {
            for part in value.split_whitespace() {
                args.push(part.trim_matches('"').trim_matches('\'').to_string());
            }
        }
    }
}
