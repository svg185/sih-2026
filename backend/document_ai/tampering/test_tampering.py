from pathlib import Path

from backend.document_ai.tampering.detector import (
    DocumentTamperingDetector
)


def main():
    image_path = (
        Path(__file__).resolve().parents[3]
        / "sample_documents"
        / "sample_passport.jpg"
    )

    detector = DocumentTamperingDetector()

    result = detector.analyze(str(image_path))

    print("\n===============================")
    print("     TAMPERING DETECTION TEST")
    print("===============================\n")

    for key, value in result.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()