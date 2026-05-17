use indexmap::IndexMap;
use std::collections::HashSet;
use std::env;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

use tauri::AppHandle;
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use tokio::fs;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use uuid::Uuid;

use crate::routing;
use crate::{emit_cancelled, emit_delta, emit_error, emit_success, find_first_file_in_dir, run_cli_command};

const COVER_ART_AUDIO_OUTPUTS: &[&str] = &["mp3", "flac", "m4a", "m4b"];

fn has_any_option(options: &IndexMap<String, String>, keys: &[&str]) -> bool {
    keys.iter().any(|key| options.contains_key(*key))
}

fn push_flag_if_missing(args: &mut Vec<String>, options: &IndexMap<String, String>, key: &str) {
    if !options.contains_key(key) {
        args.push(key.to_string());
    }
}

fn push_value_if_missing(args: &mut Vec<String>, options: &IndexMap<String, String>, key: &str, value: &str) {
    if !options.contains_key(key) {
        args.extend(vec![key.to_string(), value.to_string()]);
    }
}

fn push_video_size_if_missing(args: &mut Vec<String>, options: &IndexMap<String, String>, value: &str) {
    if !has_any_option(options, &["-s", "-s:v", "-vf"]) {
        args.extend(vec!["-s".to_string(), value.to_string()]);
    }
}

async fn input_has_audio_stream(handle: &AppHandle, path: &PathBuf, cancel_flag: &Arc<AtomicBool>) -> bool {
    let path_str = path.to_string_lossy().to_string();
    let args = vec!["-hide_banner", "-i", path_str.as_str()];
    let command_packs = routing::command_packs("ffmpeg");
    let Ok(command_env) = routing::dependency_env(handle, &command_packs) else {
        return false;
    };
    let Ok((mut rx, child)) = handle.shell().command("ffmpeg").args(args).envs(command_env).spawn() else {
        return false;
    };

    loop {
        if cancel_flag.load(Ordering::Relaxed) {
            let _ = child.kill();
            return false;
        }

        match tokio::time::timeout(Duration::from_millis(50), rx.recv()).await {
            Ok(Some(CommandEvent::Stderr(line) | CommandEvent::Stdout(line))) => {
                if String::from_utf8_lossy(&line).contains("Audio:") {
                    let _ = child.kill();
                    return true;
                }
            }
            Ok(Some(CommandEvent::Terminated(_)) | None) => break,
            Ok(Some(_)) | Err(_) => {}
        }
    }

    false
}

async fn remove_temp_dir(path: &PathBuf) {
    if let Err(e) = fs::remove_dir_all(path).await {
        eprintln!("Failed to clean up temp directory '{}': {}", path.display(), e);
    }
}

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, options: IndexMap<String, String>, um_input_paths: Vec<String>,
    audio_input_paths: Vec<String>, output_group: String, cancel_flag: Arc<AtomicBool>, max_threads: usize,
) -> Result<bool, String> {
    let semaphore = Arc::new(Semaphore::new(max_threads));
    let all_ok = Arc::new(AtomicBool::new(true));
    let mut join_set = JoinSet::new();
    let um_input_paths: Arc<HashSet<String>> = Arc::new(um_input_paths.into_iter().collect());
    let audio_input_paths: Arc<HashSet<String>> = Arc::new(audio_input_paths.into_iter().collect());
    let is_audio_output = output_group == "audio";
    let is_video_output = output_group == "video";

    for path_str in input_paths {
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let permit = Arc::clone(&semaphore).acquire_owned().await.unwrap();
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let handle = handle.clone();
        let output_ext = output_ext.clone();
        let options = options.clone();
        let um_input_paths = Arc::clone(&um_input_paths);
        let audio_input_paths = Arc::clone(&audio_input_paths);
        let cancel = Arc::clone(&cancel_flag);
        let all_ok = Arc::clone(&all_ok);

        join_set.spawn(async move {
            let _permit = permit;
            let use_um = um_input_paths.contains(&path_str);
            let is_audio_input = audio_input_paths.contains(&path_str);
            if !convert_single_file(
                &handle,
                path_str,
                &output_ext,
                options,
                use_um,
                is_audio_input,
                is_audio_output,
                is_video_output,
                &cancel,
            )
            .await
            {
                all_ok.store(false, Ordering::Relaxed);
            }
        });
    }

    while join_set.join_next().await.is_some() {}

    Ok(all_ok.load(Ordering::Relaxed))
}

