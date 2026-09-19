from pathlib import Path
from typing import Any, Dict

from backend.document_ai.ocr.engine import DocumentOCREngine
from backend.document_ai.mrz.parser import MRZParser
from backend.document_ai.mrz.validator import MRZValidator
from backend.document_ai.tampering.detector import DocumentTamperingDetector
from backend.document_ai.face.detector import FaceDetector
from backend.document_ai.quality.quality_analyzer import DocumentQualityAnalyzer
from backend.document_ai.validation.document_type_detector import (
    DocumentTypeDetector,
)
from backend.document_ai.risk_engine.risk_engine import DocumentRiskEngine

class DocumentVerificationPipeline:
    """
    Complete document verification pipeline.

    Modules:
    - OCR
    - Document Quality Analysis
    - Document Type Detection
    - MRZ Parsing and Validation
    - Tampering Detection
    - Face Detection
    """

    def __init__(self):
        self.ocr = DocumentOCREngine()
        self.mrz_parser = MRZParser()
        self.mrz_validator = MRZValidator()
        self.tampering = DocumentTamperingDetector()
        self.face = FaceDetector()
        self.quality = DocumentQualityAnalyzer()
        self.document_type = DocumentTypeDetector()
        self.risk_engine = DocumentRiskEngine()

    def verify(self, image_path: str) -> Dict[str, Any]:
        image_path = str(Path(image_path))

        # Check document exists
        if not Path(image_path).exists():
            raise FileNotFoundError(
                f"Document image not found: {image_path}"
            )

        # -------------------------------------------------
        # 1. OCR
        # -------------------------------------------------
        ocr_result = self.ocr.extract(image_path)

        # Extract detected text FIRST
        detected_text = ocr_result.get("text", "")

        # -------------------------------------------------
        # 2. Document Quality Analysis
        # -------------------------------------------------
        quality_result = self.quality.analyze(image_path)

        # -------------------------------------------------
        # 3. Document Type Detection
        # -------------------------------------------------
        document_type_result = self.document_type.detect(
            detected_text
        )

        # -------------------------------------------------
        # 4. MRZ Parsing & Validation
        # -------------------------------------------------
        mrz_result = None
        mrz_validation = None

        if detected_text:
            try:
                mrz_result = self.mrz_parser.parse(
                    detected_text
                )

                mrz_validation = self.mrz_validator.validate(
                    detected_text
                )

            except Exception as exc:
                mrz_result = {
                    "error": str(exc)
                }

        # -------------------------------------------------
        # 5. Tampering Detection
        # -------------------------------------------------
        tampering_result = self.tampering.analyze(
            image_path
        )

        # -------------------------------------------------
        # 6. Face Detection
        # -------------------------------------------------
        face_result = self.face.detect(
            image_path
        )
        # -------------------------------------------------
        # 7. Final Risk Analysis
        # -------------------------------------------------
        risk_result = self.risk_engine.analyze(
         ocr_result=ocr_result,
         quality_result=quality_result,
         document_type_result=document_type_result,
         mrz_result=mrz_result,
         mrz_validation=mrz_validation,
         tampering_result=tampering_result,
         face_result=face_result,
        )

        # -------------------------------------------------
        # 8. Final Result
        # -------------------------------------------------
        return {
            "document": {
                "image_path": image_path,
                "status": "processed",
            },

            "ocr": ocr_result,

            "quality": quality_result,

            "document_type": document_type_result,

            "mrz": {
                "parsed": mrz_result,
                "validation": mrz_validation,
            },

            "tampering": tampering_result,

            "face": face_result,
            "risk": risk_result,
        }