import re


class DocumentTypeDetector:
    """
    Detects common identity document types using OCR text
    and MRZ patterns.
    """

    def detect(self, ocr_text: str) -> dict:
        if not ocr_text:
            return {
                "document_type": "UNKNOWN",
                "confidence": 0.0,
                "reason": "No OCR text available",
            }

        text = ocr_text.upper()
        score = {
            "PASSPORT": 0,
            "ID_CARD": 0,
            "DRIVING_LICENSE": 0,
        }

        # Passport indicators
        if "PASSPORT" in text:
            score["PASSPORT"] += 60

        if "P<" in text or re.search(r"[A-Z]{3}P[A-Z<]", text):
            score["PASSPORT"] += 30

        if "NATIONALITY" in text:
            score["PASSPORT"] += 10

        # Driving licence indicators
        if "DRIVING LICENCE" in text or "DRIVING LICENSE" in text:
            score["DRIVING_LICENSE"] += 70

        if "DL NO" in text or "LICENCE NO" in text or "LICENSE NO" in text:
            score["DRIVING_LICENSE"] += 20

        # ID card indicators
        if "IDENTITY CARD" in text:
            score["ID_CARD"] += 60

        if "IDENTIFICATION" in text:
            score["ID_CARD"] += 20

        if "DATE OF BIRTH" in text:
            score["ID_CARD"] += 10

        # Select highest score
        document_type = max(score, key=score.get)
        best_score = score[document_type]

        if best_score == 0:
            return {
                "document_type": "UNKNOWN",
                "confidence": 0.0,
                "reason": "No strong document-type indicators found",
                "scores": score,
            }

        confidence = min(best_score / 100, 1.0)

        return {
            "document_type": document_type,
            "confidence": round(confidence, 2),
            "scores": score,
        }