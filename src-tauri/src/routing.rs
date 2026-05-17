use std::collections::HashMap;
use std::ffi::OsString;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicU64, AtomicUsize, Ordering};
use std::sync::{Arc, Mutex, OnceLock};
use std::time::{Duration, Instant};

use reqwest::header::{ACCEPT_RANGES, CONTENT_LENGTH, RANGE};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tokio::fs;
use tokio::io::{AsyncSeekExt, AsyncWriteExt};
use tokio::process::Command;
use uuid::Uuid;

use crate::secret_config;

const ROUTING_JSON: &str = include_str!("../../src/shared/conversion-routing.json");
const DEPENDENCY_MANIFEST_S3_PATH: &str = "UCT/Data/manifest.json";
const PARALLEL_DOWNLOAD_THRESHOLD: u64 = 2 * 1024 * 1024;
const DEPENDENCY_PROGRESS_EVENT: &str = "dependency-progress";
const SEVEN_ZIP_EXE: &str = "7zip/7za.exe";

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoutingConfig {
    packs: HashMap<String, DependencyPack>,
    routes: Vec<RouteRule>,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
pub struct DependencyPack {
    pub name: String,
    pub version: String,
    pub platform: String,
    #[serde(default)]
    pub bundled: bool,
    pub root_dir: String,
    pub commands: Vec<String>,
    pub bin_dirs: Vec<String>,
    pub required_files: Vec<String>,
    pub env: HashMap<String, EnvValue>,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(untagged)]
pub enum EnvValue {
    One(String),
    Many(Vec<String>),
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RouteRule {
    kind: ConversionRouteKind,
    input_group: Vec<String>,
    #[serde(default)]
    input_ext: Vec<String>,
    output_group: Vec<String>,
    #[serde(default)]
    output_ext: Vec<String>,
    packs: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum ConversionRouteKind {
    Ffmpeg,
    Magick,
    DocumentPandoc,
    DocumentPandocToPdf,
    DocumentPandocToImage,
    DocumentPostscript,
    DocumentOfficeToDocument,
    DocumentOfficeToImage,
}

#[derive(Clone, Debug)]
pub struct ConversionRoute {
    pub kind: ConversionRouteKind,
    pub packs: Vec<String>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DependencyPackStatus {
    pub id: String,
    pub name: String,
    pub version: String,
    pub installed_version: String,
    pub latest_version: Option<String>,
    pub update_available: bool,
    pub platform: String,
    pub bundled: bool,
    pub root_dir: String,
    pub install_path: String,
    pub installed: bool,
    pub missing_files: Vec<String>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DependencyProgressPayload {
    pub pack_id: String,
    pub state: String,
    pub progress: f32,
    pub downloaded_bytes: u64,
    pub total_bytes: u64,
    pub speed_bytes_per_sec: f64,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DependencyManifestEntry {
    pub version: String,
    pub platform: String,
    pub s3_path: String,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DependencyManifest {
    packs: HashMap<String, DependencyManifestEntry>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct InstalledPackMetadata {
    id: String,
    version: String,
    platform: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SignedUrlResponse {
    signed_url: String,
}

static ROUTING_CONFIG: OnceLock<RoutingConfig> = OnceLock::new();

pub fn config() -> &'static RoutingConfig {
    ROUTING_CONFIG.get_or_init(|| serde_json::from_str(ROUTING_JSON).expect("conversion routing JSON is valid"))
}

pub fn resolve_route(input_group: &str, input_ext: &str, output_group: &str, output_ext: &str) -> Result<ConversionRoute, String> {
    let input_group = input_group.to_ascii_lowercase();
    let input_ext = input_ext.to_ascii_lowercase();
    let output_group = output_group.to_ascii_lowercase();
    let output_ext = output_ext.to_ascii_lowercase();

    config()
        .routes
        .iter()
        .find(|route| route.matches(&input_group, &input_ext, &output_group, &output_ext))
        .map(|route| ConversionRoute {
            kind: route.kind.clone(),
            packs: route.packs.clone(),
        })
        .ok_or_else(|| {
            format!(
                "Unsupported conversion route: {} .{} -> {} .{}",
                input_group, input_ext, output_group, output_ext
            )
        })
}

pub fn command_packs(command: &str) -> Vec<String> {
    config()
        .packs
        .iter()
        .filter_map(|(id, pack)| pack.commands.iter().any(|candidate| candidate == command).then(|| id.clone()))
        .collect()
}

pub fn dependency_env(handle: &AppHandle, pack_ids: &[String]) -> Result<HashMap<String, OsString>, String> {
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;
    let packs = resolve_packs(pack_ids)?;
    let mut env = HashMap::new();

    if let Some(path_var) = std::env::var_os("PATH") {
        let mut paths = std::env::split_paths(&path_var).collect::<Vec<_>>();
        paths.insert(0, resource_dir.clone());
        for pack in packs.iter().rev() {
            for dir in pack.bin_dirs.iter().rev() {
                paths.insert(0, resolve_resource_path(&resource_dir, dir));
            }
        }
        let new_path = std::env::join_paths(paths).map_err(|e| e.to_string())?;
        env.insert("PATH".to_string(), new_path);
    }

    for pack in packs {
        for (key, value) in &pack.env {
            let value = match value {
                EnvValue::One(path) => resolve_resource_path(&resource_dir, path).into_os_string(),
                EnvValue::Many(paths) => {
                    let resolved = paths.iter().map(|path| resolve_resource_path(&resource_dir, path));
                    std::env::join_paths(resolved).map_err(|e| e.to_string())?
                }
            };
            env.insert(key.clone(), value);
        }
    }

    Ok(env)
}

pub fn core_utility_path(handle: &AppHandle, relative_path: &str) -> Result<PathBuf, String> {
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;
    Ok(resolve_resource_path(&resource_dir, relative_path))
}

pub fn seven_zip_path(handle: &AppHandle) -> Result<PathBuf, String> {
    core_utility_path(handle, SEVEN_ZIP_EXE)
}

#[allow(dead_code)]
pub fn exiftool_path(handle: &AppHandle) -> Result<PathBuf, String> {
    core_utility_path(handle, "exiftool/exiftool.exe")
}

pub fn missing_dependency_packs(handle: &AppHandle, pack_ids: &[String]) -> Result<Vec<String>, String> {
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;
    let mut missing = Vec::new();

    for (pack_id, pack) in resolve_pack_entries(pack_ids)? {
        let is_missing = pack
            .required_files
            .iter()
            .any(|required_file| !resolve_resource_path(&resource_dir, required_file).exists());

        if is_missing {
            missing.push(pack_id.to_string());
        }
    }

    Ok(missing)
}

pub fn dependency_pack_statuses(handle: &AppHandle) -> Result<Vec<DependencyPackStatus>, String> {
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;

    Ok(config()
        .packs
        .iter()
        .map(|(id, pack)| dependency_pack_status_with_latest(&resource_dir, id, pack, None))
        .collect())
}

pub async fn dependency_pack_statuses_with_updates(handle: &AppHandle) -> Result<Vec<DependencyPackStatus>, String> {
    let latest = fetch_dependency_manifest().await?;
    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;

    Ok(config()
        .packs
        .iter()
        .map(|(id, pack)| dependency_pack_status_with_latest(&resource_dir, id, pack, latest.get(id)))
        .collect())
}

pub async fn download_and_install_dependency_pack(
    handle: AppHandle, pack_id: String, cancel_flag: Arc<AtomicBool>,
) -> Result<DependencyPackStatus, String> {
    let pack = config()
        .packs
        .get(&pack_id)
        .ok_or_else(|| format!("Unknown dependency pack '{}'", pack_id))?;
    let manifest = fetch_dependency_manifest().await?;
    let entry = manifest
        .get(&pack_id)
        .ok_or_else(|| format!("No downloadable package is available for {}.", pack.name))?;

    if entry.platform != "windows" {
        return Err(format!(
            "Dependency package platform mismatch for {}: expected windows, got {}.",
            pack.name, entry.platform
        ));
    }

    let resource_dir = handle.path().resource_dir().map_err(|e| e.to_string())?;
    let target_root = resolve_resource_path(&resource_dir, &pack.root_dir);
    ensure_dependency_target_writable(&target_root)?;
    check_dependency_cancelled(&cancel_flag)?;

    emit_dependency_progress(&handle, &pack_id, "requesting-url", 0.0, 0, 0, 0.0)?;
    let signed_url = fetch_signed_url(&entry.s3_path).await?;
    check_dependency_cancelled(&cancel_flag)?;

    let temp_dir = std::env::temp_dir().join(format!("uct-dependency-{}-{}", pack_id, Uuid::new_v4()));
    fs::create_dir_all(&temp_dir).await.map_err(|e| e.to_string())?;
    let archive_path = temp_dir.join(format!("{}.7z", pack_id));
    let stage_root = temp_dir.join("stage");

    let result = async {
        let downloaded_size = download_archive(&handle, &pack_id, &signed_url, &archive_path, &cancel_flag).await?;
        check_dependency_cancelled(&cancel_flag)?;
        emit_dependency_progress(&handle, &pack_id, "extracting", 1.0, downloaded_size, downloaded_size, 0.0)?;
        extract_archive(&handle, &archive_path, &stage_root, &cancel_flag).await?;
        check_dependency_cancelled(&cancel_flag)?;
        let extracted_root = find_extracted_pack_root(&stage_root, &pack_id, pack)?;
        validate_extracted_pack(&extracted_root, pack)?;
        check_dependency_cancelled(&cancel_flag)?;
        replace_pack_root(&extracted_root, &target_root).await?;
        write_pack_metadata(&target_root, &pack_id, &entry.version, &entry.platform).await?;
        emit_dependency_progress(&handle, &pack_id, "complete", 1.0, downloaded_size, downloaded_size, 0.0)?;
        Ok(dependency_pack_status_with_latest(&resource_dir, &pack_id, pack, Some(entry)))
    }
    .await;

    let _ = fs::remove_dir_all(&temp_dir).await;
    result
}

fn resolve_packs(pack_ids: &[String]) -> Result<Vec<&'static DependencyPack>, String> {
    resolve_pack_entries(pack_ids).map(|entries| entries.into_iter().map(|(_, pack)| pack).collect())
}

fn resolve_pack_entries(pack_ids: &[String]) -> Result<Vec<(&str, &'static DependencyPack)>, String> {
    let mut packs = Vec::new();
    for pack_id in pack_ids {
        let pack = config()
            .packs
            .get(pack_id)
            .ok_or_else(|| format!("Unknown dependency pack '{}'", pack_id))?;
        packs.push((pack_id.as_str(), pack));
    }
    Ok(packs)
}

fn resolve_resource_path(resource_dir: &Path, relative_path: &str) -> PathBuf {
    if relative_path == "." {
        resource_dir.to_path_buf()
    } else {
        resource_dir.join(relative_path)
    }
}

fn dependency_pack_status_with_latest(
    resource_dir: &Path, id: &str, pack: &DependencyPack, latest: Option<&DependencyManifestEntry>,
) -> DependencyPackStatus {
    let missing_files = pack
        .required_files
        .iter()
        .filter(|required_file| !resolve_resource_path(resource_dir, required_file).exists())
        .cloned()
        .collect::<Vec<_>>();
    let pack_root = resolve_resource_path(resource_dir, &pack.root_dir);
    let installed_metadata = read_installed_pack_metadata_sync(&pack_root);
    let installed = missing_files.is_empty();
    let installed_version = if installed {
        installed_metadata
            .as_ref()
            .map(|metadata| metadata.version.clone())
            .unwrap_or_else(|| pack.version.clone())
    } else {
        String::new()
    };
    let latest_version = latest.map(|entry| entry.version.clone());
    let update_available = latest_version
        .as_ref()
        .is_some_and(|version| installed && !installed_version.is_empty() && version != &installed_version);

    DependencyPackStatus {
        id: id.to_string(),
        name: pack.name.clone(),
        version: pack.version.clone(),
        installed_version,
        latest_version,
        update_available,
        platform: pack.platform.clone(),
        bundled: pack.bundled,
        root_dir: pack.root_dir.clone(),
        install_path: clean_display_path(&pack_root),
        installed,
        missing_files,
    }
}

fn clean_display_path(path: &Path) -> String {
    path.display().to_string().trim_start_matches(r"\\?\").to_string()
}

fn read_installed_pack_metadata_sync(pack_root: &Path) -> Option<InstalledPackMetadata> {
    let path = pack_root.join("pack.json");
    std::fs::read_to_string(path).ok().and_then(|content| serde_json::from_str(&content).ok())
}

async fn write_pack_metadata(pack_root: &Path, id: &str, version: &str, platform: &str) -> Result<(), String> {
    let metadata = InstalledPackMetadata {
        id: id.to_string(),
        version: version.to_string(),
        platform: platform.to_string(),
    };
    let content = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
    fs::write(pack_root.join("pack.json"), content).await.map_err(|e| e.to_string())
}

async fn fetch_dependency_manifest() -> Result<HashMap<String, DependencyManifestEntry>, String> {
    let signed_url = fetch_signed_url(DEPENDENCY_MANIFEST_S3_PATH).await?;
    let client = reqwest::Client::new();
    let response = client
        .get(signed_url)
        .send()
        .await
        .map_err(|e| concise_request_error("manifest request failed", &e))?;

    if !response.status().is_success() {
        return Err(format!("manifest request failed: HTTP {}", response.status().as_u16()));
    }

    let manifest = response
        .json::<DependencyManifest>()
        .await
        .map_err(|_| "manifest parse failed".to_string())?;

    Ok(manifest.packs)
}

async fn fetch_signed_url(s3_path: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .get(secret_config::SIGNED_URL_DOWNLOAD_ENDPOINT.as_str())
        .header("x-api-key", secret_config::CLIENT_API_KEY.as_str())
        .query(&[("filePath", s3_path)])
        .send()
        .await
        .map_err(|e| concise_request_error("signed URL request failed", &e))?;

    if !response.status().is_success() {
        return Err(format!("signed URL request failed: HTTP {}", response.status().as_u16()));
    }

    response
        .json::<SignedUrlResponse>()
        .await
        .map(|body| body.signed_url)
        .map_err(|_| "signed URL parse failed".to_string())
}

fn concise_request_error(context: &str, error: &reqwest::Error) -> String {
    if let Some(status) = error.status() {
        format!("{}: HTTP {}", context, status.as_u16())
    } else if error.is_timeout() {
        format!("{}: timeout", context)
    } else if error.is_connect() {
        format!("{}: connection", context)
    } else if error.is_decode() {
        format!("{}: decode", context)
    } else {
        context.to_string()
    }
}

fn ensure_dependency_target_writable(target_root: &Path) -> Result<(), String> {
    let parent = target_root
        .parent()
        .ok_or_else(|| format!("Invalid dependency target path: {}", target_root.display()))?;
    std::fs::create_dir_all(parent)
        .map_err(|e| format!("elevation_required: Could not prepare dependency directory '{}': {}", parent.display(), e))?;

    let probe = parent.join(format!(".uct-write-probe-{}", Uuid::new_v4()));
    match std::fs::write(&probe, b"probe") {
        Ok(()) => {
            let _ = std::fs::remove_file(probe);
            Ok(())
        }
        Err(e) => Err(format!(
            "elevation_required: Dependency directory '{}' is not writable: {}",
            parent.display(),
            e
        )),
    }
}

fn check_dependency_cancelled(cancel_flag: &AtomicBool) -> Result<(), String> {
    if cancel_flag.load(Ordering::Relaxed) {
        Err("cancelled".to_string())
    } else {
        Ok(())
    }
}

async fn download_archive(
    handle: &AppHandle, pack_id: &str, signed_url: &str, output_path: &Path, cancel_flag: &Arc<AtomicBool>,
) -> Result<u64, String> {
    check_dependency_cancelled(cancel_flag)?;
    let client = reqwest::Client::new();
    let response = client
        .get(signed_url)
        .send()
        .await
        .map_err(|e| concise_request_error("download failed", &e))?;

    if !response.status().is_success() {
        return Err(format!("download failed: HTTP {}", response.status().as_u16()));
    }

    let total_size = response
        .headers()
        .get(CONTENT_LENGTH)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.parse::<u64>().ok())
        .unwrap_or(0);
    let supports_ranges = response
        .headers()
        .get(ACCEPT_RANGES)
        .and_then(|value| value.to_str().ok())
        .is_some_and(|value| value.eq_ignore_ascii_case("bytes"));

    if supports_ranges && total_size >= PARALLEL_DOWNLOAD_THRESHOLD {
        drop(response);
        download_archive_parallel(handle, pack_id, signed_url, total_size, output_path, cancel_flag).await
    } else {
        download_archive_single(handle, pack_id, response, total_size, output_path, cancel_flag).await
    }
}

async fn download_archive_single(
    handle: &AppHandle, pack_id: &str, mut response: reqwest::Response, total_size: u64, output_path: &Path, cancel_flag: &Arc<AtomicBool>,
) -> Result<u64, String> {
    let mut file = fs::File::create(output_path).await.map_err(|e| e.to_string())?;
    let mut downloaded = 0_u64;
    let mut last_emit = Instant::now();
    let mut downloaded_at_last_emit = 0_u64;
    let download_start = Instant::now();

    while let Some(chunk) = response.chunk().await.map_err(|_| "download failed".to_string())? {
        check_dependency_cancelled(cancel_flag)?;
        file.write_all(&chunk).await.map_err(|_| "download failed".to_string())?;
        downloaded += chunk.len() as u64;

        if last_emit.elapsed().as_millis() >= 100 || downloaded == total_size {
            let elapsed = last_emit.elapsed().as_secs_f64();
            let speed = if elapsed > 0.0 {
                (downloaded - downloaded_at_last_emit) as f64 / elapsed
            } else {
                0.0
            };
            emit_download_progress(handle, pack_id, downloaded, total_size, speed)?;
            last_emit = Instant::now();
            downloaded_at_last_emit = downloaded;
        }
    }

    if total_size > 0 && downloaded != total_size {
        return Err(format!("Downloaded size mismatch: expected {}, got {}.", total_size, downloaded));
    }

    let elapsed = download_start.elapsed().as_secs_f64();
    let speed = if elapsed > 0.0 { downloaded as f64 / elapsed } else { 0.0 };
    emit_download_progress(handle, pack_id, downloaded, total_size, speed)?;
    Ok(downloaded)
}

async fn download_archive_parallel(
    handle: &AppHandle, pack_id: &str, signed_url: &str, total_size: u64, output_path: &Path, cancel_flag: &Arc<AtomicBool>,
) -> Result<u64, String> {
    let unit_count = ((total_size / (1024 * 1024)) as usize).clamp(1, 24);
    let worker_count = unit_count.min(6);
    let unit_size = total_size / unit_count as u64;
    let max_failures = unit_count + 10;
    let units = (0..unit_count)
        .map(|index| {
            let start = index as u64 * unit_size;
            let end = if index < unit_count - 1 {
                (index as u64 + 1) * unit_size - 1
            } else {
                total_size - 1
            };
            (index, start, end)
        })
        .collect::<Vec<_>>();

    {
        let file = fs::File::create(output_path).await.map_err(|e| e.to_string())?;
        file.set_len(total_size).await.map_err(|e| e.to_string())?;
    }

    let queue = Arc::new(Mutex::new(std::collections::VecDeque::from(units)));
    let total_downloaded = Arc::new(AtomicU64::new(0));
    let completed_units = Arc::new(AtomicUsize::new(0));
    let total_failures = Arc::new(AtomicUsize::new(0));
    let last_emit = Arc::new(Mutex::new(Instant::now()));
    let download_start = Instant::now();
    let client = reqwest::Client::new();

    let mut handles = Vec::new();
    for _ in 0..worker_count {
        let handle = handle.clone();
        let pack_id = pack_id.to_string();
        let signed_url = signed_url.to_string();
        let output_path = output_path.to_path_buf();
        let queue = Arc::clone(&queue);
        let total_downloaded = Arc::clone(&total_downloaded);
        let completed_units = Arc::clone(&completed_units);
        let total_failures = Arc::clone(&total_failures);
        let client = client.clone();
        let cancel_flag = Arc::clone(cancel_flag);
        let last_emit = Arc::clone(&last_emit);

        handles.push(tokio::spawn(async move {
            loop {
                if cancel_flag.load(Ordering::Relaxed) {
                    break;
                }

                let Some((unit_index, start, end)) = queue.lock().ok().and_then(|mut queue| queue.pop_front()) else {
                    break;
                };

                let result = download_range_to_file(&client, &signed_url, &output_path, start, end, &cancel_flag).await;

                match result {
                    Ok(downloaded) => {
                        let current_total = total_downloaded.fetch_add(downloaded, Ordering::Relaxed) + downloaded;
                        completed_units.fetch_add(1, Ordering::Relaxed);
                        let elapsed = download_start.elapsed().as_secs_f64();
                        let speed = if elapsed > 0.0 { current_total as f64 / elapsed } else { 0.0 };
                        let should_emit = last_emit
                            .lock()
                            .map(|mut last| {
                                let due = last.elapsed().as_millis() >= 100 || current_total == total_size;
                                if due {
                                    *last = Instant::now();
                                }
                                due
                            })
                            .unwrap_or(false);
                        if should_emit {
                            let _ = emit_download_progress(&handle, &pack_id, current_total, total_size, speed);
                        }
                    }
                    Err(()) => {
                        if cancel_flag.load(Ordering::Relaxed) {
                            break;
                        }
                        let failures = total_failures.fetch_add(1, Ordering::Relaxed) + 1;
                        if failures >= max_failures {
                            break;
                        }
                        if let Ok(mut queue) = queue.lock() {
                            queue.push_back((unit_index, start, end));
                        }
                    }
                }
            }
        }));
    }

    for handle in handles {
        handle.await.map_err(|e| e.to_string())?;
    }

    if cancel_flag.load(Ordering::Relaxed) {
        let _ = fs::remove_file(output_path).await;
        return Err("cancelled".to_string());
    }

    if completed_units.load(Ordering::Relaxed) < unit_count {
        let _ = fs::remove_file(output_path).await;
        return Err(format!(
            "Download failed after {} range failures.",
            total_failures.load(Ordering::Relaxed)
        ));
    }

    let downloaded = total_downloaded.load(Ordering::Relaxed);
    let elapsed = download_start.elapsed().as_secs_f64();
    let speed = if elapsed > 0.0 { downloaded as f64 / elapsed } else { 0.0 };
    emit_download_progress(handle, pack_id, downloaded, total_size, speed)?;
    Ok(downloaded)
}

#[allow(clippy::too_many_arguments)]
async fn download_range_to_file(
    client: &reqwest::Client, signed_url: &str, output_path: &Path, start: u64, end: u64, cancel_flag: &Arc<AtomicBool>,
) -> Result<u64, ()> {
    if cancel_flag.load(Ordering::Relaxed) {
        return Err(());
    }

    let mut response = client
        .get(signed_url)
        .header(RANGE, format!("bytes={}-{}", start, end))
        .send()
        .await
        .map_err(|_| ())?;

    if !response.status().is_success() {
        return Err(());
    }

    let mut file = fs::OpenOptions::new().write(true).open(output_path).await.map_err(|_| ())?;
    file.seek(std::io::SeekFrom::Start(start)).await.map_err(|_| ())?;

    let mut downloaded = 0_u64;
    while let Some(chunk) = response.chunk().await.map_err(|_| ())? {
        if cancel_flag.load(Ordering::Relaxed) {
            return Err(());
        }

        file.write_all(&chunk).await.map_err(|_| ())?;
        downloaded += chunk.len() as u64;
    }

    let expected = end - start + 1;
    if downloaded != expected {
        return Err(());
    }

    Ok(downloaded)
}

fn emit_download_progress(handle: &AppHandle, pack_id: &str, downloaded: u64, total: u64, speed: f64) -> Result<(), String> {
    let progress = if total > 0 { downloaded as f32 / total as f32 } else { 0.0 };
    emit_dependency_progress(handle, pack_id, "downloading", progress, downloaded, total, speed)
}

fn emit_dependency_progress(
    handle: &AppHandle, pack_id: &str, state: &str, progress: f32, downloaded_bytes: u64, total_bytes: u64, speed_bytes_per_sec: f64,
) -> Result<(), String> {
    handle
        .emit(
            DEPENDENCY_PROGRESS_EVENT,
            DependencyProgressPayload {
                pack_id: pack_id.to_string(),
                state: state.to_string(),
                progress,
                downloaded_bytes,
                total_bytes,
                speed_bytes_per_sec,
            },
        )
        .map_err(|e| e.to_string())
}

async fn extract_archive(handle: &AppHandle, archive_path: &Path, stage_root: &Path, cancel_flag: &Arc<AtomicBool>) -> Result<(), String> {
    fs::create_dir_all(stage_root).await.map_err(|e| e.to_string())?;
    let seven_zip = seven_zip_path(handle)?;
    let output_arg = format!("-o{}", stage_root.display());
    let mut child = Command::new(seven_zip)
        .arg("x")
        .arg(archive_path)
        .arg(output_arg)
        .arg("-y")
        .spawn()
        .map_err(|e| format!("Failed to run 7-Zip: {}", e))?;

    let status = loop {
        if cancel_flag.load(Ordering::Relaxed) {
            let _ = child.kill().await;
            let _ = child.wait().await;
            return Err("cancelled".to_string());
        }

        if let Some(status) = child.try_wait().map_err(|e| e.to_string())? {
            break status;
        }

        tokio::time::sleep(Duration::from_millis(100)).await;
    };

    if status.success() {
        Ok(())
    } else {
        Err(format!("7-Zip extraction failed with status: {}", status))
    }
}

fn validate_extracted_pack(extracted_root: &Path, pack: &DependencyPack) -> Result<(), String> {
    let missing = pack
        .required_files
        .iter()
        .filter_map(|required_file| {
            let relative = required_file_relative_to_root(required_file, &pack.root_dir);
            (!extracted_root.join(&relative).exists()).then(|| relative.display().to_string())
        })
        .collect::<Vec<_>>();

    if missing.is_empty() {
        Ok(())
    } else {
        Err(format!("Extracted package is missing required files: {}", missing.join(", ")))
    }
}

fn find_extracted_pack_root(stage_root: &Path, pack_id: &str, pack: &DependencyPack) -> Result<PathBuf, String> {
    let mut candidates = Vec::new();
    candidates.push(stage_root.join(&pack.root_dir));
    if let Some(root_name) = Path::new(&pack.root_dir).file_name() {
        candidates.push(stage_root.join(root_name));
    }
    candidates.push(stage_root.join(pack_id));
    candidates.push(stage_root.to_path_buf());

    candidates
        .into_iter()
        .find(|candidate| validate_extracted_pack(candidate, pack).is_ok())
        .ok_or_else(|| format!("Extracted package does not contain the required files for {}.", pack.name))
}

fn required_file_relative_to_root(required_file: &str, root_dir: &str) -> PathBuf {
    let required_path = Path::new(required_file);
    let root_path = Path::new(root_dir);
    required_path
        .strip_prefix(root_path)
        .map(Path::to_path_buf)
        .unwrap_or_else(|_| required_path.to_path_buf())
}

async fn replace_pack_root(extracted_root: &Path, target_root: &Path) -> Result<(), String> {
    let backup_root = target_root.with_extension(format!("backup-{}", Uuid::new_v4()));

    if target_root.exists() {
        fs::rename(target_root, &backup_root).await.map_err(|e| e.to_string())?;
    }

    if let Some(parent) = target_root.parent() {
        fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }

    let move_result = fs::rename(extracted_root, target_root).await;
    if let Err(error) = move_result {
        let copy_result = copy_dir_all_cross_volume(extracted_root, target_root).await;
        if let Err(copy_error) = copy_result {
            let _ = fs::remove_dir_all(target_root).await;
            if backup_root.exists() {
                let _ = fs::rename(&backup_root, target_root).await;
            }
            return Err(format!("{}; fallback copy also failed: {}", error, copy_error));
        }
        let _ = fs::remove_dir_all(extracted_root).await;
    }

    if backup_root.exists() {
        let _ = fs::remove_dir_all(backup_root).await;
    }

    Ok(())
}

async fn copy_dir_all_cross_volume(source: &Path, target: &Path) -> Result<(), String> {
    let source = source.to_path_buf();
    let target = target.to_path_buf();
    tokio::task::spawn_blocking(move || copy_dir_all_sync(&source, &target))
        .await
        .map_err(|e| e.to_string())?
}

fn copy_dir_all_sync(source: &Path, target: &Path) -> Result<(), String> {
    std::fs::create_dir_all(target).map_err(|e| e.to_string())?;

    for entry in std::fs::read_dir(source).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let source_path = entry.path();
        let target_path = target.join(entry.file_name());

        if source_path.is_dir() {
            copy_dir_all_sync(&source_path, &target_path)?;
        } else {
            if let Some(parent) = target_path.parent() {
                std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            std::fs::copy(&source_path, &target_path).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

impl RouteRule {
    fn matches(&self, input_group: &str, input_ext: &str, output_group: &str, output_ext: &str) -> bool {
        matches_any(&self.input_group, input_group)
            && matches_optional(&self.input_ext, input_ext)
            && matches_any(&self.output_group, output_group)
            && matches_optional(&self.output_ext, output_ext)
    }
}

fn matches_any(values: &[String], actual: &str) -> bool {
    values.iter().any(|value| value == actual)
}

fn matches_optional(values: &[String], actual: &str) -> bool {
    values.is_empty() || values.iter().any(|value| value == actual)
}
