from pathlib import Path

import cv2
import insightface

from sih_model.biomatric_model.morph.morph_detection import MorphDetector


BASE_DIR = Path(__file__).resolve().parent

IMAGE_PATH = (
    BASE_DIR
    / "test_data"
    / "DSC_7446.JPG"
)

MODEL_PATH = (
    BASE_DIR
    / "sih_model"
    / "biomatric_model"
    / "models"
    / "morph_efficientnet_b0_best.pth"
)

CROP_PATH = (
    BASE_DIR
    / "test_data"
    / "face_crop.jpg"
)


print("Loading InsightFace...")

face_app = insightface.app.FaceAnalysis(
    name="buffalo_l"
)

face_app.prepare(
    ctx_id=-1,
    det_size=(640, 640)
)

print("InsightFace loaded.")

image = cv2.imread(str(IMAGE_PATH))

if image is None:
    raise ValueError(f"Could not read image: {IMAGE_PATH}")

faces = face_app.get(image)

if len(faces) == 0:
    raise ValueError("No face detected.")

if len(faces) > 1:
    raise ValueError("Multiple faces detected.")

face = faces[0]

x1, y1, x2, y2 = face.bbox.astype(int)

# Keep coordinates inside image boundaries
h, w = image.shape[:2]

x1 = max(0, x1)
y1 = max(0, y1)
x2 = min(w, x2)
y2 = min(h, y2)

face_crop = image[y1:y2, x1:x2]

if face_crop.size == 0:
    raise ValueError("Face crop is empty.")

cv2.imwrite(str(CROP_PATH), face_crop)

print("Face crop saved:", CROP_PATH)

print("\nLoading trained morph model...")

morph_detector = MorphDetector(
    str(MODEL_PATH)
)

print("Running morph detection on FACE CROP...")

result = morph_detector.predict(
    str(CROP_PATH)
)

print("\n===== FACE CROP MORPH RESULT =====")
print("Prediction :", result["label"].upper())
print("Is Morph   :", result["morph"])
print("Confidence :", result["confidence"])
print("==================================")
