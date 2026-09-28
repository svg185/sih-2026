from pathlib import Path
from sih_model.biomatric_model.morph.morph_detection import MorphDetector


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "sih_model"
    / "biomatric_model"
    / "models"
    / "morph_efficientnet_b0_best.pth"
)

TEST_IMAGES = [
    BASE_DIR / "test_data" / "DSC_7446.JPG",
    BASE_DIR / "test_data" / "genuine_2.jpg",
]


print("Loading trained morph model...")
detector = MorphDetector(str(MODEL_PATH))

print("\n===== MORPH MODEL TEST =====")

for image_path in TEST_IMAGES:

    print(f"\nTesting: {image_path.name}")

    if not image_path.exists():
        print("ERROR: Image not found")
        continue

    result = detector.predict(str(image_path))

    print("Prediction :", result["label"].upper())
    print("Is Morph   :", result["morph"])
    print("Confidence :", result["confidence"])

print("\n============================")