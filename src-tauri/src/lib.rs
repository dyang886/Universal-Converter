use indexmap::IndexMap;
use std::collections::HashMap;
use std::fs;
#[cfg(windows)]
use std::os::windows::ffi::OsStrExt;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};

use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use tokio::fs as async_fs;
#[cfg(windows)]
use windows_sys::Win32::UI::{Shell::ShellExecuteW, WindowsAndMessaging::SW_SHOWNORMAL};

mod document;
mod ffmpeg;
mod magick;
mod metadata;
mod routing;
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
    #[serde(default)]
    #[serde(rename = "inputGroup")]
    input_group: String,
    #[serde(rename = "outputGroup")]
    output_group: String,
    #[serde(default)]
    options: IndexMap<String, String>,
    #[serde(default)]
    controls: ConversionControls,
    #[serde(default)]
    combine: bool,
    #[serde(default, rename = "umInputPaths")]
    um_input_paths: Vec<String>,
    #[serde(default, rename = "audioInputPaths")]
    audio_input_paths: Vec<String>,
}

#[derive(Deserialize, Debug, Default, Clone)]
#[serde(default, rename_all = "camelCase")]
pub struct ConversionControls {
    pub combine_inputs: bool,
    pub um_input_paths: Vec<String>,
    pub audio_input_paths: Vec<String>,
    pub ocr: Option<OcrControls>,
}

#[derive(Deserialize, Debug, Default, Clone)]
#[serde(default, rename_all = "camelCase")]
pub struct OcrControls {
    pub enabled: bool,
    pub args: Vec<String>,
}

pub struct AppState {
    pub cancel_flag: Arc<AtomicBool>,
    pub dependency_cancel_flag: Arc<AtomicBool>,
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
    let _ = app_handle;
    let pid = std::process::id().to_string();
    let s3_path = format!("UCT/Universal Converter Setup {}.exe", latest_version);
    let exe_path = std::env::current_exe().map_err(|e| format!("Failed to resolve current executable path: {}", e))?;
    let updater_path = exe_path
        .parent()
        .ok_or_else(|| "Failed to resolve current executable directory".to_string())?
        .join("Updater.exe");
    let params = format!("--pid {} --s3-path \"{}\" --theme {} --language {}", pid, s3_path, theme, language);

    let operation: Vec<u16> = "runas".encode_utf16().chain(std::iter::once(0)).collect();
    let file: Vec<u16> = updater_path.as_os_str().encode_wide().chain(std::iter::once(0)).collect();
    let parameters: Vec<u16> = params.encode_utf16().chain(std::iter::once(0)).collect();

    let result = unsafe {
        ShellExecuteW(
            std::ptr::null_mut(),
            operation.as_ptr(),
            file.as_ptr(),
            parameters.as_ptr(),
            std::ptr::null(),
            SW_SHOWNORMAL,
        )
    };

    if result as isize <= 32 {
        return Err("Failed to launch updater with administrator privileges".to_string());
    }

    Ok(())
}

#[tauri::command]
fn stop_conversion(state: tauri::State<'_, AppState>) {
    state.cancel_flag.store(true, Ordering::Relaxed);
}

#[tauri::command]
fn get_dependency_statuses(handle: AppHandle) -> Result<Vec<routing::DependencyPackStatus>, String> {
    routing::dependency_pack_statuses(&handle)
}

#[tauri::command]
async fn check_dependency_updates(handle: AppHandle) -> Result<Vec<routing::DependencyPackStatus>, String> {
    routing::dependency_pack_statuses_with_updates(&handle).await
}

#[tauri::command]
fn cancel_dependency_download(state: tauri::State<'_, AppState>) {
    state.dependency_cancel_flag.store(true, Ordering::Relaxed);
}

