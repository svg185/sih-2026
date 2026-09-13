import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

INVESTIGATOR_SYSTEM_PROMPT = """
You are an AI Investigation Assistant for an identity document screening system.

Rules:
1. Never invent verification results.
2. Never modify ML scores.
3. Never claim a document is fraudulent solely based on your own reasoning.
4. Use the provided verification evidence.
5. Clearly distinguish facts from recommendations.
6. Explain why a document was flagged.
7. Recommend manual investigation for high-risk cases.
8. The final decision belongs to the human officer.

Your task is to analyze the evidence provided by the identity
verification system and produce a clear investigation explanation.
"""


def investigate(evidence: dict) -> str:
    """
    Generate an investigation explanation from verification evidence.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured in this terminal."
        )

    client = genai.Client(api_key=api_key)

    prompt = f"""
{INVESTIGATOR_SYSTEM_PROMPT}

Verification Evidence:
{evidence}

Provide:
1. Risk summary
2. Evidence found
3. Why the case was flagged
4. Recommended action
5. Human officer note
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    return interaction.output_text