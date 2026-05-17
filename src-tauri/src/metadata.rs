use std::process::Stdio;

use serde::Serialize;
use serde_json::{Map, Value};
use tauri::AppHandle;
use tokio::io::AsyncWriteExt;
use tokio::process::Command;

use crate::routing;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataResponse {
    file_path: String,
    tags: Vec<MetadataTag>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataTag {
    group: String,
    name: String,
    value: String,
}

pub async fn read_file_metadata(handle: AppHandle, file_path: String) -> Result<MetadataResponse, String> {
    let exiftool = routing::exiftool_path(&handle)?;
    if !exiftool.exists() {
        return Err("ExifTool is not available.".to_string());
    }

    let arg_content = ["-charset", "filename=UTF8", "-j", "-G1", "-a", "-u", "-sort", &file_path].join("\n") + "\n";

    let mut child = Command::new(exiftool)
        .arg("-@")
        .arg("-")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to run ExifTool: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(arg_content.as_bytes()).await.map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(if stderr.is_empty() {
            format!("ExifTool failed with status: {}", output.status)
        } else {
            stderr
        });
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let records: Vec<Map<String, Value>> = serde_json::from_str(&stdout).map_err(|_| "Could not parse ExifTool output.".to_string())?;
    let tags = records.first().map(metadata_tags_from_record).unwrap_or_default();

    Ok(MetadataResponse { file_path, tags })
}

fn metadata_tags_from_record(record: &Map<String, Value>) -> Vec<MetadataTag> {
    record
        .iter()
        .filter(|(key, _)| key.as_str() != "ExifTool:ExifToolVersion")
        .map(|(key, value)| {
            let (group, name) = split_tag_key(key);
            MetadataTag {
                group,
                name,
                value: metadata_value_to_string(value),
            }
        })
        .collect()
}

fn split_tag_key(key: &str) -> (String, String) {
    key.split_once(':')
        .map(|(group, name)| (group.to_string(), name.to_string()))
        .unwrap_or_else(|| ("Source".to_string(), key.to_string()))
}

fn metadata_value_to_string(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::Bool(value) => value.to_string(),
        Value::Number(value) => value.to_string(),
        Value::String(value) => value.clone(),
        Value::Array(_) | Value::Object(_) => serde_json::to_string(value).unwrap_or_default(),
    }
}
