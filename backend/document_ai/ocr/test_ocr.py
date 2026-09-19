from pathlib import Path

from backend.document_ai.ocr.engine import DocumentOCREngine


def main():
    image_path = (
        Path(__file__).resolve().parents[3]
        / "sample_documents"
        / "sample_passport.jpg"
    )

    print("\n===============================")
    print("       DOCUMENT AI OCR TEST")
    print("===============================\n")

    print("[1/2] Loading OCR engine...")

    engine = DocumentOCREngine()

    print("[2/2] Running OCR...\n")

    result = engine.extract(str(image_path))

    print("OCR RESULT:")
    print(result)


if __name__ == "__main__":
    main()