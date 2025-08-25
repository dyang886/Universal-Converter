use std::collections::HashMap;
use std::env;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use tokio::fs;
use uuid::Uuid;

use crate::{ConversionLogPayload, LocalizedText};
const THROTTLE_INTERVAL: Duration = Duration::from_millis(500);

// A list of all file extensions that should be processed by the 'um' CLI tool.
const ENCRYPTED_AUDIO_EXTENSIONS: &[&str] = &[
    "qmc0", "qmc2", "qmc3", "qmcflac", "qmcogg", "tkm", "bkcmp3", "bkcflac", "tm0", "tm2", "tm3", "tm6", "mflac", "mgg", "mflac0", "mgg1", "mggl",
    "ofl_en", "ncm", "xm", "kwm", "kgm", "vpr", "x2m", "x3m", "mg3d",
];

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, mut options: HashMap<String, String>,
) -> Result<bool, String> {
    let mut all_files_converted_successfully = true;

    for path_str in input_paths {
        let original_input_path = PathBuf::from(&path_str);
        let mut temp_dir_to_clean: Option<PathBuf> = None;
        let mut pre_process_log_output = String::new();

        let file_ext = original_input_path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();

        let is_encrypted_file = ENCRYPTED_AUDIO_EXTENSIONS.contains(&file_ext.as_str());

        handle
            .emit(
                "conversion-log",
                &ConversionLogPayload {
                    file_path: path_str.clone(),
                    status_message: LocalizedText {
                        key: "terminal.converting".to_string(),
                        vars: create_vars(original_input_path.display().to_string()),
                    },
                    terminal_output: None,
                    success: None,
                },
            )
            .unwrap();

        // Pre-process encrypted files using the external CLI tool
        let input_path_for_ffmpeg = if is_encrypted_file {
            let temp_dir = env::temp_dir().join(Uuid::new_v4().to_string());
            fs::create_dir_all(&temp_dir).await.map_err(|e| e.to_string())?;
            temp_dir_to_clean = Some(temp_dir.clone());

            let mut um_cli_args = vec![
                "-V".to_string(),
                "--overwrite".to_string(),
                "-i".to_string(),
                original_input_path.to_string_lossy().to_string(),
                "-o".to_string(),
                temp_dir.to_string_lossy().to_string(),
            ];

            // These are the special options only for the 'um' tool
            let um_specific_args = ["--qmc-mmkv", "--qmc-mmkv-key", "--kgg-db", "--update-metadata"];

            for arg_name in um_specific_args {
                if let Some(value) = options.remove(arg_name) {
                    um_cli_args.push(arg_name.to_string());
                    if !value.is_empty() {
                        um_cli_args.push(value);
                    }
                }
            }

            match run_cli_command(&handle, &path_str, "um", &um_cli_args).await {
                Ok(cli_log) => {
                    pre_process_log_output = cli_log;
                    pre_process_log_output.push_str("\n--- Starting FFmpeg conversion ---\n");

                    // Find the single decrypted file inside the temporary directory.
                    match find_first_file_in_dir(&temp_dir).await {
                        Ok(Some(decrypted_file_path)) => decrypted_file_path,
                        Ok(None) => {
                            let err_msg = "Decryption succeeded, but no output file was found in the temporary directory.".to_string();
                            emit_error(&handle, &path_str, &original_input_path, err_msg);
                            all_files_converted_successfully = false;
                            continue;
                        }
                        Err(e) => {
                            emit_error(&handle, &path_str, &original_input_path, e);
                            all_files_converted_successfully = false;
                            continue;
                        }
                    }
                }
                Err(e) => {
                    emit_error(&handle, &path_str, &original_input_path, e);
                    all_files_converted_successfully = false;
                    continue;
                }
            }
        } else {
            original_input_path.clone()
        };

        let original_file_stem = original_input_path.file_stem().unwrap_or_default().to_string_lossy();
        let new_file_name = format!("{}_UCT.{}", original_file_stem, output_ext);
        let output_path = original_input_path.with_file_name(new_file_name);

        let mut ffmpeg_args: Vec<String> = vec!["-i".to_string(), input_path_for_ffmpeg.to_string_lossy().to_string()];

        // ffmpeg special cases
        if output_ext == "m4a" {
            ffmpeg_args.push("-vn".to_string());
        }
        if let Some(codec) = options.get("-c:a") {
            if matches!(codec.as_str(), "dca" | "truehd") {
                ffmpeg_args.extend(vec!["-strict".to_string(), "-2".to_string()]);
            }
        }

        // Add remaining options to FFmpeg. 'um' specific options have been removed.
        for (key, value) in &options {
            ffmpeg_args.push(key.clone());
            if !value.is_empty() {
                ffmpeg_args.push(value.clone());
            }
        }
        ffmpeg_args.extend(vec![
            "-y".to_string(),
            "-hide_banner".to_string(),
            output_path.to_string_lossy().to_string(),
        ]);

        match run_cli_command(&handle, &path_str, "ffmpeg", &ffmpeg_args).await {
            Ok(ffmpeg_log) => {
                let final_log = format!("{}{}", pre_process_log_output, ffmpeg_log);
                emit_success(&handle, &path_str, &original_input_path, final_log);
            }
            Err(e) => {
                let final_log = format!("{}{}", pre_process_log_output, e);
                emit_error(&handle, &path_str, &original_input_path, final_log);
                all_files_converted_successfully = false;
            }
        };

        // Clean up the temporary directory and its contents
        if let Some(path) = temp_dir_to_clean {
            if let Err(e) = fs::remove_dir_all(&path).await {
                eprintln!("Failed to clean up temp directory '{}': {}", path.display(), e);
            }
        }
    }

    Ok(all_files_converted_successfully)
}

