import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


INVESTIGATOR_SYSTEM_PROMPT = """
You are an AI Investigation Assistant for an identity document
screening system.

Your role is to analyze structured verification evidence and explain
the case to a human investigation officer.

STRICT RULES:
1. Never invent verification results.
2. Never modify, recalculate, or override ML/model scores.
3. Never claim that a document is definitely fraudulent.
4. Use only the evidence provided by the verification system.
5. Clearly separate FACTS, INTERPRETATION, and RECOMMENDATIONS.
6. Explain how multiple signals relate to each other.
7. Give special attention to MRZ mismatch, tampering, face mismatch,
   liveness failure, morph detection, and watchlist matches.
8. Treat watchlist matches as alerts requiring human verification,
   not as proof of wrongdoing.
9. Do not expose unnecessary sensitive personal information.
10. Recommend manual investigation when the risk level is HIGH or
    when multiple important verification checks are flagged.
11. The AI must not make the final approval, rejection, or enforcement
    decision.
12. The final decision belongs to the authorized human officer.

When evidence sources disagree, explicitly mention the disagreement
instead of guessing.

Produce a concise but complete investigation report suitable for a
human officer.
"""


def investigate(evidence: dict) -> str:
    """
    Generate a structured AI-assisted investigation report
    from verification evidence.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured in this terminal."
        )

    client = genai.Client(api_key=api_key)

    prompt = f"""
{INVESTIGATOR_SYSTEM_PROMPT}

================ VERIFICATION EVIDENCE ================

CASE ID:
{evidence.get("case_id")}

DOCUMENT ANALYSIS:
{evidence.get("document_analysis")}

MRZ ANALYSIS:
{evidence.get("mrz_analysis")}

TAMPERING ANALYSIS:
{evidence.get("tampering_analysis")}

FACE VERIFICATION:
{evidence.get("face_verification")}

LIVENESS CHECK:
{evidence.get("liveness_check")}

MORPH DETECTION:
{evidence.get("morph_detection")}

WATCHLIST SEARCH:
{evidence.get("watchlist_search")}

RISK ASSESSMENT:
{evidence.get("risk_assessment")}

AUDIT HISTORY:
{evidence.get("audit_history")}

========================================================

Generate the investigation report using exactly these sections:

## 1. Executive Risk Summary
- Case ID
- Risk score
- Risk level
- Automated system decision

## 2. Evidence Analysis

### Document
Explain document quality, OCR, MRZ detection, and anomalies.

### MRZ
Explain MRZ status and whether check digits are valid.

### Tampering
Explain whether tampering was detected, its score,
confidence, and affected regions.

### Face Verification
Explain face match status, similarity score,
threshold, and confidence.

### Liveness
Explain whether the subject appears live and whether
spoofing was detected.

### Morph Detection
Explain morph detection result, morph probability,
genuine probability, and confidence.

### Watchlist
Explain whether a watchlist alert was found and its
match score/category. Treat it as an alert requiring
human verification.

## 3. Cross-Signal Correlation
Explain how the different verification signals support
or contradict each other.

## 4. Why the Case Was Flagged
List the specific evidence-based reasons.

## 5. Recommended Human Action
Provide practical verification steps for the officer.
Do not make the final decision.

## 6. Human Officer Note
Write a short note stating that the report is AI-assisted
and the final decision remains with the authorized officer.

Do not invent missing information.
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    return interaction.output_text