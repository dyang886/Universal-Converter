use std::collections::HashMap;
use std::path::PathBuf;

use tauri::AppHandle;

use crate::{emit_error, emit_success, run_cli_command};

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: HashMap<String, String>, combine: bool,
) -> Result<bool, String> {
    let batches: Vec<&[String]> = if combine {
        vec![input_paths.as_slice()]
    } else {
        input_paths.chunks(1).collect()
    };

    let mut all_ok = true;

    for batch in batches {
        let representative = PathBuf::from(&batch[0]);
        let output = representative.with_file_name(format!(
            "{}_UCT.{}",
            representative.file_stem().unwrap_or_default().to_string_lossy(),
            output_ext
        ));

        let mut args: Vec<String> = batch.to_vec();
        append_options(&mut args, &options);
        args.push(output.to_string_lossy().to_string());

        println!("Full magick command: magick {}", args.join(" "));

        match run_cli_command(&handle, &batch[0], "magick", &args).await {
            Ok(log) => emit_success(&handle, &batch[0], &representative, log),
            Err(e) => {
                emit_error(&handle, &batch[0], &representative, e);
                all_ok = false;
            }
        }
    }

    Ok(all_ok)
}

fn append_options(args: &mut Vec<String>, options: &HashMap<String, String>) {
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
