import cv2
from pathlib import Path


class FaceDetector:
    """Detect faces in identity documents/images."""

    def __init__(self):
        cascade_path = (
            Path(cv2.data.haarcascades)
            / "haarcascade_frontalface_default.xml"
        )

        self.face_cascade = cv2.CascadeClassifier(
            str(cascade_path)
        )

        if self.face_cascade.empty():
            raise RuntimeError("Could not load face detection model")

    def detect(self, image_path: str) -> dict:
        image = cv2.imread(str(image_path))

        if image is None:
            raise FileNotFoundError(
                f"Could not read image: {image_path}"
            )

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
        )

        face_boxes = []

        for (x, y, w, h) in faces:
            face_boxes.append({
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
            })

        return {
            "face_detected": len(face_boxes) > 0,
            "face_count": len(face_boxes),
            "faces": face_boxes,
        }