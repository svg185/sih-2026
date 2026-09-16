from pathlib import Path
from typing import Any
import os

os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["FLAGS_use_mkldnn"] = "0"

from paddleocr import PaddleOCR

from .preprocessing import load_document, enhance_document


class DocumentOCREngine:
    """
    OCR engine for identity and travel documents.

    Current engine:
        PaddleOCR

    Output:
        Detected text
        Confidence
        Bounding boxes
        Average confidence
    """

    def __init__(self):
      self.ocr = PaddleOCR(
    lang="en",
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False,
)

    def extract(self, image_path: str) -> dict[str, Any]:

        image_path = str(Path(image_path))

        image = load_document(image_path)

        processed_image = enhance_document(image)

        results = self.ocr.predict(processed_image)

        detections = []
        full_text = []

        for result in results:

            data = result.json

            if callable(data):
                data = data()

            if not isinstance(data, dict):
                continue

            payload = data.get("res", data)

            texts = payload.get("rec_texts", [])
            scores = payload.get("rec_scores", [])
            boxes = payload.get("rec_polys", [])

            for index, text in enumerate(texts):

                text = str(text).strip()

                if not text:
                    continue

                confidence = 0.0

                if index < len(scores):
                    try:
                        confidence = float(scores[index])
                    except (TypeError, ValueError):
                        confidence = 0.0

                bbox = []

                if index < len(boxes):
                    bbox = boxes[index]

                detection = {
                    "text": text,
                    "confidence": round(confidence, 4),
                    "bbox": bbox,
                }

                detections.append(detection)
                full_text.append(text)

        average_confidence = 0.0

        if detections:
            average_confidence = (
                sum(
                    item["confidence"]
                    for item in detections
                )
                / len(detections)
            )

        return {
            "engine": "PaddleOCR",
            "text": "\n".join(full_text),
            "detections": detections,
            "average_confidence": round(
                average_confidence,
                4,
            ),
            "detection_count": len(detections),
        }


def extract_document_text(image_path: str):
    """Convenience function for API integration."""

    engine = DocumentOCREngine()

    return engine.extract(image_path)