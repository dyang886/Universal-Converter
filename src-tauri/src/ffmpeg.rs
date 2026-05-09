use indexmap::IndexMap;
use std::collections::HashSet;
use std::env;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

use tauri::AppHandle;
use tokio::fs;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use uuid::Uuid;

use crate::{emit_cancelled, emit_delta, emit_error, emit_success, find_first_file_in_dir, run_cli_command};

const COVER_ART_AUDIO_OUTPUTS: &[&str] = &["mp3", "flac", "m4a", "m4b"];

async fn remove_temp_dir(path: &PathBuf) {
    if let Err(e) = fs::remove_dir_all(path).await {
        eprintln!("Failed to clean up temp directory '{}': {}", path.display(), e);
    }
}

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: IndexMap<String, String>, um_input_paths: Vec<String>,
    audio_input_paths: Vec<String>, is_audio_output: bool, cancel_flag: Arc<AtomicBool>, max_threads: usize,
) -> Result<bool, String> {
    let semaphore = Arc::new(Semaphore::new(max_threads));
    let all_ok = Arc::new(AtomicBool::new(true));
    let mut join_set = JoinSet::new();
    let um_input_paths: Arc<HashSet<String>> = Arc::new(um_input_paths.into_iter().collect());
    let audio_input_paths: Arc<HashSet<String>> = Arc::new(audio_input_paths.into_iter().collect());

    for path_str in input_paths {
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
        let um_input_paths = Arc::clone(&um_input_paths);
        let audio_input_paths = Arc::clone(&audio_input_paths);
        let cancel = Arc::clone(&cancel_flag);
        let all_ok = Arc::clone(&all_ok);

        join_set.spawn(async move {
            let _permit = permit;
            let use_um = um_input_paths.contains(&path_str);
            let is_audio_input = audio_input_paths.contains(&path_str);
            if !convert_single_file(&handle, path_str, &output_ext, options, use_um, is_audio_input, is_audio_output, &cancel).await {
                all_ok.store(false, Ordering::Relaxed);
            }
        });
    }

    while join_set.join_next().await.is_some() {}

    Ok(all_ok.load(Ordering::Relaxed))
}