async fn convert_single_file(
    handle: &AppHandle, path_str: String, output_ext: &str, mut options: IndexMap<String, String>, use_um: bool, is_audio_input: bool,
    is_audio_output: bool, is_video_output: bool, cancel_flag: &Arc<AtomicBool>,
) -> bool {
    let original_input_path = PathBuf::from(&path_str);
    emit_delta(handle, &path_str, &original_input_path, String::new());
    let mut temp_dir_to_clean: Option<PathBuf> = None;

    let um_specific_args = ["--qmc-mmkv", "--qmc-mmkv-key", "--kgg-db", "--update-metadata"];

    let input_path_for_ffmpeg = if use_um {
        let temp_dir = env::temp_dir().join(Uuid::new_v4().to_string());
        if let Err(e) = fs::create_dir_all(&temp_dir).await {
            emit_delta(handle, &path_str, &original_input_path, e.to_string());
            emit_error(handle, &path_str, &original_input_path);
            return false;
        }
        temp_dir_to_clean = Some(temp_dir.clone());

        let mut um_cli_args = vec![
            "-V".to_string(),
            "--overwrite".to_string(),
            "-i".to_string(),
            original_input_path.to_string_lossy().to_string(),
            "-o".to_string(),
            temp_dir.to_string_lossy().to_string(),
        ];

        for arg_name in um_specific_args {
            if let Some(value) = options.get(arg_name) {
                um_cli_args.push(arg_name.to_string());
                if !value.is_empty() {
                    um_cli_args.push(value.clone());
                }
            }
        }

        println!("Full um command: um {}", um_cli_args.join(" "));

        let um_pack_ids = routing::command_packs("um");
        match run_cli_command(handle, &path_str, "um", &um_cli_args, cancel_flag, &um_pack_ids).await {
            Ok(()) => match find_first_file_in_dir(&temp_dir).await {
                Ok(Some(decrypted_file_path)) => decrypted_file_path,
                Ok(None) => {
                    emit_delta(
                        handle,
                        &path_str,
                        &original_input_path,
                        "Decryption succeeded, but no output file was found in the temporary directory.".to_string(),
                    );
                    emit_error(handle, &path_str, &original_input_path);
                    remove_temp_dir(&temp_dir).await;
                    return false;
                }
                Err(e) => {
                    emit_delta(handle, &path_str, &original_input_path, e);
                    emit_error(handle, &path_str, &original_input_path);
                    remove_temp_dir(&temp_dir).await;
                    return false;
                }
            },
            Err(e) if e == "cancelled" => {
                emit_cancelled(handle, &path_str, &original_input_path);
                remove_temp_dir(&temp_dir).await;
                return false;
            }
            Err(_) => {
                emit_error(handle, &path_str, &original_input_path);
                remove_temp_dir(&temp_dir).await;
                return false;
            }
        }
    } else {
        original_input_path.clone()
    };

    for arg in um_specific_args {
        options.shift_remove(arg);
    }

    let original_file_stem = original_input_path.file_stem().unwrap_or_default().to_string_lossy();
    let new_file_name = format!("{}_UCT.{}", original_file_stem, output_ext);
    let output_path = original_input_path.with_file_name(new_file_name);

    let mut ffmpeg_args: Vec<String> = vec!["-i".to_string(), input_path_for_ffmpeg.to_string_lossy().to_string()];
    let amv_needs_silent_audio = is_video_output
        && output_ext == "amv"
        && !options.contains_key("-an")
        && !input_has_audio_stream(handle, &input_path_for_ffmpeg, cancel_flag).await;

    // ====== Special cases begin ======
    if is_audio_output {
        ffmpeg_args.extend(vec!["-map".to_string(), "0:a".to_string()]);
        if is_audio_input && COVER_ART_AUDIO_OUTPUTS.contains(&output_ext) {
            ffmpeg_args.extend(vec![
                "-map".to_string(),
                "0:v?".to_string(),
                "-c:v".to_string(),
                "copy".to_string(),
                "-disposition:v".to_string(),
                "attached_pic".to_string(),
            ]);
        }
    }

    if is_video_output {
        match output_ext {
            "qt" => ffmpeg_args.extend(vec!["-f".to_string(), "mov".to_string()]),
            "divx" => ffmpeg_args.extend(vec!["-f".to_string(), "avi".to_string()]),
            "rmvb" => {
                ffmpeg_args.extend(vec!["-f".to_string(), "rm".to_string()]);
                push_video_size_if_missing(&mut ffmpeg_args, &options, "160x112");
                push_value_if_missing(&mut ffmpeg_args, &options, "-r", "15");
            }
            "ogx" => ffmpeg_args.extend(vec!["-f".to_string(), "ogg".to_string()]),
            "m2p" => ffmpeg_args.extend(vec!["-f".to_string(), "mpeg".to_string()]),
            "dat" => push_value_if_missing(&mut ffmpeg_args, &options, "-target", "ntsc-vcd"),
            "3gp" | "3g2" => {
                push_video_size_if_missing(&mut ffmpeg_args, &options, "176x144");
                push_value_if_missing(&mut ffmpeg_args, &options, "-r", "15");
                push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "8000");
                push_value_if_missing(&mut ffmpeg_args, &options, "-ac", "1");
            }
            "mxf" => push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "48000"),
            "rm" => {
                push_video_size_if_missing(&mut ffmpeg_args, &options, "160x112");
                push_value_if_missing(&mut ffmpeg_args, &options, "-r", "15");
            }
            "amv" => {
                if amv_needs_silent_audio {
                    ffmpeg_args.extend(vec![
                        "-f".to_string(),
                        "lavfi".to_string(),
                        "-i".to_string(),
                        "anullsrc=channel_layout=mono:sample_rate=22050".to_string(),
                    ]);
                }
                push_video_size_if_missing(&mut ffmpeg_args, &options, "160x120");
                push_value_if_missing(&mut ffmpeg_args, &options, "-r", "25");
                push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "22050");
                push_value_if_missing(&mut ffmpeg_args, &options, "-ac", "1");
                push_value_if_missing(&mut ffmpeg_args, &options, "-block_size", "882");
                push_value_if_missing(&mut ffmpeg_args, &options, "-strict", "-1");
                push_flag_if_missing(&mut ffmpeg_args, &options, "-shortest");
            }
            "dv" => push_value_if_missing(&mut ffmpeg_args, &options, "-target", "ntsc-dv"),
            "gxf" => {
                push_video_size_if_missing(&mut ffmpeg_args, &options, "720x480");
                push_value_if_missing(&mut ffmpeg_args, &options, "-r", "30000/1001");
                push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "48000");
            }
            _ => {}
        }
    }

    let audio_codec = options.get("-c:a").map(String::as_str);
    if matches!(audio_codec, Some("libopencore_amrnb") | Some("g726") | Some("real_144")) || (output_ext == "amr" && audio_codec.is_none()) {
        push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "8000");
        push_value_if_missing(&mut ffmpeg_args, &options, "-ac", "1");
    }
    if matches!(audio_codec, Some("libvo_amrwbenc")) {
        push_value_if_missing(&mut ffmpeg_args, &options, "-ar", "16000");
        push_value_if_missing(&mut ffmpeg_args, &options, "-ac", "1");
    }
    if matches!(audio_codec, Some("dca" | "truehd" | "mlp")) || matches!(output_ext, "dts" | "truehd" | "thd" | "mlp") {
        push_value_if_missing(&mut ffmpeg_args, &options, "-strict", "-2");
    }
    if output_ext == "weba" {
        ffmpeg_args.extend(vec!["-f".to_string(), "webm".to_string()]);
    }
    if output_ext == "truehd" {
        ffmpeg_args.extend(vec!["-f".to_string(), "truehd".to_string()]);
    }
    // ====== Special cases end ======

    let mut push_split = |s: &str| {
        for part in s.split_whitespace() {
            ffmpeg_args.push(part.trim_matches('"').trim_matches('\'').to_string());
        }
    };

    for (key, value) in &options {
        push_split(key);
        if !value.is_empty() {
            push_split(value);
        }
    }
    ffmpeg_args.extend(vec![
        "-y".to_string(),
        "-hide_banner".to_string(),
        output_path.to_string_lossy().to_string(),
    ]);

    println!("Full FFmpeg command: ffmpeg {}", ffmpeg_args.join(" "));

    if use_um {
        emit_delta(
            handle,
            &path_str,
            &original_input_path,
            "\n--- Starting FFmpeg conversion ---\n".to_string(),
        );
    }

    let ffmpeg_pack_ids = routing::command_packs("ffmpeg");
    let result = match run_cli_command(handle, &path_str, "ffmpeg", &ffmpeg_args, cancel_flag, &ffmpeg_pack_ids).await {
        Ok(()) => {
            emit_success(handle, &path_str, &original_input_path);
            true
        }
        Err(e) if e == "cancelled" => {
            emit_cancelled(handle, &path_str, &original_input_path);
            false
        }
        Err(_) => {
            emit_error(handle, &path_str, &original_input_path);
            false
        }
    };

    if let Some(path) = temp_dir_to_clean {
        remove_temp_dir(&path).await;
    }

    result
}
