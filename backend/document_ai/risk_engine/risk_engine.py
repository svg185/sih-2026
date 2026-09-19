from typing import Any, Dict


class DocumentRiskEngine:
    """
    Combines OCR, document type, quality, MRZ,
    tampering and face detection results into
    a final document verification decision.
    """

    def analyze(
        self,
        ocr_result: Dict[str, Any],
        quality_result: Dict[str, Any],
        document_type_result: Dict[str, Any],
        mrz_result: Dict[str, Any],
        mrz_validation: Dict[str, Any],
        tampering_result: Dict[str, Any],
        face_result: Dict[str, Any],
    ) -> Dict[str, Any]:

        risk_score = 0.0
        warnings = []

        # --------------------------------
        # 1. OCR
        # --------------------------------
        ocr_confidence = float(
            ocr_result.get("average_confidence", 0)
        )

        if ocr_confidence < 0.70:
            risk_score += 0.20
            warnings.append("Low OCR confidence")

        elif ocr_confidence < 0.85:
            risk_score += 0.10
            warnings.append("Moderate OCR confidence")

        # --------------------------------
        # 2. Document Type
        # --------------------------------
        document_type = document_type_result.get(
            "document_type",
            "UNKNOWN"
        )

        document_confidence = float(
            document_type_result.get("confidence", 0)
        )

        if document_type == "UNKNOWN":
            risk_score += 0.20
            warnings.append("Unknown document type")

        elif document_confidence < 0.70:
            risk_score += 0.10
            warnings.append("Low document type confidence")

        # --------------------------------
        # 3. Document Quality
        # --------------------------------
        quality_score = float(
            quality_result.get("quality_score", 0)
        )

        if quality_score < 50:
            risk_score += 0.15
            warnings.append("Poor document quality")

        elif quality_score < 70:
            risk_score += 0.05
            warnings.append("Moderate document quality")

        # --------------------------------
        # 4. MRZ Validation
        # --------------------------------
        mrz_valid = bool(
            mrz_validation.get("valid", False)
        )

        if document_type == "PASSPORT":

            if not mrz_valid:
                risk_score += 0.35
                warnings.append(
                    "Passport MRZ validation failed"
                )

        # --------------------------------
        # 5. Tampering
        # --------------------------------
        tampered = bool(
            tampering_result.get("tampered", False)
        )

        tampering_risk = float(
            tampering_result.get("risk_score", 0)
        )

        if tampered:
            risk_score += 0.40
            warnings.append(
                "Possible document tampering detected"
            )

        elif tampering_risk > 0.30:
            risk_score += 0.20
            warnings.append(
                "Elevated tampering risk"
            )

        # --------------------------------
        # 6. Face Detection
        # --------------------------------
        face_detected = bool(
            face_result.get("face_detected", False)
        )

        if not face_detected:
            risk_score += 0.15
            warnings.append(
                "No face detected on document"
            )

        # --------------------------------
        # Normalize score
        # --------------------------------
        risk_score = min(
            round(risk_score, 3),
            1.0
        )

        # --------------------------------
        # Final decision
        # --------------------------------
        if risk_score >= 0.60:
            status = "SUSPICIOUS"

        elif risk_score >= 0.30:
            status = "REQUIRES_REVIEW"

        else:
            status = "VERIFIED"

        return {
            "status": status,
            "risk_score": risk_score,
            "risk_percentage": round(
                risk_score * 100,
                2
            ),
            "warnings": warnings,
            "checks": {
                "ocr_ok": ocr_confidence >= 0.70,
                "document_type_ok": (
                    document_type != "UNKNOWN"
                ),
                "quality_ok": quality_score >= 50,
                "mrz_ok": mrz_valid,
                "tampering_ok": not tampered,
                "face_detected": face_detected,
            },
        }