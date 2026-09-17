from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from backend.services.morph_service import detect_morph as run_morph_detection

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(
    title="Identity Security Backend",
    description="Backend API for AI-based identity document screening",
    version="1.0.0"
)

UPLOAD_DIR = BASE_DIR / "backend" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
class RiskRequest(BaseModel):
    case_id: str
    tampering_score: float = 0.0
    face_similarity: float = 0.0
    liveness_score: float = 0.0
    morph_probability: float = 0.0
    mrz_valid: bool = True
    watchlist_match: bool = False


@app.get("/")
async def root():
    return {
        "message": "Identity Security Backend is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }
@app.post("/api/v1/screening/upload")
async def upload_identity_document(
    file: UploadFile = File(...)
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed."
        )

    file_extension = Path(file.filename or "").suffix.lower()

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    }

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format."
        )

    file_name = f"uploaded_document{file_extension}"
    file_path = UPLOAD_DIR / file_name

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    file_path.write_bytes(content)

    return {
        "filename": file.filename,
        "saved_path": str(file_path),
        "content_type": file.content_type,
        "size_bytes": len(content),
        "status": "UPLOAD_SUCCESS"
    }

@app.post("/api/v1/risk/assess")
async def assess_risk(request: RiskRequest):

    score = 0
    reasons = []

    # 1. Tampering
    if request.tampering_score >= 0.80:
        score += 25
        reasons.append("High tampering score")
    elif request.tampering_score >= 0.50:
        score += 15
        reasons.append("Tampering detected")

    # 2. Face verification
    if request.face_similarity < 0.50:
        score += 25
        reasons.append("Very low face similarity")
    elif request.face_similarity < 0.75:
        score += 15
        reasons.append("Low face similarity")

    # 3. Morph detection
    if request.morph_probability >= 0.80:
        score += 25
        reasons.append("High morph probability")
    elif request.morph_probability >= 0.50:
        score += 15
        reasons.append("Morph detection alert")

    # 4. Liveness
    if request.liveness_score < 0.50:
        score += 15
        reasons.append("Low liveness score")

    # 5. MRZ
    if not request.mrz_valid:
        score += 10
        reasons.append("MRZ validation failed")

    # 6. Watchlist
    if request.watchlist_match:
        score += 20
        reasons.append("Watchlist match alert")

    # Cap score at 100
    score = min(score, 100)

    # Risk level
    if score >= 70:
        level = "HIGH"
        decision = "MANUAL_INVESTIGATION"
    elif score >= 40:
        level = "MEDIUM"
        decision = "ADDITIONAL_VERIFICATION"
    else:
        level = "LOW"
        decision = "STANDARD_VERIFICATION"

    return {
        "case_id": request.case_id,
        "score": score,
        "level": level,
        "decision": decision,
        "reasons": reasons
    }


class DocumentRequest(BaseModel):
    case_id: str


@app.post("/api/v1/document/analyze")
async def analyze_document(request: DocumentRequest):

    # Temporary mock result.
    # Later this will be replaced by the real Document AI model.

    return {
        "case_id": request.case_id,
        "document_type": "PASSPORT",
        "document_quality": 0.94,
        "ocr_status": "PASS",
        "mrz_detected": True,
        "visual_anomaly_score": 0.18,
        "status": "DOCUMENT_ANALYSIS_COMPLETE"
    }
class MRZRequest(BaseModel):
    case_id: str


@app.post("/api/v1/document/mrz")
async def extract_mrz(request: MRZRequest):

    # Temporary mock result.
    # Later this will be replaced by the real MRZ/OCR model.

    return {
        "case_id": request.case_id,
        "mrz_detected": True,
        "document_type": "PASSPORT",
        "mrz_format": "TD3",
        "document_number": "P1234567",
        "issuing_country": "IND",
        "nationality": "IND",
        "date_of_birth": "1995-01-15",
        "sex": "M",
        "expiry_date": "2030-01-14",
        "check_digits_valid": True,
        "status": "MRZ_EXTRACTION_COMPLETE"
    }
class TamperingRequest(BaseModel):
    case_id: str


@app.post("/api/v1/forensics/tampering")
async def detect_tampering(request: TamperingRequest):

    # Temporary mock result.
    # Later this will be replaced by the real Forensics model.

    return {
        "case_id": request.case_id,
        "tampering_detected": True,
        "tampering_score": 0.87,
        "anomaly_regions": [
            "photo_region",
            "document_number_region"
        ],
        "manipulation_type": "IMAGE_EDITING",
        "confidence": 0.91,
        "status": "TAMPERING_ANALYSIS_COMPLETE"
    }
