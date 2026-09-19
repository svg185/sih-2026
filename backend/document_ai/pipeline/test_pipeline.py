from pathlib import Path
from pprint import pprint

from backend.document_ai.pipeline.verification_pipeline import (
    DocumentVerificationPipeline,
)


def main():
    image_path = (
        Path(__file__).resolve().parents[3]
        / "sample_documents"
        / "sample_passport.jpg"
    )

    print("\n========================================")
    print("     DOCUMENT VERIFICATION PIPELINE")
    print("========================================\n")

    print(f"Document: {image_path}")

    pipeline = DocumentVerificationPipeline()

    print("\n[1] Running verification pipeline...\n")

    result = pipeline.verify(str(image_path))

    print("========== FINAL RESULT ==========\n")
    pprint(result, sort_dicts=False)


if __name__ == "__main__":
    main()