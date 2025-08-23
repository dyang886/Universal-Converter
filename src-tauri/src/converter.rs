use std::collections::HashMap;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};

use crate::{AdvancedOptions, ConversionLogPayload, LocalizedText};
const THROTTLE_INTERVAL: Duration = Duration::from_millis(500);

pub async fn run_conversion(handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: AdvancedOptions) -> Result<bool, String> {
    let shell = handle.shell();
    let mut all_files_converted_successfully = true;

    for path_str in input_paths {
        let input_path = PathBuf::from(&path_str);
        let file_stem = input_path.file_stem().unwrap_or_default().to_string_lossy();
        let new_file_name = format!("{}_UCT.{}", file_stem, output_ext);
        let output_path = input_path.with_file_name(new_file_name);
        let original_path_str = path_str.clone();
        let display_path = input_path.display().to_string();

        let create_vars = |file_path: String| -> HashMap<String, String> {
            let mut vars = HashMap::new();
            vars.insert("file".to_string(), file_path);
            vars
        };

        handle
            .emit(
                "conversion-log",
                &ConversionLogPayload {
                    file_path: original_path_str.clone(),
                    status_message: LocalizedText {
                        key: "terminal.converting".to_string(),
                        vars: create_vars(display_path.clone()),
                    },
                    terminal_output: None,
                    success: None,
                },
            )
            .unwrap();

        let mut args: Vec<String> = vec!["-i".to_string(), input_path.to_string_lossy().to_string()];

        // Special cases
        if output_ext == "m4a" {
            args.push("-vn".to_string());
        }
        if let Some(codec) = options.options.get("-c:a") {
            match codec.as_str() {
                "dca" | "truehd" => {
                    args.push("-strict".to_string());
                    args.push("-2".to_string());
                }
                _ => {}
            }
        }

        for (key, value) in &options.options {
            args.push(key.clone());
            if !value.is_empty() {
                args.push(value.clone());
            }
        }
        args.push("-y".to_string());
        args.push("-hide_banner".to_string());
        args.push(output_path.to_string_lossy().to_string());

        let (mut rx, _child) = shell.command("ffmpeg").args(&args).spawn().map_err(|e| e.to_string())?;

        let mut final_code: Option<i32> = None;
        let mut terminal_output = String::new();
        let mut last_update = Instant::now();

        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stderr(line) | CommandEvent::Stdout(line) => {
                    let line_str = String::from_utf8_lossy(&line);
                    terminal_output.push_str(&line_str);

                    if last_update.elapsed() >= THROTTLE_INTERVAL {
                        handle
                            .emit(
                                "conversion-log",
                                &ConversionLogPayload {
                                    file_path: original_path_str.clone(),
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

        let success = final_code == Some(0);
        if !success {
            all_files_converted_successfully = false;
        }

        handle
            .emit(
                "conversion-log",
                &ConversionLogPayload {
                    file_path: original_path_str.clone(),
                    status_message: LocalizedText {
                        key: if success {
                            "terminal.success".to_string()
                        } else {
                            "terminal.failure".to_string()
                        },
                        vars: create_vars(display_path.clone()),
                    },
                    terminal_output: Some(terminal_output),
                    success: Some(success),
                },
            )
            .unwrap();
    }

    Ok(all_files_converted_successfully)
}
