use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::time::Duration;

use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

mod ffmpeg;
mod secret_config;

#[derive(Deserialize, Debug)]
struct UpdateInfo {
    latest_version: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct AppSettings {
    theme: String,
    language: String,
    auto_update: bool,
}

#[derive(Serialize, Clone, Debug)]
pub struct LocalizedText {
    key: String,
    vars: HashMap<String, String>,
}

#[derive(Serialize, Clone)]
struct ConversionLogPayload {
    file_path: String,
    status_message: LocalizedText,
    terminal_output: Option<String>,
    success: Option<bool>,
}

#[derive(Deserialize, Debug)]
pub struct ConversionRequest {
    tool: String,
    options: HashMap<String, String>,
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
            Some(locale) => match locale.as_str() {
                "zh-CN" => "zh_CN".to_string(),
                "zh-HK" | "zh-TW" => "zh_TW".to_string(),
                s if s.starts_with("en") => "en_US".to_string(),
                _ => "en_US".to_string(),
            },
            None => "en_US".to_string(),
        };

        Self {
            theme,
            language,
            auto_update: true,
        }
    }
}

fn get_settings_path() -> Option<PathBuf> {
    BaseDirs::new().map(|dirs| dirs.data_dir().join("UCT Settings").join("settings.json"))
}

// --- Tauri Commands ---
#[tauri::command]
fn load_settings() -> AppSettings {
    let settings = if let Some(path) = get_settings_path() {
        fs::read_to_string(path)
            .ok()
            .and_then(|content| serde_json::from_str(&content).ok())
            .unwrap_or_else(AppSettings::default)
    } else {
        AppSettings::default()
    };

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
async fn check_for_updates(app_name: String) -> Result<String, String> {
    let client = reqwest::Client::new();

    let response = client
        .get(secret_config::VERSION_CHECKER_API_GATEWAY_ENDPOINT.as_str())
        .header("x-api-key", secret_config::CLIENT_API_KEY.as_str())
        .query(&[("appName", app_name)])
        .timeout(Duration::from_secs(15))
        .send()
        .await
        .map_err(|e| format!("Error sending request: {}", e))?;

    if response.status().is_success() {
        match response.json::<UpdateInfo>().await {
            Ok(data) => Ok(data.latest_version),
            Err(e) => Err(format!("Error parsing JSON response: {}", e)),
        }
    } else {
        Err(format!("Server responded with status: {}", response.status()))
    }
}

#[tauri::command]
async fn launch_updater(app_handle: AppHandle, latest_version: String, theme: String, language: String) -> Result<(), String> {
    let pid = std::process::id().to_string();
    let s3_path = format!("UCT/Universal Converter Setup {}.exe", latest_version);
    let args = vec!["--pid", &pid, "--s3-path", &s3_path, "--theme", &theme, "--language", &language];

    app_handle
        .shell()
        .command("Updater")
        .args(args)
        .spawn()
        .map_err(|e| format!("Failed to spawn updater: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn convert_files(handle: AppHandle, input_paths: Vec<String>, output_ext: String, request: ConversionRequest) -> Result<bool, String> {
    println!("Received request to convert {} files to .{}", input_paths.len(), output_ext);
    println!("Tool: {}, Options: {:?}", request.tool, request.options);

    match request.tool.as_str() {
        "ffmpeg" => ffmpeg::run_conversion(handle, input_paths, output_ext, request.options).await,
        _ => Err(format!("Unsupported tool requested: {}", request.tool)),
    }
}

#[tauri::command]
async fn get_dynamic_options(handle: AppHandle, widget_name: String, codec: String) -> Result<Vec<String>, String> {
    let shell = handle.shell();
    let encoder_arg = format!("encoder={}", codec);
    let command_args = vec!["-hide_banner", "-h", &encoder_arg];

    let (mut rx, _child) = shell
        .command("ffmpeg")
        .args(command_args)
        .spawn()
        .map_err(|e| format!("Failed to spawn ffmpeg process: {}", e))?;

    let mut full_output = String::new();

    while let Some(event) = rx.recv().await {
        if let tauri_plugin_shell::process::CommandEvent::Stdout(line) = event {
            full_output.push_str(&String::from_utf8_lossy(&line));
        }
    }

    let key_phrase_to_find = match widget_name.as_str() {
        // Audio
        "sample_rate" => "Supported sample rates",
        "sample_format" => "Supported sample formats",
        "channel_layout" => "Supported channel layouts",
        // Video
        "framerate_DYN" => "Supported framerates",
        "pixel_format" => "Supported pixel formats",
        _ => return Err(format!("Unknown dynamic widget requested: {}", widget_name)),
    };

    let line = full_output
        .lines()
        .find(|l| l.trim().starts_with(key_phrase_to_find))
        .ok_or_else(|| format!("Could not find key phrase '{}' in ffmpeg output.", key_phrase_to_find))?;

    let options_str = line
        .splitn(2, ':')
        .nth(1)
        .ok_or_else(|| format!("Malformed line for '{}': {}", key_phrase_to_find, line))?;

    let mut unique_options: Vec<String> = Vec::new();
    for option in options_str.split_whitespace() {
        let opt_string = option.to_string();
        if !unique_options.contains(&opt_string) {
            unique_options.push(opt_string);
        }
    }

    Ok(unique_options)
}

// --- Main application entry point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_settings,
            save_settings,
            check_for_updates,
            launch_updater,
            convert_files,
            get_dynamic_options
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