/// A generic function to run an external command and stream its output.
async fn run_cli_command(handle: &AppHandle, original_path_str: &str, program: &str, args: &[String]) -> Result<String, String> {
    let (mut rx, _child) = handle
        .shell()
        .command(program)
        .args(args)
        .spawn()
        .map_err(|e| format!("Failed to spawn '{}'. Error: {}", program, e))?;

    let mut terminal_output = String::new();
    let mut last_update = Instant::now();
    let display_path = PathBuf::from(original_path_str).display().to_string();
    let mut final_code: Option<i32> = None;

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stderr(line) | CommandEvent::Stdout(line) => {
                terminal_output.push_str(&String::from_utf8_lossy(&line));

                if last_update.elapsed() >= THROTTLE_INTERVAL {
                    handle
                        .emit(
                            "conversion-log",
                            &ConversionLogPayload {
                                file_path: original_path_str.to_string(),
                                status_message: LocalizedText {
                                    key: "terminal.converting".to_string(),
                                    vars: create_vars(display_path.clone()),
                                },
                                terminal_output: Some(terminal_output.clone()),
                                success: None,
                            },
                        )
                        .unwrap();
                    last_update = Instant::now();
                }
            }
            CommandEvent::Terminated(payload) => {
                final_code = payload.code;
            }
            _ => {}
        }
    }

    if final_code != Some(0) {
        return Err(terminal_output);
    }

    Ok(terminal_output)
}

/// Finds the first file within a given directory.
async fn find_first_file_in_dir(dir: &PathBuf) -> Result<Option<PathBuf>, String> {
    let mut entries = fs::read_dir(dir).await.map_err(|e| e.to_string())?;
    if let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        Ok(Some(entry.path()))
    } else {
        Ok(None)
    }
}

fn create_vars(file_path: String) -> HashMap<String, String> {
    let mut vars = HashMap::new();
    vars.insert("file".to_string(), file_path);
    vars
}

fn emit_error(handle: &AppHandle, path_str: &str, original_path: &PathBuf, error_log: String) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.failure".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: Some(error_log),
                success: Some(false),
            },
        )
        .unwrap();
}

fn emit_success(handle: &AppHandle, path_str: &str, original_path: &PathBuf, final_log: String) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.success".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: Some(final_log),
                success: Some(true),
            },
        )
        .unwrap();
}
