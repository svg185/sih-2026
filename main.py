from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(
    title="Identity Security Backend",
    description="Backend API for AI-based identity document screening",
    version="1.0.0"
)


class RiskRequest(BaseModel):
    case_id: str


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


@app.post("/api/v1/risk/assess")
async def assess_risk(request: RiskRequest):

    # Temporary mock result.
    # Later this will be replaced by the real Risk Engine.

    return {
        "case_id": request.case_id,
        "score": 82,
        "level": "HIGH",
        "decision": "MANUAL_INVESTIGATION",
        "reasons": [
            "MRZ mismatch",
            "Tampering detected",
            "Low face similarity"
        ]
    }