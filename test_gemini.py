from services.gemini_client import investigate


evidence = {
    "case_id": "CASE-001",
    "score": 82,
    "level": "HIGH",
    "decision": "MANUAL_INVESTIGATION",
    "reasons": [
        "MRZ mismatch",
        "Tampering detected",
        "Low face similarity"
    ]
}


result = investigate(evidence)

print("\n===== AI INVESTIGATION REPORT =====\n")
print(result)