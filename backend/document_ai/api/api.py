from pathlib import Path
import shutil
import tempfile
import subprocess
import os

from fastapi import FastAPI, File, UploadFile, HTTPException

from backend.document_ai.pipeline.verification_pipeline import (
    DocumentVerificationPipeline,
)


app = FastAPI(
    title="Document AI Verification API",
    description="AI-based identity document screening API",
    version="1.0.0",
)


pipeline = DocumentVerificationPipeline()


# ============================================================
# SUPPORTED FILE FORMATS
# ============================================================

# Image formats that can be directly processed by OpenCV/Pipeline
IMAGE_EXTENSIONS = {
    # JPEG family
    ".jpg",
    ".jpeg",
    ".jpe",
    ".jfif",

    # PNG family
    ".png",
    ".apng",

    # Web formats
    ".webp",

    # Bitmap
    ".bmp",
    ".dib",

    # TIFF
    ".tif",
    ".tiff",

    # Portable bitmap formats
    ".ppm",
    ".pgm",
    ".pbm",
    ".pnm",

    # JPEG 2000
    ".jp2",
    ".j2k",
    ".jpf",
    ".jpx",

    # JPEG XR
    ".jxr",
}


# PDF
PDF_EXTENSIONS = {
    ".pdf",
}


# Microsoft Word / document formats
WORD_EXTENSIONS = {
    ".doc",
    ".docx",
    ".docm",
    ".dot",
    ".dotx",
}


# Microsoft Excel / spreadsheet formats
EXCEL_EXTENSIONS = {
    ".xls",
    ".xlsx",
    ".xlsm",
    ".xlt",
    ".xltx",
}


# Microsoft PowerPoint formats
POWERPOINT_EXTENSIONS = {
    ".ppt",
    ".pptx",
    ".pptm",
    ".pps",
    ".ppsx",
    ".pot",
    ".potx",
}


# OpenDocument formats
OPEN_DOCUMENT_EXTENSIONS = {
    ".odt",
    ".ott",
    ".ods",
    ".ots",
    ".odp",
    ".otp",
}


# Other document formats that LibreOffice can convert
OTHER_DOCUMENT_EXTENSIONS = {
    ".rtf",
    ".txt",
    ".csv",
}


# Combine everything
ALLOWED_EXTENSIONS = (
    IMAGE_EXTENSIONS
    | PDF_EXTENSIONS
    | WORD_EXTENSIONS
    | EXCEL_EXTENSIONS
    | POWERPOINT_EXTENSIONS
    | OPEN_DOCUMENT_EXTENSIONS
    | OTHER_DOCUMENT_EXTENSIONS
)


# ============================================================
# LIBREOFFICE DETECTION
# ============================================================

def find_libreoffice() -> str:
    """
    Find LibreOffice executable on Windows/Linux/macOS.
    """

    # First check PATH
    soffice = shutil.which("soffice")

    if soffice:
        return soffice

    # Windows common installation locations
    windows_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        os.path.expandvars(
            r"%LOCALAPPDATA%\Programs\LibreOffice\program\soffice.exe"
        ),
    ]

    for path in windows_paths:
        if Path(path).exists():
            return path

    # Linux common locations
    linux_paths = [
        "/usr/bin/soffice",
        "/usr/local/bin/soffice",
    ]

    for path in linux_paths:
        if Path(path).exists():
            return path

    # macOS
    mac_path = (
        "/Applications/LibreOffice.app/"
        "Contents/MacOS/soffice"
    )

    if Path(mac_path).exists():
        return mac_path

    raise RuntimeError(
        "LibreOffice is required to process Office/OpenDocument files. "
        "Please install LibreOffice and restart the terminal."
    )


# ============================================================
# OFFICE / DOCUMENT → PDF
# ============================================================

def convert_office_to_pdf(
    input_path: str,
    output_dir: str,
) -> str:
    """
    Convert Office/OpenDocument/Text files to PDF
    using LibreOffice.
    """

    soffice = find_libreoffice()

    command = [
        soffice,
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        output_dir,
        input_path,
    ]

    try:
        result = subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    except subprocess.CalledProcessError as exc:
        error_message = (
            exc.stderr.strip()
            or exc.stdout.strip()
            or "Unknown LibreOffice conversion error."
        )

        raise RuntimeError(
            f"Could not convert document to PDF: {error_message}"
        )

    pdf_path = (
        Path(output_dir)
        / f"{Path(input_path).stem}.pdf"
    )

    if not pdf_path.exists():
        raise RuntimeError(
            "Document conversion failed: "
            "LibreOffice did not create the PDF."
        )

    return str(pdf_path)


# ============================================================
# PDF → IMAGE
# ============================================================

