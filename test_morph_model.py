import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

sys.path.insert(
    0,
    str(BASE_DIR / "sih_model")
)

from biomatric_model.morph.morph_detection import MorphDetector


MODEL_PATH = (
    BASE_DIR
    / "sih_model"
    / "biomatric_model"
    / "models"
    / "morph_efficientnet_b0_best.pth"
)

print("Loading morph model...")
print("Model:", MODEL_PATH)

detector = MorphDetector(str(MODEL_PATH))

print("MORPH MODEL LOADED SUCCESSFULLY")