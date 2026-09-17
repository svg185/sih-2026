import cv2
import insightface


IMAGE_PATH = r"D:\sih\national-identity-security\test_data\DSC_7446.JPG"

print("Loading InsightFace...")

app = insightface.app.FaceAnalysis(
    name="buffalo_l"
)

app.prepare(
    ctx_id=-1,
    det_size=(640, 640)
)

print("InsightFace loaded successfully.")

image = cv2.imread(IMAGE_PATH)

if image is None:
    raise ValueError(f"Could not read image: {IMAGE_PATH}")

faces = app.get(image)

print("\n===== FACE DETECTION RESULT =====")
print("Faces detected:", len(faces))

for i, face in enumerate(faces, start=1):
    print(f"\nFace {i}")
    print("Bounding box:", face.bbox)
    print("Embedding size:", len(face.embedding))

print("================================")
