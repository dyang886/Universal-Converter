// src/ncm.rs

use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, KeyInit};
use aes::Aes128;
use base64::{engine::general_purpose, Engine as _};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};

use crate::{ConversionLogPayload, LocalizedText};

// Define the AES ECB decrypter type for convenience
type Aes128EcbDec = ecb::Decryptor<Aes128>;

// Hardcoded keys used for NCM decryption
const CORE_KEY: &[u8] = b"\x68\x7a\x48\x52\x41\x6d\x73\x6f\x35\x6b\x49\x6e\x62\x61\x78\x57";
const META_KEY: &[u8] = b"\x23\x31\x34\x6c\x6a\x6b\x5f\x21\x5c\x5d\x26\x30\x55\x3c\x27\x28";
const MAGIC_HEADER: &[u8] = b"\x43\x54\x45\x4e\x46\x44\x41\x4d";

// Structs for deserializing metadata JSON
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct NcmMusicMeta {
    music_name: Option<String>,
    artist: Option<Vec<Vec<String>>>,
    album: Option<String>,
    format: Option<String>,
}

/// Helper closure to create variables for localized text
fn create_vars(file_path: String) -> HashMap<String, String> {
    let mut vars = HashMap::new();
    vars.insert("file".to_string(), file_path);
    vars
}

/// Main function to handle the conversion process for NCM files.
pub async fn run_conversion(
    handle: AppHandle,
    input_paths: Vec<String>,
    _output_ext: String,
    _options: HashMap<String, String>,
) -> Result<bool, String> {
    let mut all_files_converted_successfully = true;

    for path_str in input_paths {
        let input_path = PathBuf::from(&path_str);
        
        // Perform the decryption and handle the result
        let conversion_result = decrypt_single_file(&handle, &input_path, &path_str).await;

        if conversion_result.is_err() {
            all_files_converted_successfully = false;
        }

        let (success, terminal_output) = match conversion_result {
            Ok(output) => (true, output),
            Err(e) => (false, e),
        };

        // Emit final status (success or failure)
        handle.emit(
                "conversion-log",
                &ConversionLogPayload {
                    file_path: path_str.clone(),
                    status_message: LocalizedText {
                        key: if success {
                            "terminal.success".to_string()
                        } else {
                            "terminal.failure".to_string()
                        },
                        vars: create_vars(input_path.display().to_string()),
                    },
                    terminal_output: Some(terminal_output),
                    success: Some(success),
                },
            )
            .unwrap();
    }

    Ok(all_files_converted_successfully)
}

