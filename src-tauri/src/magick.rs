use std::collections::HashMap;
use std::path::PathBuf;

use tauri::AppHandle;

use crate::{emit_error, emit_success, run_cli_command};

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: HashMap<String, String>,
) -> Result<bool, String> {
    let mut all_files_converted_successfully = true;

    for path_str in input_paths {
        let original_input_path = PathBuf::from(&path_str);

        let original_file_stem = original_input_path.file_stem().unwrap_or_default().to_string_lossy();
        let new_file_name = format!("{}_UCT.{}", original_file_stem, output_ext);
        let output_path = original_input_path.with_file_name(new_file_name);

        let mut magick_args: Vec<String> = vec![original_input_path.to_string_lossy().to_string()];

        let mut push_split = |s: &str| {
            for part in s.split_whitespace() {
                let cleaned = part.trim_matches('"').trim_matches('\'').to_string();
                magick_args.push(cleaned);
            }
        };

        for (key, value) in &options {
            push_split(key);
            if !value.is_empty() {
                push_split(value);
            }
        }

        // Add the output path
        magick_args.push(output_path.to_string_lossy().to_string());

        // Print the full command for debugging
        let full_command = format!("magick {}", magick_args.join(" "));
        println!("Full magick command: {}", full_command);

        match run_cli_command(&handle, &path_str, "magick", &magick_args).await {
            Ok(magick_log) => {
                emit_success(&handle, &path_str, &original_input_path, magick_log);
            }
            Err(e) => {
                emit_error(&handle, &path_str, &original_input_path, e);
                all_files_converted_successfully = false;
            }
        };
    }

    Ok(all_files_converted_successfully)
}
