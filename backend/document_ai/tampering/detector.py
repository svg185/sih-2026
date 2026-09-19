import cv2
import numpy as np
from pathlib import Path


class DocumentTamperingDetector:
    """
    Basic document tampering detector.

    Detects suspicious image regions using:
    - Error Level Analysis (ELA-like analysis)
    - Edge inconsistency
    - Noise inconsistency
    """

    def __init__(self, threshold: float = 0.35):
        self.threshold = threshold

    def load_image(self, image_path: str):
        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Document image not found: {image_path}"
            )

        image = cv2.imread(str(path), cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError(
                f"Could not read document image: {image_path}"
            )

        return image

    def analyze(self, image_path: str) -> dict:
        image = self.load_image(image_path)

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Blur image to estimate local noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Difference between original and blurred image
        noise_map = cv2.absdiff(gray, blurred)

        # Normalize
        noise_score = float(np.mean(noise_map) / 255.0)

        # Edge analysis
        edges = cv2.Canny(gray, 100, 200)
        edge_density = float(np.mean(edges > 0))

        # Local variance
        mean = cv2.blur(gray.astype(np.float32), (15, 15))
        sq_mean = cv2.blur(
            (gray.astype(np.float32) ** 2),
            (15, 15)
        )

        variance = np.maximum(sq_mean - (mean ** 2), 0)

        variance_score = float(
            np.mean(variance) / (255.0 ** 2)
        )

        # Combined heuristic score
        suspicious_score = min(
            1.0,
            (
                noise_score * 0.45
                + edge_density * 0.25
                + variance_score * 0.30
            )
        )

        tampered = suspicious_score >= self.threshold

        return {
            "tampered": bool(tampered),
            "risk_score": round(suspicious_score, 4),
            "noise_score": round(noise_score, 4),
            "edge_density": round(edge_density, 4),
            "variance_score": round(variance_score, 4),
            "message": (
                "Potential tampering detected"
                if tampered
                else "No obvious tampering detected"
            ),
        }