/// Decrypts a single NCM file, emitting logs in real-time.
async fn decrypt_single_file(handle: &AppHandle, input_path: &PathBuf, original_path_str: &str) -> Result<String, String> {
    let mut terminal_output = String::new();
    let display_path = input_path.display().to_string();

    // Function to emit intermediate logs
    let emit_log = |h: &AppHandle, log: &str| {
        h.emit(
            "conversion-log",
            &ConversionLogPayload {
                file_path: original_path_str.to_string(),
                status_message: LocalizedText {
                    key: "terminal.converting".to_string(),
                    vars: create_vars(display_path.clone()),
                },
                terminal_output: Some(log.to_string()),
                success: None,
            },
        ).unwrap();
    };
    
    emit_log(handle, "Starting NCM decryption...");

    let mut file = File::open(input_path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // 1. Check Magic Header
    if buffer.len() < 10 || &buffer[0..8] != MAGIC_HEADER {
        return Err("Invalid NCM file format: Magic header mismatch.".to_string());
    }
    let mut offset = 10;
    terminal_output.push_str("✓ NCM header validated.\n");
    emit_log(handle, &terminal_output);


    // 2. Decrypt Core Key
    let key_data = decrypt_key_data(&buffer, &mut offset)?;
    let key_box = build_key_box(&key_data);
    terminal_output.push_str("✓ Audio key decrypted.\n");
    emit_log(handle, &terminal_output);


    // 3. Decrypt Metadata
    let metadata = decrypt_metadata(&buffer, &mut offset)?;
    let format = metadata.format.as_deref().unwrap_or("mp3").to_string();
    terminal_output.push_str(&format!("✓ Metadata decrypted. Format is '{}'.\n", format));
    emit_log(handle, &terminal_output);


    // 4. Decrypt Audio Data
    offset += 9; // Skip CRC32 (4 bytes) and a gap (5 bytes)
    let image_len = u32::from_le_bytes(
        buffer.get(offset..offset + 4).ok_or("Failed to read image length")?.try_into().unwrap()
    ) as usize;
    offset += 4 + image_len;

    let mut audio_data = buffer.get(offset..).ok_or("Failed to get audio data slice")?.to_vec();
    for (i, byte) in audio_data.iter_mut().enumerate() {
        *byte ^= key_box[i & 0xff];
    }
    terminal_output.push_str("✓ Audio data decrypted.\n");
    emit_log(handle, &terminal_output);


    // 5. Write to new file
    let file_stem = input_path.file_stem().unwrap_or_default().to_string_lossy();
    let new_file_name = format!("{}_UCT.{}", file_stem, format);
    let output_path = input_path.with_file_name(new_file_name);

    let mut output_file = File::create(&output_path)
        .map_err(|e| format!("Failed to create output file: {}", e))?;
    output_file
        .write_all(&audio_data)
        .map_err(|e| format!("Failed to write decrypted data: {}", e))?;

    terminal_output.push_str(&format!(
        "✓ Successfully saved to {}\n",
        output_path.display()
    ));
    emit_log(handle, &terminal_output);


    // Add metadata info to the final log
    if let Some(name) = metadata.music_name {
        terminal_output.push_str(&format!("   - Title: {}\n", name));
    }
    if let Some(artists) = metadata.artist {
        let artist_names: Vec<String> = artists.iter().filter_map(|a| a.get(0)).cloned().collect();
        terminal_output.push_str(&format!("   - Artists: {}\n", artist_names.join(", ")));
    }
    if let Some(album) = metadata.album {
        terminal_output.push_str(&format!("   - Album: {}\n", album));
    }

    Ok(terminal_output)
}

fn decrypt_key_data(buffer: &[u8], offset: &mut usize) -> Result<Vec<u8>, String> {
    let key_len = u32::from_le_bytes(
        buffer.get(*offset..*offset + 4).ok_or("Invalid key length bytes")?.try_into().unwrap()
    ) as usize;
    *offset += 4;

    let mut encrypted_key = buffer.get(*offset..*offset + key_len).ok_or("Invalid key data slice")?.to_vec();
    *offset += key_len;

    for byte in &mut encrypted_key {
        *byte ^= 0x64;
    }

    let decrypter = Aes128EcbDec::new(CORE_KEY.into());
    let decrypted_key_slice = decrypter
        .decrypt_padded_mut::<Pkcs7>(&mut encrypted_key)
        .map_err(|e| format!("Core key AES decryption failed: {}", e))?;

    Ok(decrypted_key_slice[17..].to_vec())
}

fn build_key_box(key_data: &[u8]) -> Vec<u8> {
    let key_len = key_data.len();
    let mut box_val: Vec<u8> = (0..=255).collect();
    let mut j: u8 = 0;

    for i in 0..256 {
        let k = box_val[i];
        j = j.wrapping_add(k).wrapping_add(key_data[i % key_len]);
        box_val.swap(i, j as usize);
    }
    box_val
}

fn decrypt_metadata(buffer: &[u8], offset: &mut usize) -> Result<NcmMusicMeta, String> {
    let meta_len = u32::from_le_bytes(
        buffer.get(*offset..*offset + 4).ok_or("Invalid metadata length bytes")?.try_into().unwrap()
    ) as usize;
    *offset += 4;

    if meta_len == 0 {
        return Ok(NcmMusicMeta { music_name: None, artist: None, album: None, format: None });
    }

    let mut encrypted_meta = buffer.get(*offset..*offset + meta_len).ok_or("Invalid metadata slice")?.to_vec();
    *offset += meta_len;

    for byte in &mut encrypted_meta {
        *byte ^= 0x63;
    }

    let b64_encoded = encrypted_meta.get(22..).ok_or("Invalid metadata format (missing prefix)")?;
    let decoded_b64 = general_purpose::STANDARD
        .decode(b64_encoded)
        .map_err(|e| format!("Base64 decoding of metadata failed: {}", e))?;

    let decrypter = Aes128EcbDec::new(META_KEY.into());
    let mut mutable_decoded_b64 = decoded_b64;
    let decrypted_meta_padded_slice = decrypter
        .decrypt_padded_mut::<Pkcs7>(&mut mutable_decoded_b64)
        .map_err(|e| format!("Metadata AES decryption failed: {}", e))?;

    let json_slice = decrypted_meta_padded_slice.get(6..).ok_or("Invalid metadata format (missing 'music:' prefix)")?;
    let json_str = String::from_utf8(json_slice.to_vec())
        .map_err(|e| format!("Metadata is not valid UTF-8: {}", e))?;

    serde_json::from_str(&json_str).map_err(|e| format!("Metadata JSON parsing failed: {}", e))
}
