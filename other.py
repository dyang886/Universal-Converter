import os
import sys
import json
import gettext
import polib
import subprocess
import pikepdf
import locale

ncm_input = [".ncm"]

ncm_output = [".mp3"]

pdf_output = [".pdf", ".jpeg"]



def pdf_convert(input_paths, out_ext, combine, user_password, owner_password, access, extract, annotation, assembly, form, other, p_lower, p_higher, metadata, dpi, quality, optimize):
    _ = get_translator()

    if out_ext == ".pdf":
        output_pdfs = []
        pdf_tag = ".pdf"

        # if no options were selected, raise exception
        if user_password == "" and owner_password == "" and (access and extract and annotation and assembly and form and other and p_lower and p_higher) == True and (metadata or combine) == False:
            raise RuntimeError(_("No operations performed"))

        permissions = pikepdf.Permissions(
            accessibility=access,
            extract=extract,
            modify_annotation=annotation,
            modify_assembly=assembly,
            modify_form=form,
            modify_other=other,
            print_lowres=p_lower,
            print_highres=p_higher
        )

        if combine:
            output_pdf = pikepdf.Pdf.new()
            for pdf_file in input_paths:
                with pikepdf.open(pdf_file) as file:
                    for page in file.pages:
                        output_pdf.pages.append(page)
            combined_file_path, _ = os.path.splitext(input_paths[0])
            output_pdfs.append([output_pdf, combined_file_path + "_combined"])

        else:
            for pdf_file in input_paths:
                pdf = pikepdf.Pdf.open(pdf_file)
                pdf_path = os.path.splitext(pdf_file)[0]
                output_pdfs.append([pdf, pdf_path])

        if (user_password != "" or owner_password != "") or (access and extract and annotation and assembly and form and other and p_lower and p_higher) == False or metadata == True:
            pdf_tag = "_encrypted" + pdf_tag
            for pdf in output_pdfs:
                pdf[0].save(pdf[1] + pdf_tag, encryption=pikepdf.Encryption(
                    user=user_password, owner=owner_password, allow=permissions, metadata=metadata))

        else:
            for pdf in output_pdfs:
                pdf[0].save(pdf[1] + pdf_tag)

    elif out_ext == ".jpeg":
        result = []
        root_directory = os.path.split(input_paths[0])[0]
        root_directory += "/pdf_to_jpeg_converted/"
        if not os.path.exists(root_directory):
            os.makedirs(root_directory)

        for pdf in input_paths:
            pdf_name = os.path.split(pdf)[1]
            os.makedirs(root_directory +
                        os.path.splitext(pdf_name)[0], exist_ok=True)

            if optimize:
                optimize = "y"
            else:
                optimize = "n"
            if not quality:
                quality = "75"
            command = [resource_path("dependency/poppler/pdftoppm.exe")]
            if dpi:
                command += ["-r", dpi]  # max -r value 3089
            command += ["-jpeg"]
            command += ["-jpegopt", f"quality={quality},optimize={optimize}"]
            command += [pdf,
                        f"{root_directory + os.path.splitext(pdf_name)[0]}/{pdf_name[:-4]}"]

            process = subprocess.Popen(
                command, stderr=subprocess.PIPE, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
            result.append(process.communicate()[1])
        return result


######################## previous content

    def update_file_list(self):
        for file in self.file_paths:
            self.total_file_paths.append(file)
            self.file_list.insert(tk.END, os.path.basename(file))

    def update_output_format_options(self):
        file_extensions = [os.path.splitext(
            file)[1] for file in self.file_paths]
        categories = []

        for ext in file_extensions:
            ext = ext.lower()
            if ext in list(data.video_formats.keys()):
                categories.append("Video")
            elif ext in list(data.audio_formats.keys()):
                categories.append("Audio")
            elif ext in data.image_formats + [".jpg"]:
                categories.append("Image")
            elif ext in other.ncm_input:
                categories.append("NetEase")
            elif ext == ".pdf":
                categories.append("PDF")
            else:
                categories.append("Unknown")

        unique_categories = set(categories)

        if len(unique_categories) > 1:
            messagebox.showerror(
                _("Error"), _("Please select files from the same category"))
            self.output_format_var.set("")
            self.delete_inserted_files()
            return

        elif "Unknown" in unique_categories:
            messagebox.showerror(_("Error"), _(
                "Unsupported file type(s) selected"))
            self.output_format_var.set("")
            self.delete_inserted_files()
            return

        temp_category = unique_categories.pop()

        if self.category:
            if temp_category != self.category:
                messagebox.showerror(
                    _("Error"), _("Please select files from the same category"))
                self.output_format_var.set("")
                self.delete_inserted_files()
                return
        else:
            self.category = temp_category

        if self.category == "Video":
            self.output_format_options = list(data.video_formats.keys())
        elif self.category == "Audio":
            self.output_format_options = list(data.audio_formats.keys())
        elif self.category == "Image":
            self.output_format_options = data.image_formats
        elif self.category == "NetEase":
            self.output_format_options = other.ncm_output
        elif self.category == "PDF":
            self.output_format_options = other.pdf_output

        self.output_format_menu['values'] = self.output_format_options
        self.output_format_var.set(self.output_format_options[0])

        self.toggle_output_options(event=None)

    def delete_inserted_files(self):
        for i in range(len(self.file_paths)):
            self.total_file_paths.pop()
            self.file_list.delete(tk.END)

    def reset(self):
        self.output_format_menu['values'] = []
        self.output_format_var.set("")
        self.category = ""

    def clear_list(self):
        self.total_file_paths.clear()
        self.file_list.delete(0, tk.END)
        self.reset()

    def on_click(self, event):
        self.file_paths = filedialog.askopenfilenames()
        if self.file_paths:
            self.update_file_list()
            self.update_output_format_options()
            self.success_frame.grid_forget()
            self.failure_frame.grid_forget()

    def on_drop(self, event):
        pattern = r'\{[^}]*\}|[^ ]*'
        self.file_paths = re.findall(pattern, event.data)
        self.file_paths = [path.strip('{}')
                           for path in self.file_paths if path]
        if self.file_paths:
            self.update_file_list()
            self.update_output_format_options()
            self.success_frame.grid_forget()
            self.failure_frame.grid_forget()

    def convert_file(self):
        self.success_frame.grid_forget()
        self.failure_frame.grid_forget()

        # preconditions before converting
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

        # conversion successful
        self.loading_frame.grid_forget()
        self.stop_loading_animation()
        self.clear_list()
        self.convert_button.configure(state=tk.NORMAL)
        self.success_frame.grid(row=0, column=0)

    def insert_to_output_text(self, text):
        self.output_text.config(state=tk.NORMAL)
        self.output_text.insert(tk.END, "\n")
        for t in text:
            self.output_text.insert(tk.END, t)
        self.output_text.see(tk.END)
        self.output_text.config(state=tk.DISABLED)

    # center prompt area based on number of columns in row 1 of main frame
    def update_prompt_frame_span(self):
        num_columns = len(self.main_frame.grid_slaves(row=1))
        self.prompt_frame.grid_configure(columnspan=num_columns)

    def convert_file_thread(self):
        conversion_thread = threading.Thread(target=self.convert_file)
        conversion_thread.start()

    def metadata(self):
        if not self.total_file_paths:
            return

        for file_path in self.total_file_paths:
            # known issue: exiftool can't process non ascii characters
            results = {}
            try:
                process = subprocess.Popen([resource_path("dependency/exiftool.exe"), file_path], stdout=subprocess.PIPE,
                                           stderr=subprocess.STDOUT, universal_newlines=True, creationflags=subprocess.CREATE_NO_WINDOW)
                for output in process.stdout:
                    results[output.split(": ")[0].strip()] = output.split(": ")[
                        1].strip()
            except (IndexError, UnicodeDecodeError):
                messagebox.showerror(_("Error"), _(
                    "Known issue: exiftool can't process non ascii characters in filename or in metadata, please try renaming the file"))
                break

            if self.category == "Video":
                data = ["File Name", "File Size", "Duration", "File Modification Date/Time", "File Access Date/Time", "File Creation Date/Time", "Image Width", "Image Height",
                        "File Type", "MIME Type", "Major Brand", "Format", "Bit Depth", "Video Frame Rate", "Audio Format", "Audio Channels", "Audio Sample Rate", "Audio Bits Per Sample"]
            elif self.category == "Audio":
                data = ["File Name", "File Size", "Duration", "File Modification Date/Time", "File Access Date/Time", "File Creation Date/Time",
                        "File Type", "MIME Type", "Audio Bitrate", "Sample Rate", "Channel Mode", "Album", "Artist", "Title", "Picture MIME Type"]
            elif self.category == "Image":
                data = ["File Name", "File Size", "File Modification Date/Time", "File Creation Date/Time",
                        "Image Width", "Image Height", "File Type", "MIME Type", "Color Type", "Bit Depth"]
            elif self.category == "NetEase":
                data = []
            elif self.category == "PDF":
                data = ["File Name", "File Size", "File Modification Date/Time", "File Access Date/Time",
                        "File Creation Date/Time", "File Type", "MIME Type", "Page Count", "Title", "Creator", "Author", "Company"]

            self.metadata_window = tk.Toplevel(self)
            self.metadata_window.title(_("Metadata"))
            self.metadata_window.iconbitmap(
                resource_path("assets/metadata.ico"))
            self.metadata_window.resizable(False, False)
            self.metadata_window.columnconfigure(0, weight=1)
            self.metadata_window.rowconfigure(0, weight=1)

            self.meta_frame = ttk.Frame(self.metadata_window)
            self.meta_frame.pack(padx=20, pady=20)

            row_num = 0
            for item in data:
                try:
                    self.meta_label_l = ttk.Label(
                        self.meta_frame, text=_(item))
                    self.meta_label_m = ttk.Label(self.meta_frame, text=" : ")
                    self.meta_label_r = ttk.Label(
                        self.meta_frame, text=results[item])

                    self.meta_label_l.grid(row=row_num, column=0, sticky='w')
                    self.meta_label_m.grid(row=row_num, column=1, sticky='w')
                    self.meta_label_r.grid(row=row_num, column=2, sticky='w')
                    self.meta_frame.grid_rowconfigure(row_num, pad=5)
                    row_num += 1
                except KeyError:
                    pass

            # Center the metadata window to be inside of main app window
            self.metadata_window.update()
            window_width = self.metadata_window.winfo_width()
            window_height = self.metadata_window.winfo_height()

            main_x = self.winfo_x()
            main_y = self.winfo_y()
            main_width = self.winfo_width()
            main_height = self.winfo_height()
            center_x = int(main_x + (main_width - window_width) / 2)
            center_y = int(main_y + (main_height - window_height) / 2)
            self.metadata_window.geometry(f"+{center_x}+{center_y}")

 

    def reset_widgets(self):
        for widget, (variable, default_value) in self.option_defaults.items():
            widget.forget()
            if callable(default_value):
                default_value()
            else:
                variable.set(default_value)

    def reset_selected_widget(self, widget):
        widget.forget()
        widget_to_reset, default_value = self.option_defaults[widget]
        if callable(default_value):
            default_value()
        else:
            widget_to_reset.set(default_value)

    def toggle_output_options(self, event):
        self.reset_widgets()
        self.right_frame.grid(row=1, column=1, padx=(50, 0))
        self.l_right_frame.grid(row=0, column=0, padx=(10, 10))
        self.r_right_frame.grid(row=0, column=1, padx=(10, 10))

        # set netease options (None)
        if self.category == "NetEase":
            self.right_frame.grid_forget()

        # set video codec options based on output format
        elif self.category == "Video":
            self.video_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.video_codec_combobox["values"] = list(data.video_formats[self.output_format_var.get(
            )]["video"].keys())

            self.audio_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.audio_codec_combobox["values"] = list(data.video_formats[self.output_format_var.get(
            )]["audio"].keys())

        # set audio codec options based on output format
        elif self.category == "Audio":
            self.audio_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.audio_codec_combobox["values"] = list(
                data.audio_formats[self.output_format_var.get()].keys())
            self.l_right_frame.grid_forget()

        # set image widgets based on output format
        elif self.category == "Image":
            # modify slicing when changing number of widgets
            temp = list(self.option_defaults.keys())[25:31]
            for widget in temp:
                self.reset_selected_widget(widget)
            widgets = self.image_options[self.output_format_var.get()]
            if widgets:
                for widget in widgets:
                    widget.pack(pady=(10, 0), anchor=tk.W)
                self.r_right_frame.grid_forget()
            else:
                self.right_frame.grid_forget()

        # set pdf options
        elif self.category == "PDF":
            temp = list(self.option_defaults.keys())[31:]
            for widget in temp:
                self.reset_selected_widget(widget)
            widgets = self.pdf_options[self.output_format_var.get()]
            for widget in widgets:
                widget.pack(pady=(10, 0), anchor=tk.W)
            if self.output_format_var.get() == ".jpeg":
                self.r_right_frame.grid_forget()

        self.update_prompt_frame_span()

    def check_crf_lossless_conflict(self, event=None):
        if self.crf_value_label_text.get() and self.lossless_var.get():
            messagebox.showerror(
                _("Error"), _("Lossless shouldn't be used with a CRF value"))
            self.crf_scale.set(23)
            self.crf_value_label_text.set("")
            self.lossless_var.set(False)

    def check_roomtype_mixinglevel_both_selected(self):
        if self.room_type_var.get() and not self.mixing_level_value_label_text.get():
            messagebox.showerror(
                _("Error"), _("Mixing level must be set if room type is set"))
            return False
        else:
            return True

    def check_required_sample_rate(self):
        sample_rate_dependent_codec = list(
            data.widget_options["sample_rate"].keys())
        if self.audio_codec_var.get() in sample_rate_dependent_codec and not self.sample_rate_var.get():
            messagebox.showerror(_("Error"), _("Please select a sample rate"))
            return False
        return True


def ffmpeg_video(input_file, out_ext, vcodec, crf, preset, tune, faststart, speed, sharpness, meq, gmc, lossless, aqmode, motionest, acodec, abitrate, aaccoder, lpctype, chmode, vbr, roomtype, mixinglevel, dmix, dsur, dsurex, dheadphone, samplerate):
    out_file = os.path.splitext(input_file)[0] + "_converted" + out_ext

    command = [ffmpeg_path, "-i", input_file]

    command += ["-y", out_file]

    process = subprocess.Popen(command, stderr=subprocess.PIPE,
                               text=True, creationflags=subprocess.CREATE_NO_WINDOW)

    return process.communicate()[1]

self.file_paths = ""
self.total_file_paths = []
self.category = ""
self.loading_animation_running = True
self.settings_window = None
self.combobox_width = 19
self.entry_width = 23
self.entry_splitted_width = 8
self.scale_length = 180