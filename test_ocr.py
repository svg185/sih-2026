from backend.document_ai.ocr.engine import DocumentOCREngine

from pathlib import Path

IMAGE_PATH = str(
    Path(__file__).resolve().parent
    / "sample_documents"
    / "sample_passport.jpg"
)

def main():
    print("\n==============================")
    print("     DOCUMENT AI OCR TEST")
    print("==============================\n")

    print("[1/2] Loading OCR engine...")

    engine = DocumentOCREngine()

    print("[2/2] Processing document...\n")

    result = engine.extract(IMAGE_PATH)

    print("Engine:", result["engine"])
    print("Detection Count:", result["detection_count"])
    print("Average Confidence:", result["average_confidence"])

    print("\n========== EXTRACTED TEXT ==========\n")
    print(result["text"])

    print("\n========== DETECTIONS ==========\n")

    for item in result["detections"]:
        print(f"Text       : {item['text']}")
        print(f"Confidence : {item['confidence']}")
        print(f"Bounding Box: {item['bbox']}")
        print("-" * 50)


if __name__ == "__main__":
    main()