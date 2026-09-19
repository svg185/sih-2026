from pathlib import Path

from backend.document_ai.face.detector import FaceDetector


def main():
    image_path = (
        Path(__file__).resolve().parents[3]
        / "sample_documents"
        / "sample_passport.jpg"
    )

    print("\n==============================")
    print("       FACE DETECTION TEST")
    print("==============================\n")

    detector = FaceDetector()
    result = detector.detect(str(image_path))

    for key, value in result.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()