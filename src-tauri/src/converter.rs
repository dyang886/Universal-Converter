use crate::{AdvancedOptions, FileConversionStatus};
use std::path::{PathBuf};
use tauri::AppHandle;
use tauri_plugin_shell::{ShellExt, process::CommandEvent};

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: AdvancedOptions,
) -> Result<Vec<FileConversionStatus>, String> {
    let shell = handle.shell();
    let mut statuses = Vec::new();

    for path_str in input_paths {
        let input_path = PathBuf::from(&path_str);
        let mut output_path = input_path.clone();
        output_path.set_extension(&output_ext);

        let original_path_str = path_str.clone();

        // --- Argument Building Logic ---
        let mut args: Vec<String> = Vec::new();

        // 1. Add the mandatory input and output files
        args.push("-i".to_string());
        args.push(input_path.to_string_lossy().to_string());

        // 2. Add all the user-defined advanced options from the frontend
        for (key, value) in &options.options {
            // This handles both flags (like "-vcodec") and options with values ("libx264")
            args.push(key.clone());
            if !value.is_empty() {
                args.push(value.clone());
            }
        }

        // 3. Add format-specific or mandatory arguments
        // This is where you can add special logic. For example, always overwrite.
        args.push("-stats".to_string()); // Overwrite output file if it exists

        // Example: Add a specific metadata tag for mp3 files

        // 4. Finally, add the output path argument
        args.push(output_path.to_string_lossy().to_string());

        println!("Executing ffmpeg with args: {:?}", &args);

        // --- Modern Command Execution ---
        let (mut rx, _child) = shell
            .command("ffmpeg") // Use .command() for sidecars in v2
            .args(&args) // Pass the constructed argument vector
            .spawn()
            .map_err(|e| e.to_string())?;

        let mut final_code: Option<i32> = None;
        let mut error_output = String::new();

        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stderr(line) => {
                    let line_str = String::from_utf8_lossy(&line).to_string();
                    println!("[FFmpeg Stdout]: {}", &line_str);
                    // error_output.push_str(&line_str);
                    // error_output.push('\n');
                }
                CommandEvent::Terminated(payload) => {
                    final_code = payload.code;
                }
                CommandEvent::Stdout(line) => {
                    println!("[FFmpeg Stdout]: {}", String::from_utf8_lossy(&line));
                }
                _ => {} // Ignore other events
            }
        }

        // You can also use child.wait() to get the final status if you don't need to stream output
        // let status = child.wait().await.map_err(|e| e.to_string())?;

        match final_code {
            Some(0) => {
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: true,
                    message: format!("Successfully converted to {}", output_ext),
                });
            }
            Some(code) => {
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: false,
                    message: format!("FFmpeg failed with exit code {}. Details: {}", code, error_output.trim()),
                });
            }
            None => {
                statuses.push(FileConversionStatus {
                    path: original_path_str,
                    success: false,
                    message: "FFmpeg process did not terminate correctly or was killed.".to_string(),
                });
            }
        }
    }

    Ok(statuses)
}
