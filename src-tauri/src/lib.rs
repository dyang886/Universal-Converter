use indexmap::IndexMap;
use std::collections::HashMap;
use std::env;
use std::ffi::OsStr;
use std::fs;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};

use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use tokio::fs as async_fs;

mod ffmpeg;
mod magick;
mod secret_config;

pub const THROTTLE_INTERVAL: Duration = Duration::from_millis(500);

#[derive(Deserialize, Debug)]
struct UpdateInfo {
    latest_version: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct AppSettings {
    theme: String,
    language: String,
    auto_update: bool,
    max_threads: u8,
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
    #[serde(default)]
    group: String,
    options: IndexMap<String, String>,
    #[serde(default)]
    combine: bool,
    #[serde(default, rename = "umInputPaths")]
    um_input_paths: Vec<String>,
    #[serde(default, rename = "audioInputPaths")]
    audio_input_paths: Vec<String>,
}

pub struct AppState {
    pub cancel_flag: Arc<AtomicBool>,
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
            max_threads: 3,
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
        .get(secret_config::VERSION_CHECKER_ENDPOINT.as_str())
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
fn stop_conversion(state: tauri::State<'_, AppState>) {
    state.cancel_flag.store(true, Ordering::Relaxed);
}

#[tauri::command]
async fn convert_files(
    handle: AppHandle, state: tauri::State<'_, AppState>, input_paths: Vec<String>, output_ext: String, request: ConversionRequest,
) -> Result<bool, String> {
    let max_threads = load_settings().max_threads as usize;

    println!(
        "\nReceived request to convert {} files to .{} (max_threads={})",
        input_paths.len(),
        output_ext,
        max_threads
    );

    state.cancel_flag.store(false, Ordering::Relaxed);
    let cancel_flag = Arc::clone(&state.cancel_flag);

    match request.tool.as_str() {
        "ffmpeg" => {
            ffmpeg::run_conversion(
                handle,
                input_paths,
                output_ext,
                request.options,
                request.um_input_paths,
                request.audio_input_paths,
                request.group,
                cancel_flag,
                max_threads,
            )
            .await
        }
        "magick" => {
            magick::run_conversion(
                handle,
                input_paths,
                output_ext,
                request.options,
                request.combine,
                cancel_flag,
                max_threads,
            )
            .await
        }
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

// --- Common helper functions for CLI command execution ---

/// Create a HashMap with a single file path for localization context
pub fn create_vars(file_path: String) -> HashMap<String, String> {
    let mut vars = HashMap::new();
    vars.insert("file".to_string(), file_path);
    vars
}

pub fn emit_success(handle: &AppHandle, path_str: &str, original_path: &PathBuf) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.success".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: None,
                success: Some(true),
            },
        )
        .unwrap();
}

pub fn emit_error(handle: &AppHandle, path_str: &str, original_path: &PathBuf) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.failure".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: None,
                success: Some(false),
            },
        )
        .unwrap();
}

pub fn emit_cancelled(handle: &AppHandle, path_str: &str, original_path: &PathBuf) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.cancelled".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: None,
                success: Some(false),
            },
        )
        .unwrap();
}

/// Emit a raw output delta for a file that is still converting.
/// An empty chunk registers the file in the terminal log without any output.
pub fn emit_delta(handle: &AppHandle, path_str: &str, original_path: &PathBuf, chunk: String) {
    handle
        .emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.converting".to_string(),
                    vars: create_vars(original_path.display().to_string()),
                },
                terminal_output: Some(chunk),
                success: None,
            },
        )
        .unwrap();
}

pub async fn find_first_file_in_dir(dir: &PathBuf) -> Result<Option<PathBuf>, String> {
    let mut entries = async_fs::read_dir(dir).await.map_err(|e| e.to_string())?;
    if let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        Ok(Some(entry.path()))
    } else {
        Ok(None)
    }
}

/// Returns `Err("cancelled")` if the cancel flag fires mid-run, `Err(_)` on process failure.
pub async fn run_cli_command(
    handle: &AppHandle, original_path_str: &str, program: &str, args: &[String], cancel_flag: &Arc<AtomicBool>,
) -> Result<(), String> {
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;

    let mut new_env = HashMap::new();
    if let Some(path_var) = std::env::var_os("PATH") {
        let mut paths = std::env::split_paths(&path_var).collect::<Vec<_>>();
        paths.insert(0, resource_dir.clone());
        paths.insert(0, resource_dir.join("resources").join("ImageMagick").join("libjxr"));
        paths.insert(0, resource_dir.join("resources").join("ImageMagick").join("libheif"));
        let new_path = std::env::join_paths(paths).unwrap_or_else(|_| OsStr::new("").to_os_string());
        new_env.insert("PATH".to_string(), new_path);
    }
    if program == "magick" {
        new_env.insert(
            "MAGICK_CONFIGURE_PATH".to_string(),
            resource_dir.join("resources").join("ImageMagick").into_os_string(),
        );
    }

    let (mut rx, child) = handle
        .shell()
        .command(program)
        .args(args)
        .envs(new_env)
        .spawn()
        .map_err(|e| format!("Failed to spawn '{}'. Error: {}", program, e))?;

    let mut unsent = String::new();
    let mut last_update = Instant::now();
    let original_path = PathBuf::from(original_path_str);
    let mut succeeded = false;

    loop {
        if cancel_flag.load(Ordering::Relaxed) {
            let _ = child.kill();
            return Err("cancelled".to_string());
        }

        match tokio::time::timeout(Duration::from_millis(50), rx.recv()).await {
            Ok(Some(CommandEvent::Stderr(line) | CommandEvent::Stdout(line))) => {
                unsent.push_str(&String::from_utf8_lossy(&line));

                if last_update.elapsed() >= THROTTLE_INTERVAL {
                    emit_delta(handle, original_path_str, &original_path, std::mem::take(&mut unsent));
                    last_update = Instant::now();
                }
            }
            Ok(Some(CommandEvent::Terminated(payload))) => {
                succeeded = payload.code == Some(0);
                break;
            }
            Ok(None) => break,
            Ok(Some(_)) => {}
            Err(_) => {} // timeout — loop back to check cancel flag
        }
    }

    // Flush remaining unsent output
    emit_delta(handle, original_path_str, &original_path, std::mem::take(&mut unsent));

    if cancel_flag.load(Ordering::Relaxed) {
        return Err("cancelled".to_string());
    }

    if !succeeded {
        return Err("failed".to_string());
    }

    Ok(())
}

// --- Main application entry point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            cancel_flag: Arc::new(AtomicBool::new(false)),
        })
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
            stop_conversion,
            get_dynamic_options
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
