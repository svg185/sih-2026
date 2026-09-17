from pathlib import Path

from sih_model.biomatric_model.morph.morph_detection import MorphDetector


# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Trained morph detection model
MODEL_PATH = (
    BASE_DIR
    / "sih_model"
    / "biomatric_model"
    / "models"
    / "morph_efficientnet_b0_best.pth"
)


# Load model once when the service starts
morph_detector = MorphDetector(str(MODEL_PATH))


def detect_morph(image_path: str) -> dict:
    """
    Run face morph detection on an image.

    Returns:
        dict containing prediction label and confidence.
    """

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    result = morph_detector.predict(str(image_path))

    return {
        "morph_detected": result["morph"],
        "label": result["label"],
        "confidence": result["confidence"],
        "model": "EfficientNet-B0",
        "status": "MORPH_ANALYSIS_COMPLETE"
    }