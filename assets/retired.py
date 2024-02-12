# ffmpeg.py
import stat
import platform
import os
import shutil
import requests
import zipfile
from tqdm import tqdm


# =============================================================
# Update module
# =============================================================

def update():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'}

    # windows
    search_url = requests.get(
        "https://www.gyan.dev/ffmpeg/builds/", headers=headers)
    soup = BeautifulSoup(search_url.text, 'html.parser')
    links = soup.find_all("a")
    for link in links:
        if "ffmpeg-release-essentials.zip" in link.text:
            win = link.get("href")
            break

    # download from url
    response = requests.get(win, headers=headers, stream=True)

    if response.status_code == 200:
        filename = os.path.basename(response.url)
        # file_size = int(response.headers.get("Content-Length", 0))

        if filename:
            with open(filename, "wb") as m:
                # progress_bar = tqdm(total=file_size, unit="B",
                # unit_scale=True)
                # progress_bar.set_description(f"Downloading {filename}")

                for chunk in response.iter_content(chunk_size=1024):
                    # progress_bar.update(len(chunk))
                    m.write(chunk)
                # progress_bar.close()
        else:
            # print("ffmpeg update failed...\n")
            return 1
    else:
        # print(f"\033[31mffmpeg update request failed with status code: \033[33m{response.status_code}\033[0m\n")
        return 2, response.status_code

    # version comparison
    new_file_name = f"ffmpeg-{filename.split('-')[1]}"
    new_version = int(new_file_name.split('-')[1].replace('.', ''))
    old_file_name = "ffmpeg-0"
    old_version = 0
    for item in os.listdir('.'):
        if os.path.isdir(item) and "ffmpeg".lower() in item.lower():
            old_file_name = item
            old_version = int(old_file_name.replace('.', '').split('-')[1])

    new_str = str(new_version)
    old_str = str(old_version)
    if len(new_str) > len(old_str):
        old_str += '0' * (len(new_str) - len(old_str))
        old_version = int(old_str)
    elif len(old_str) > len(new_str):
        new_str += '0' * (len(old_str) - len(new_str))
        new_version = int(new_str)

    if new_version > old_version:
        if old_file_name != "ffmpeg-0":
            shutil.rmtree(old_file_name)
        with zipfile.ZipFile(filename, 'r') as win_zip:
            win_zip.extractall()
            os.rename(filename.strip(".zip"), new_file_name)
        os.remove(filename)
        # print(f"\033[34mffmpeg updated successfully! \033[31m{old_file_name.split('-')[1]} \033[0m-> \033[32m{new_file_name.split('-')[1]}\033[0m")
        return 3, None, old_file_name.split('-')[1], new_file_name.split('-')[1]
    else:
        os.remove(filename)
        # print(f"\033[34mffmpeg is up to date! \033[31m{old_file_name.split('-')[1]} \033[0m-> \033[32m{new_file_name.split('-')[1]}\033[0m")
        return 4, None, old_file_name.split('-')[1], new_file_name.split('-')[1]


