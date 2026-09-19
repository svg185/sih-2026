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


# Common supported file formats
ALLOWED_EXTENSIONS = {
    # Images
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",

    # Documents
    ".pdf",
    ".doc",
    ".docx",
    ".odt",
    ".rtf",
    ".txt",

    # Spreadsheets
    ".xls",
    ".xlsx",
    ".csv",
    ".ods",

    # Presentations
    ".ppt",
    ".pptx",
    ".odp",
}


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
}


def convert_office_to_pdf(input_path: str, output_dir: str) -> str:
    """
    Convert Office/OpenDocument files to PDF using LibreOffice.
    """

    command = [
        "soffice",
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        output_dir,
        input_path,
    ]

    try:
        subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except FileNotFoundError:
        raise RuntimeError(
            "LibreOffice is required to process DOC/DOCX/XLS/XLSX/PPT/PPTX files."
        )
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"Could not convert document to PDF: {exc.stderr}"
        )

    pdf_path = (
        Path(output_dir)
        / f"{Path(input_path).stem}.pdf"
    )

    if not pdf_path.exists():
        raise RuntimeError(
            "Document conversion failed: PDF was not created."
        )

    return str(pdf_path)


def pdf_to_image(pdf_path: str, output_dir: str) -> str:
    """
    Convert the first PDF page into PNG.
    """

    try:
        import fitz
    except ImportError:
        raise RuntimeError(
            "PyMuPDF is required for PDF processing. "
            "Install it using: pip install pymupdf"
        )

    document = fitz.open(pdf_path)

    if len(document) == 0:
        document.close()
        raise RuntimeError("PDF contains no pages.")

    page = document[0]

    matrix = fitz.Matrix(2, 2)
    pixmap = page.get_pixmap(matrix=matrix)

    image_path = (
        Path(output_dir)
        / "converted_document.png"
    )

    pixmap.save(str(image_path))

    document.close()

    return str(image_path)


def prepare_document(
    input_path: str,
    extension: str,
    work_dir: str,
) -> str:
    """
    Prepare uploaded document for the image-based
    verification pipeline.
    """

    # Already an image
    if extension in IMAGE_EXTENSIONS:
        return input_path

    # PDF
    if extension == ".pdf":
        return pdf_to_image(
            input_path,
            work_dir,
        )

    # Office/OpenDocument formats
    office_extensions = {
        ".doc",
        ".docx",
        ".odt",
        ".rtf",
        ".xls",
        ".xlsx",
        ".csv",
        ".ods",
        ".ppt",
        ".pptx",
        ".odp",
    }

    if extension in office_extensions:
        pdf_path = convert_office_to_pdf(
            input_path,
            work_dir,
        )

        return pdf_to_image(
            pdf_path,
            work_dir,
        )

    # Plain text
    if extension == ".txt":
        raise RuntimeError(
            "TXT files contain text but no document image. "
            "Upload an identity document as PDF or image."
        )

    raise RuntimeError(
        f"Unsupported document format: {extension}"
    )


@app.get("/")
def root():
    return {
        "message": "Document AI Verification API is running",
        "status": "active",
    }


@app.post("/verify")
async def verify_document(
    file: UploadFile = File(...),
):
    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. Supported formats: "
                "JPG, JPEG, PNG, WEBP, BMP, TIFF, PDF, "
                "DOC, DOCX, ODT, RTF, TXT, XLS, XLSX, CSV, "
                "ODS, PPT, PPTX and ODP."
            ),
        )

    temp_dir = tempfile.mkdtemp(
        prefix="document_ai_"
    )

    temp_path = None

    try:
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

        # Convert document into a processable image
        processed_path = prepare_document(
            str(temp_path),
            extension,
            temp_dir,
        )

        # Run complete verification pipeline
        result = pipeline.verify(
            processed_path
        )

        return {
            "success": True,
            "filename": file.filename,
            "file_type": extension,
            "verification": result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    finally:
        shutil.rmtree(
            temp_dir,
            ignore_errors=True,
        )