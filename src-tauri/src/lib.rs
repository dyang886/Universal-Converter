use std::sync::Mutex;
use tauri::State;

#[derive(Default)]
struct FilePathStore(Mutex<Vec<String>>);

#[tauri::command]
fn store_file_paths(
    file_paths: Vec<String>,
    state: State<FilePathStore>,
) -> Result<Vec<String>, String> {
    let mut store = state.0.lock().map_err(|e| format!("Mutex error: {}", e))?;
    store.extend(file_paths);
    println!("Stored file paths: {:?}", *store);
    Ok(store.clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(FilePathStore(Mutex::new(Vec::new())))
        .invoke_handler(tauri::generate_handler![store_file_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