#[tauri::command]
async fn download_dependency_pack(
    handle: AppHandle, state: tauri::State<'_, AppState>, pack_id: String,
) -> Result<routing::DependencyPackStatus, String> {
    state.dependency_cancel_flag.store(false, Ordering::Relaxed);
    let cancel_flag = Arc::clone(&state.dependency_cancel_flag);
    routing::download_and_install_dependency_pack(handle, pack_id, cancel_flag).await
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
    let input_ext = input_paths
        .first()
        .and_then(|path| PathBuf::from(path).extension().and_then(|ext| ext.to_str()).map(str::to_ascii_lowercase))
        .unwrap_or_default();
    let combine_inputs = request.controls.combine_inputs || request.combine;
    let ocr_controls = request.controls.ocr.clone();
    let ocr_enabled = ocr_controls.as_ref().is_some_and(|ocr| ocr.enabled);
    let route = routing::resolve_route(&request.input_group, &input_ext, &request.output_group, &output_ext, ocr_enabled)?;
    let um_input_paths = if request.controls.um_input_paths.is_empty() {
        request.um_input_paths
    } else {
        request.controls.um_input_paths
    };
    let audio_input_paths = if request.controls.audio_input_paths.is_empty() {
        request.audio_input_paths
    } else {
        request.controls.audio_input_paths
    };

    let missing_dependency_packs = routing::missing_dependency_packs(&handle, &route.packs)?;
    if !missing_dependency_packs.is_empty() {
        return Err(format!("missing_dependencies:{}", missing_dependency_packs.join(",")));
    }

    match route.kind {
        routing::ConversionRouteKind::Ffmpeg => {
            ffmpeg::run_conversion(
                handle,
                input_paths,
                output_ext,
                request.options,
                um_input_paths,
                audio_input_paths,
                request.output_group,
                cancel_flag,
                max_threads,
            )
            .await
        }
        routing::ConversionRouteKind::Magick => {
            magick::run_conversion(handle, input_paths, output_ext, request.options, combine_inputs, cancel_flag, max_threads).await
        }
        routing::ConversionRouteKind::DocumentPostscript
        | routing::ConversionRouteKind::DocumentOcr
        | routing::ConversionRouteKind::DocumentPandoc
        | routing::ConversionRouteKind::DocumentPandocToPdf
        | routing::ConversionRouteKind::DocumentPandocToImage
        | routing::ConversionRouteKind::DocumentOfficeToDocument
        | routing::ConversionRouteKind::DocumentOfficeToImage => {
            document::run_conversion(
                handle,
                input_paths,
                output_ext,
                route.kind,
                route.packs,
                request.output_group,
                request.options,
                combine_inputs,
                ocr_controls,
                cancel_flag,
                max_threads,
            )
            .await
        }
    }
}

#[tauri::command]
async fn get_dynamic_options(handle: AppHandle, widget_name: String, codec: String) -> Result<Vec<String>, String> {
    let shell = handle.shell();
    let encoder_arg = format!("encoder={}", codec);
    let command_args = vec!["-hide_banner", "-h", &encoder_arg];
    let command_packs = routing::command_packs("ffmpeg");
    let command_env = routing::dependency_env(&handle, &command_packs)?;

    let (mut rx, _child) = shell
        .command("ffmpeg")
        .args(command_args)
        .envs(command_env)
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

#[tauri::command]
async fn get_file_metadata(handle: AppHandle, file_path: String) -> Result<metadata::MetadataResponse, String> {
    metadata::read_file_metadata(handle, file_path).await
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
    handle: &AppHandle, original_path_str: &str, program: &str, args: &[String], cancel_flag: &Arc<AtomicBool>, pack_ids: &[String],
) -> Result<(), String> {
    let new_env = routing::dependency_env(handle, pack_ids)?;

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
            dependency_cancel_flag: Arc::new(AtomicBool::new(false)),
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
            get_dependency_statuses,
            check_dependency_updates,
            download_dependency_pack,
            cancel_dependency_download,
            convert_files,
            stop_conversion,
            get_dynamic_options,
            get_file_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
