// src-tauri/src/converter.rs

use crate::{AdvancedOptions, FileConversionStatus};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_shell::{ShellExt, process::CommandEvent};

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, _options: AdvancedOptions,
) -> Result<Vec<FileConversionStatus>, String> {
    let shell = handle.shell();
    let mut statuses = Vec::new();

    for path_str in input_paths {
        let input_path = PathBuf::from(&path_str);
        let mut output_path = input_path.clone();
        output_path.set_extension(&output_ext);

        let original_path_str = path_str.clone();

        println!("Converting {:?} -> {:?}", &input_path, &output_path);

        let (mut rx, _child) = shell
            .sidecar("ffmpeg")
            .map_err(|e| e.to_string())?
            .args(["-i", input_path.to_str().unwrap(), output_path.to_str().unwrap()])
            .spawn()
            .map_err(|e| e.to_string())?;

        // -- NEW: Variables to store the final outcome --
        let mut final_code: Option<i32> = None;
        let mut error_message = String::new();

        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stderr(line) => {
                    let line_str = String::from_utf8_lossy(&line).to_string();
                    println!("[FFmpeg]: {}", &line_str);
                    error_message = line_str; // Keep the last line as a potential error
                }
                // -- NEW: Capture the termination event --
                CommandEvent::Terminated(payload) => {
                    final_code = payload.code;
                }
                CommandEvent::Stdout(line) => {
                    println!("[FFmpeg]: {}", String::from_utf8_lossy(&line));
                }
                _ => {} // Ignore other events like Error, etc. for now
            }
        }

        // -- NEW: Check the captured exit code after the loop --
        match final_code {
            Some(0) => {
                // A code of 0 means success
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: true,
                    message: format!("Successfully converted to {}", output_ext),
                });
            }
            Some(code) => {
                // Any other code is a failure
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: false,
                    message: format!("FFmpeg failed with exit code {}. Last message: {}", code, error_message),
                });
            }
            None => {
                // This case is unlikely but means the process didn't terminate cleanly
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: false,
                    message: "FFmpeg process did not terminate correctly.".to_string(),
                });
            }
        }
    }

    Ok(statuses)
}