def pdf_to_image(
    pdf_path: str,
    output_dir: str,
) -> str:
    """
    Convert the first PDF page into PNG.

    The verification pipeline currently works on images,
    so PDF documents are converted to an image first.
    """

    try:
        import fitz

    except ImportError:
        raise RuntimeError(
            "PyMuPDF is required for PDF processing. "
            "Install it using: pip install pymupdf"
        )

    document = fitz.open(pdf_path)

    try:
        if len(document) == 0:
            raise RuntimeError(
                "PDF contains no pages."
            )

        page = document[0]

        # Higher resolution for better OCR
        matrix = fitz.Matrix(2, 2)

        pixmap = page.get_pixmap(
            matrix=matrix,
            alpha=False,
        )

        image_path = (
            Path(output_dir)
            / "converted_document.png"
        )

        pixmap.save(
            str(image_path)
        )

    finally:
        document.close()

    if not image_path.exists():
        raise RuntimeError(
            "PDF conversion failed: image was not created."
        )

    return str(image_path)


# ============================================================
# PREPARE DOCUMENT
# ============================================================

def prepare_document(
    input_path: str,
    extension: str,
    work_dir: str,
) -> str:
    """
    Prepare uploaded document for the image-based
    verification pipeline.
    """

    extension = extension.lower()

    # --------------------------------------------------------
    # IMAGE
    # --------------------------------------------------------

    if extension in IMAGE_EXTENSIONS:
        return input_path


    # --------------------------------------------------------
    # PDF
    # --------------------------------------------------------

    if extension in PDF_EXTENSIONS:
        return pdf_to_image(
            input_path,
            work_dir,
        )


    # --------------------------------------------------------
    # OFFICE / OPENDOCUMENT / TEXT
    # --------------------------------------------------------

    office_extensions = (
        WORD_EXTENSIONS
        | EXCEL_EXTENSIONS
        | POWERPOINT_EXTENSIONS
        | OPEN_DOCUMENT_EXTENSIONS
        | OTHER_DOCUMENT_EXTENSIONS
    )

    if extension in office_extensions:

        pdf_path = convert_office_to_pdf(
            input_path,
            work_dir,
        )

        return pdf_to_image(
            pdf_path,
            work_dir,
        )


    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    raise RuntimeError(
        f"Unsupported document format: {extension}"
    )


# ============================================================
# HELPER — SUPPORTED FORMAT MESSAGE
# ============================================================

def get_supported_formats_message() -> str:
    """
    Generate a clean supported-format list.
    """

    return ", ".join(
        sorted(
            ext.replace(".", "").upper()
            for ext in ALLOWED_EXTENSIONS
        )
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Document AI Verification API is running",
        "status": "active",
        "supported_formats": sorted(
            ALLOWED_EXTENSIONS
        ),
    }


# ============================================================
# VERIFY DOCUMENT
# ============================================================

@app.post("/verify")
async def verify_document(
    file: UploadFile = File(...),
):
    """
    Upload and verify an identity/document file.
    """

    # --------------------------------------------------------
    # CHECK FILENAME
    # --------------------------------------------------------

    filename = file.filename or ""

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="No file was provided.",
        )


    # --------------------------------------------------------
    # GET EXTENSION
    # --------------------------------------------------------

    extension = Path(
        filename
    ).suffix.lower()


    # --------------------------------------------------------
    # CHECK SUPPORTED EXTENSION
    # --------------------------------------------------------

    if extension not in ALLOWED_EXTENSIONS:

        supported_formats = (
            get_supported_formats_message()
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                f"Supported formats: {supported_formats}"
            ),
        )


    # --------------------------------------------------------
    # CREATE TEMP DIRECTORY
    # --------------------------------------------------------

    temp_dir = tempfile.mkdtemp(
        prefix="document_ai_"
    )

    temp_path = None

    try:

        # ----------------------------------------------------
        # SAVE UPLOADED FILE
        # ----------------------------------------------------

        temp_path = (
            Path(temp_dir)
            / f"uploaded{extension}"
        )

        with open(
            temp_path,
            "wb",
        ) as temp_file:

            shutil.copyfileobj(
                file.file,
                temp_file,
            )


        # ----------------------------------------------------
        # PREPARE DOCUMENT
        # ----------------------------------------------------

        processed_path = prepare_document(
            str(temp_path),
            extension,
            temp_dir,
        )


        # ----------------------------------------------------
        # RUN COMPLETE VERIFICATION PIPELINE
        # ----------------------------------------------------

        result = pipeline.verify(
            processed_path
        )


        # ----------------------------------------------------
        # SUCCESS RESPONSE
        # ----------------------------------------------------

        return {
            "success": True,
            "filename": filename,
            "file_type": extension,
            "verification": result,
        }


    # --------------------------------------------------------
    # CLIENT / FILE PROCESSING ERROR
    # --------------------------------------------------------

    except RuntimeError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


    # --------------------------------------------------------
    # FILE NOT FOUND
    # --------------------------------------------------------

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


    # --------------------------------------------------------
    # UNEXPECTED ERROR
    # --------------------------------------------------------

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Document verification failed: "
                f"{str(exc)}"
            ),
        )


    # --------------------------------------------------------
    # CLEAN TEMP FILES
    # --------------------------------------------------------

    finally:

        shutil.rmtree(
            temp_dir,
            ignore_errors=True,
        )