async fn convert_single_file(
    handle: &AppHandle, path_str: String, output_ext: &str, mut options: IndexMap<String, String>, use_um: bool, is_audio_input: bool,
    is_audio_output: bool, cancel_flag: &Arc<AtomicBool>,
) -> bool {
    let original_input_path = PathBuf::from(&path_str);
    emit_delta(handle, &path_str, &original_input_path, String::new());
    let mut temp_dir_to_clean: Option<PathBuf> = None;

    let um_specific_args = ["--qmc-mmkv", "--qmc-mmkv-key", "--kgg-db", "--update-metadata"];

    let input_path_for_ffmpeg = if use_um {
        let temp_dir = env::temp_dir().join(Uuid::new_v4().to_string());
        if let Err(e) = fs::create_dir_all(&temp_dir).await {
            emit_delta(handle, &path_str, &original_input_path, e.to_string());
            emit_error(handle, &path_str, &original_input_path);
            return false;
        }
        temp_dir_to_clean = Some(temp_dir.clone());

        let mut um_cli_args = vec![
            "-V".to_string(),
            "--overwrite".to_string(),
            "-i".to_string(),
            original_input_path.to_string_lossy().to_string(),
            "-o".to_string(),
            temp_dir.to_string_lossy().to_string(),
        ];

        for arg_name in um_specific_args {
            if let Some(value) = options.get(arg_name) {
                um_cli_args.push(arg_name.to_string());
                if !value.is_empty() {
                    um_cli_args.push(value.clone());
                }
            }
        }

        println!("Full um command: um {}", um_cli_args.join(" "));

        match run_cli_command(handle, &path_str, "um", &um_cli_args, cancel_flag).await {
            Ok(()) => match find_first_file_in_dir(&temp_dir).await {
                Ok(Some(decrypted_file_path)) => decrypted_file_path,
                Ok(None) => {
                    emit_delta(
                        handle,
                        &path_str,
                        &original_input_path,
                        "Decryption succeeded, but no output file was found in the temporary directory.".to_string(),
                    );
                    emit_error(handle, &path_str, &original_input_path);
                    remove_temp_dir(&temp_dir).await;
                    return false;
                }
                Err(e) => {
                    emit_delta(handle, &path_str, &original_input_path, e);
                    emit_error(handle, &path_str, &original_input_path);
                    remove_temp_dir(&temp_dir).await;
                    return false;
                }
            },
            Err(e) if e == "cancelled" => {
                emit_cancelled(handle, &path_str, &original_input_path);
                remove_temp_dir(&temp_dir).await;
                return false;
            }
            Err(_) => {
                emit_error(handle, &path_str, &original_input_path);
                remove_temp_dir(&temp_dir).await;
                return false;
            }
        }
    } else {
        original_input_path.clone()
    };

    for arg in um_specific_args {
        options.shift_remove(arg);
    }

    let original_file_stem = original_input_path.file_stem().unwrap_or_default().to_string_lossy();
    let new_file_name = format!("{}_UCT.{}", original_file_stem, output_ext);
    let output_path = original_input_path.with_file_name(new_file_name);

    let mut ffmpeg_args: Vec<String> = vec!["-i".to_string(), input_path_for_ffmpeg.to_string_lossy().to_string()];

    // Special cases
    if is_audio_output {
        ffmpeg_args.extend(vec!["-map".to_string(), "0:a".to_string()]);
        if is_audio_input && COVER_ART_AUDIO_OUTPUTS.contains(&output_ext) {
            ffmpeg_args.extend(vec![
                "-map".to_string(),
                "0:v?".to_string(),
                "-c:v".to_string(),
                "copy".to_string(),
                "-disposition:v".to_string(),
                "attached_pic".to_string(),
            ]);
        }
    }
    let audio_codec = options.get("-c:a").map(String::as_str);
    if matches!(audio_codec, Some("libopencore_amrnb") | Some("g726") | Some("real_144")) || (output_ext == "amr" && audio_codec.is_none()) {
        if !options.contains_key("-ar") {
            ffmpeg_args.extend(vec!["-ar".to_string(), "8000".to_string()]);
        }
        if !options.contains_key("-ac") {
            ffmpeg_args.extend(vec!["-ac".to_string(), "1".to_string()]);
        }
    }
    if matches!(audio_codec, Some("libvo_amrwbenc")) {
        if !options.contains_key("-ar") {
            ffmpeg_args.extend(vec!["-ar".to_string(), "16000".to_string()]);
        }
        if !options.contains_key("-ac") {
            ffmpeg_args.extend(vec!["-ac".to_string(), "1".to_string()]);
        }
    }
    if matches!(audio_codec, Some("dca" | "truehd" | "mlp")) || matches!(output_ext, "dts" | "truehd" | "thd" | "mlp") {
        ffmpeg_args.extend(vec!["-strict".to_string(), "-2".to_string()]);
    }
    if output_ext == "weba" {
        ffmpeg_args.extend(vec!["-f".to_string(), "webm".to_string()]);
    }
    if output_ext == "truehd" {
        ffmpeg_args.extend(vec!["-f".to_string(), "truehd".to_string()]);
    }

    let mut push_split = |s: &str| {
        for part in s.split_whitespace() {
            ffmpeg_args.push(part.trim_matches('"').trim_matches('\'').to_string());
        }
    };

    for (key, value) in &options {
        push_split(key);
        if !value.is_empty() {
            push_split(value);
        }
    }
    ffmpeg_args.extend(vec![
        "-y".to_string(),
        "-hide_banner".to_string(),
        output_path.to_string_lossy().to_string(),
    ]);

    println!("Full FFmpeg command: ffmpeg {}", ffmpeg_args.join(" "));

    if use_um {
        emit_delta(
            handle,
            &path_str,
            &original_input_path,
            "\n--- Starting FFmpeg conversion ---\n".to_string(),
        );
    }

    let result = match run_cli_command(handle, &path_str, "ffmpeg", &ffmpeg_args, cancel_flag).await {
        Ok(()) => {
            emit_success(handle, &path_str, &original_input_path);
            true
        }
        Err(e) if e == "cancelled" => {
            emit_cancelled(handle, &path_str, &original_input_path);
            false
        }
        Err(_) => {
            emit_error(handle, &path_str, &original_input_path);
            false
        }
    };

    if let Some(path) = temp_dir_to_clean {
        remove_temp_dir(&path).await;
    }

    result
}
