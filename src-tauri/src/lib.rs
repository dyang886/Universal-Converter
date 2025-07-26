// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

// --- Module from your existing code ---
mod converter;

// --- Structs from both versions ---
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(default)]
struct AppSettings {
    theme: String,
    language: String,
    auto_update: bool,
}

#[derive(Deserialize, Debug)]
pub struct AdvancedOptions {
    // codec: Option<String>,
}

#[derive(Serialize, Clone)]
struct FileConversionStatus {
    path: String,
    success: bool,
    message: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        let theme = match dark_light::detect() {
            Ok(dark_light::Mode::Dark) => "dark".to_string(),
            Ok(dark_light::Mode::Light) => "light".to_string(),
            Ok(dark_light::Mode::Unspecified) => "dark".to_string(),
            Err(_) => "dark".to_string(),
        };

        let language = match sys_locale::get_locale() {
            Some(locale) => {
                match locale.as_str() {
                    "zh-CN" => "zh_CN".to_string(),
                    "zh-HK" | "zh-TW" => "zh_TW".to_string(),
                    s if s.starts_with("en") => "en_US".to_string(),
                    _ => "en_US".to_string(),
                }
            }
            None => "en_US".to_string()
        };

        Self {
            theme,
            language,
            auto_update: true,
        }
    }
}

// --- Helper function for settings path ---
fn get_settings_path() -> Option<PathBuf> {
    BaseDirs::new().map(|dirs| dirs.data_dir().join("UCT Settings").join("settings.json"))
}

// --- All Tauri Commands ---

#[tauri::command]
fn load_settings() -> AppSettings {
    let settings = if let Some(path) = get_settings_path() {
        fs::read_to_string(path)
            .ok() // Convert Result<String, Error> to Option<String>
            .and_then(|content| serde_json::from_str(&content).ok()) // Convert Result<T, E> to Option<T>
            .unwrap_or_else(AppSettings::default) // If any step failed, create new default settings
    } else {
        AppSettings::default() // If we can't even get the path, create defaults
    };

    // Save the potentially updated settings back to the file.
    // This ensures that if a new field was added, it gets written to disk.
    let _ = save_settings(settings.clone());

    settings
}

#[tauri::command]
fn save_settings(settings: AppSettings) -> Result<(), String> {
    if let Some(path) = get_settings_path() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
        fs::write(path, content).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Could not determine settings path".into())
    }
}

#[tauri::command]
async fn convert_files(
    handle: tauri::AppHandle, input_paths: Vec<String>, output_ext: String, options: AdvancedOptions,
) -> Result<Vec<FileConversionStatus>, String> {
    println!("Received request to convert {} files to .{}", input_paths.len(), output_ext);
    println!("Options: {:?}", options);
    converter::run_conversion(handle, input_paths, output_ext, options).await
}

// --- Main application entry point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_files, load_settings, save_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