def convert_file(self):
    self.success_frame.grid_forget()
    self.failure_frame.grid_forget()

    # preconditions before converting
    if self.ffmpeg_path == None:
        messagebox.showerror(_("Error"), _(
            "Dependency ffmpeg is missing, click OK to download"))

        self.convert_button.configure(state=tk.DISABLED)
        self.loading_frame.grid(row=0, column=0)
        self.loading_label_text.set(_("Downloading ffmpeg..."))
        self.start_loading_animation()
        error_code, status_code, old_version, new_version = ffmpeg.update()
        self.loading_frame.grid_forget()
        self.stop_loading_animation()
        self.convert_button.configure(state=tk.NORMAL)

        if error_code == 1:
            messagebox.showerror(
                _("Error"), _("Couldn't write file, ffmpeg update failed..."))
            return
        if error_code == 2:
            messagebox.showerror(
                _("Error"), _("ffmpeg update request failed with status code: {status_code}").format(status_code=status_code))
            return
        if error_code == 3:
            messagebox.showinfo(
                _("Success"), _("ffmpeg updated successfully! ({old_version} -> {new_version})").format(old_version=old_version, new_version=new_version))
        if error_code == 4:
            messagebox.showinfo(
                _("Success"), _("ffmpeg is up to date! ({old_version} -> {new_version})").format(old_version=old_version, new_version=new_version))
        for item in os.listdir('.'):
            if "ffmpeg" in item and os.path.isdir(item):
                self.ffmpeg_path = f"{item}/bin/ffmpeg.exe"
    if not self.total_file_paths:
        return
    if not self.check_roomtype_mixinglevel_both_selected():
        return
    if not self.check_required_sample_rate():
        return

    output_format = self.output_format_var.get()

    # load the converting widget
    self.convert_button.configure(state=tk.DISABLED)
    self.loading_frame.grid(row=0, column=0)
    self.loading_label_text.set(_("Converting..."))
    self.start_loading_animation()

    try:
        if self.category == "PDF":
            stderr = other.pdf_convert(self.total_file_paths, output_format, self.combine_pdf_var.get(), self.user_password_var.get(), self.owner_password_var.get(), self.accessibility_var.get(), self.extract_var.get(), self.annotation_var.get(
            ), self.assembly_var.get(), self.form_var.get(), self.other_var.get(), self.p_lower_var.get(), self.p_higher_var.get(), self.metadata_var.get(), self.dpi_var.get(), self.jpeg_quality_value_label_text.get(), self.pdf_optimize_var.get())
            if type(stderr) == list:
                self.insert_to_output_text(stderr)
                for err in stderr:
                    if err:
                        raise RuntimeError(
                            _("Error during converting, please see terminal output for details"))

        else:
            for file_path in self.total_file_paths:
                if self.category == "Video":
                    stderr = ffmpeg.ffmpeg_video(file_path, output_format, self.video_codec_var.get(), self.crf_value_label_text.get(), self.preset_var.get(), self.tune_var.get(), self.faststart_var.get(), self.speed_value_label_text.get(), self.sharpness_value_label_text.get(), self.meq_value_label_text.get(), self.gmc_var.get(), self.lossless_var.get(), self.aqmode_var.get(
                    ), self.motionest_var.get(), self.audio_codec_var.get(), self.audio_bitrate_var.get(), self.aac_coder_var.get(), self.lpc_type_var.get(), self.ch_mode_var.get(), self.vbr_mode_var.get(), self.room_type_var.get(), self.mixing_level_value_label_text.get(), self.dmix_var.get(), self.dsur_var.get(), self.dsurex_var.get(), self.dheadphone_var.get(), self.sample_rate_var.get())
                    self.insert_to_output_text([stderr])
                    if stderr.strip().endswith("Conversion failed!"):
                        raise RuntimeError(
                            _("Error during converting, please see terminal output for details"))

                elif self.category == "Audio":
                    stderr = ffmpeg.ffmpeg_audio(file_path, output_format, self.audio_codec_var.get(), self.audio_bitrate_var.get(
                    ), self.aac_coder_var.get(), self.lpc_type_var.get(), self.ch_mode_var.get(), self.vbr_mode_var.get())
                    self.insert_to_output_text([stderr])
                    if stderr.strip().endswith("Conversion failed!"):
                        raise RuntimeError(
                            _("Error during converting, please see terminal output for details"))

                elif self.category == "Image":
                    stderr = ffmpeg.ffmpeg_image(file_path, output_format, self.image_quality_value_label_text.get(), self.image_scale_w_var.get(), self.image_scale_h_var.get(
                    ), self.image_rotate_var.get(), self.lossless_var.get(), self.image_preset_var.get(), self.webp_quality_value_label_text.get())
                    if stderr != -1:
                        self.insert_to_output_text([stderr])
                        if stderr.strip().endswith("Conversion failed!"):
                            raise RuntimeError(
                                _("Error during converting, please see terminal output for details"))

                elif self.category == "NetEase":
                    other.ncm_convert(file_path)

    # conversion failed
    except Exception as e:
        messagebox.showerror(_("Error"), e)
        self.loading_frame.grid_forget()
        self.stop_loading_animation()
        self.convert_button.configure(state=tk.NORMAL)
        self.failure_frame.grid(row=0, column=0)
        return

    # conversion successful
    self.loading_frame.grid_forget()
    self.stop_loading_animation()
    self.clear_list()
    self.convert_button.configure(state=tk.NORMAL)
    self.success_frame.grid(row=0, column=0)
