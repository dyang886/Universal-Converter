import os
import sys
import json
import gettext
import polib
import subprocess
import pikepdf
import locale
import ebooklib
import pdfkit


def awz3_convert(inputFiles, outputExt, widget_args, error_set):
    for inputFile in inputFiles:
        outputFile = os.path.splitext(inputFile)[0] + "_converted" + outputExt

        try:
            # Assuming you're working with EPUB files
            book = ebooklib.epub.read_epub(inputFile)
            html_content = ''
            for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
                html_content += item.get_content().decode('utf-8')

            pdfkit.from_string(html_content, outputFile)
        
        except Exception as e:
            error_set.add(f"Error converting {inputFile}: {str(e)}")

# def pdf_convert(input_paths, out_ext, combine, user_password, owner_password, access, extract, annotation, assembly, form, other, p_lower, p_higher, metadata, dpi, quality, optimize):
#     _ = get_translator()

#     if out_ext == ".pdf":
#         output_pdfs = []
#         pdf_tag = ".pdf"

#         # if no options were selected, raise exception
#         if user_password == "" and owner_password == "" and (access and extract and annotation and assembly and form and other and p_lower and p_higher) == True and (metadata or combine) == False:
#             raise RuntimeError(_("No operations performed"))

#         permissions = pikepdf.Permissions(
#             accessibility=access,
#             extract=extract,
#             modify_annotation=annotation,
#             modify_assembly=assembly,
#             modify_form=form,
#             modify_other=other,
#             print_lowres=p_lower,
#             print_highres=p_higher
#         )

#         if combine:
#             output_pdf = pikepdf.Pdf.new()
#             for pdf_file in input_paths:
#                 with pikepdf.open(pdf_file) as file:
#                     for page in file.pages:
#                         output_pdf.pages.append(page)
#             combined_file_path, _ = os.path.splitext(input_paths[0])
#             output_pdfs.append([output_pdf, combined_file_path + "_combined"])

#         else:
#             for pdf_file in input_paths:
#                 pdf = pikepdf.Pdf.open(pdf_file)
#                 pdf_path = os.path.splitext(pdf_file)[0]
#                 output_pdfs.append([pdf, pdf_path])

#         if (user_password != "" or owner_password != "") or (access and extract and annotation and assembly and form and other and p_lower and p_higher) == False or metadata == True:
#             pdf_tag = "_encrypted" + pdf_tag
#             for pdf in output_pdfs:
#                 pdf[0].save(pdf[1] + pdf_tag, encryption=pikepdf.Encryption(
#                     user=user_password, owner=owner_password, allow=permissions, metadata=metadata))

#         else:
#             for pdf in output_pdfs:
#                 pdf[0].save(pdf[1] + pdf_tag)

#     elif out_ext == ".jpeg":
#         result = []
#         root_directory = os.path.split(input_paths[0])[0]
#         root_directory += "/pdf_to_jpeg_converted/"
#         if not os.path.exists(root_directory):
#             os.makedirs(root_directory)

#         for pdf in input_paths:
#             pdf_name = os.path.split(pdf)[1]
#             os.makedirs(root_directory +
#                         os.path.splitext(pdf_name)[0], exist_ok=True)

#             if optimize:
#                 optimize = "y"
#             else:
#                 optimize = "n"
#             if not quality:
#                 quality = "75"
#             command = [resource_path("dependency/poppler/pdftoppm.exe")]
#             if dpi:
#                 command += ["-r", dpi]  # max -r value 3089
#             command += ["-jpeg"]
#             command += ["-jpegopt", f"quality={quality},optimize={optimize}"]
#             command += [pdf,
#                         f"{root_directory + os.path.splitext(pdf_name)[0]}/{pdf_name[:-4]}"]

#             process = subprocess.Popen(
#                 command, stderr=subprocess.PIPE, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
#             result.append(process.communicate()[1])
#         return result
