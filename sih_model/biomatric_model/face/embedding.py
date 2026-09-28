import insightface
import cv2
import numpy as np


class FaceEmbedder:
    def __init__(self):
        self.app = insightface.app.FaceAnalysis(
            name="buffalo_l"
        )

        self.app.prepare(
            ctx_id=0,
            det_size=(640, 640)
        )

    def get_embedding(self, image_path):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError(f"Could not read image: {image_path}")

        faces = self.app.get(image)

        if len(faces) == 0:
            raise ValueError("No face detected.")

        if len(faces) > 1:
            raise ValueError("Multiple faces detected.")

        return faces[0].embedding

    def cosine_similarity(self, embedding1, embedding2):
        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)

        similarity = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) *
            np.linalg.norm(embedding2)
        )

        return float(similarity)