class FaceVerificationRequest(BaseModel):
    case_id: str


@app.post("/api/v1/biometric/face/verify")
async def verify_face(request: FaceVerificationRequest):

    # Temporary mock result.
    # Later this will be replaced by the real Face Verification model.

    return {
        "case_id": request.case_id,
        "face_match": False,
        "similarity_score": 0.42,
        "threshold": 0.75,
        "confidence": 0.93,
        "status": "FACE_VERIFICATION_COMPLETE"
    }
class LivenessRequest(BaseModel):
    case_id: str


@app.post("/api/v1/biometric/liveness")
async def check_liveness(request: LivenessRequest):

    # Temporary mock result.
    # Later this will be replaced by the real Liveness Detection model.

    return {
        "case_id": request.case_id,
        "is_live": True,
        "liveness_score": 0.96,
        "spoof_detected": False,
        "confidence": 0.94,
        "status": "LIVENESS_CHECK_COMPLETE"
    }
class MorphDetectionRequest(BaseModel):
    case_id: str


@app.post("/api/v1/biometric/morph")
async def detect_morph(request: MorphDetectionRequest):

    image_path = UPLOAD_DIR / "uploaded_document.jpg"
    result = run_morph_detection(
        str(image_path)
    )

    confidence = result["confidence"]

    if result["morph_detected"]:
        morph_probability = confidence
        genuine_probability = 1 - confidence
    else:
        genuine_probability = confidence
        morph_probability = 1 - confidence

    return {
        "case_id": request.case_id.strip().upper(),
        "morph_detected": result["morph_detected"],
        "label": result["label"],
        "morph_probability": round(morph_probability, 4),
        "genuine_probability": round(genuine_probability, 4),
        "confidence": confidence,
        "model": result["model"],
        "status": result["status"]
    }
class WatchlistRequest(BaseModel):
    case_id: str


@app.post("/api/v1/intelligence/watchlist/search")
async def search_watchlist(request: WatchlistRequest):

    # Temporary synthetic watchlist result.
    # Later this will be replaced by an authorized watchlist service.

    return {
        "case_id": request.case_id,
        "match_found": True,
        "match_type": "IDENTITY_ALERT",
        "matched_name": "SYNTHETIC TEST SUBJECT",
        "match_score": 0.89,
        "watchlist_category": "HIGH_RISK",
        "source": "DEMO_WATCHLIST",
        "status": "WATCHLIST_SEARCH_COMPLETE"
    }

class AuditHistoryRequest(BaseModel):
    case_id: str


@app.post("/api/v1/audit/history")
async def get_audit_history(request: AuditHistoryRequest):

    # Temporary mock audit history.
    # Later this will be replaced by the real Audit Log database.

    return {
        "case_id": request.case_id,
        "audit_entries": [
            {
                "timestamp": "2026-09-13T10:30:00Z",
                "actor": "SYSTEM",
                "action": "DOCUMENT_ANALYSIS",
                "status": "COMPLETED"
            },
            {
                "timestamp": "2026-09-13T10:31:00Z",
                "actor": "SYSTEM",
                "action": "MRZ_EXTRACTION",
                "status": "COMPLETED"
            },
            {
                "timestamp": "2026-09-13T10:32:00Z",
                "actor": "SYSTEM",
                "action": "TAMPERING_ANALYSIS",
                "status": "FLAGGED"
            },
            {
                "timestamp": "2026-09-13T10:33:00Z",
                "actor": "SYSTEM",
                "action": "FACE_VERIFICATION",
                "status": "FLAGGED"
            }
        ],
        "total_entries": 4,
        "status": "AUDIT_HISTORY_RETRIEVED"
    }
class InvestigationRequest(BaseModel):
    case_id: str


@app.post("/api/v1/investigation/create")
async def create_investigation(request: InvestigationRequest):

    # Temporary mock investigation record.
    # Later this will be stored in the real investigation database.

    return {
        "case_id": request.case_id,
        "investigation_id": "INV-CASE-001",
        "priority": "HIGH",
        "status": "INVESTIGATION_CREATED",
        "assigned_to": "HUMAN_OFFICER",
        "reason": "Multiple identity verification checks were flagged",
        "human_review_required": True
    }