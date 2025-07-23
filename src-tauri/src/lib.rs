mod converter;

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AdvancedOptions {
    // Example for a future option
    codec: Option<String>,
}

#[derive(serde::Serialize, Clone)]
struct FileConversionStatus {
    path: String,
    success: bool,
    message: String,
}

#[tauri::command]
async fn convert_files(handle: tauri::AppHandle, input_paths: Vec<String>, output_ext: String, options: AdvancedOptions) -> Result<Vec<FileConversionStatus>, String> {
    println!("Received request to convert {} files to .{}", input_paths.len(), output_ext);
    println!("Options: {:?}", options);

    // Delegate the actual work to our converter module
    converter::run_conversion(handle, input_paths, output_ext, options).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
