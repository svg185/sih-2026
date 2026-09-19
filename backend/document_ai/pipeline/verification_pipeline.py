from pathlib import Path
from typing import Any, Dict

from backend.document_ai.ocr.engine import DocumentOCREngine
from backend.document_ai.mrz.parser import MRZParser
from backend.document_ai.mrz.validator import MRZValidator
from backend.document_ai.tampering.detector import DocumentTamperingDetector
from backend.document_ai.face.detector import FaceDetector


class DocumentVerificationPipeline:
    """
    Combines OCR, MRZ parsing/validation,
    tampering detection and face detection.
    """

    def __init__(self):
        self.ocr = DocumentOCREngine()
        self.mrz_parser = MRZParser()
        self.mrz_validator = MRZValidator()
        self.tampering = DocumentTamperingDetector()
        self.face = FaceDetector()

    def verify(self, image_path: str) -> Dict[str, Any]:
        image_path = str(Path(image_path))

        if not Path(image_path).exists():
            raise FileNotFoundError(
                f"Document image not found: {image_path}"
            )

        # 1. OCR
        ocr_result = self.ocr.extract(image_path)

        # Extract detected text
        detected_text = ocr_result.get("text", "")

        # 2. MRZ parsing
        mrz_result = None
        mrz_validation = None

        if detected_text:
            try:
                mrz_result = self.mrz_parser.parse(detected_text)
                mrz_validation = self.mrz_validator.validate(
                    detected_text
                )
            except Exception as exc:
                mrz_result = {
                    "error": str(exc)
                }

        # 3. Tampering detection
        tampering_result = self.tampering.analyze(image_path)

        # 4. Face detection
        face_result = self.face.detect(image_path)

        # 5. Final result
        return {
            "document": {
                "image_path": image_path,
                "status": "processed",
            },
            "ocr": ocr_result,
            "mrz": {
                "parsed": mrz_result,
                "validation": mrz_validation,
            },
            "tampering": tampering_result,
            "face": face_result,
        }