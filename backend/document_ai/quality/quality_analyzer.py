import cv2
import numpy as np


class DocumentQualityAnalyzer:
    """
    Basic document image quality assessment.

    Checks:
    - Blur
    - Brightness
    - Contrast
    - Resolution
    """

    def analyze(self, image_path: str) -> dict:
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Unable to read document image.")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        height, width = gray.shape

        # Blur detection using Laplacian variance
        blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())

        # Average brightness
        brightness = float(np.mean(gray))

        # Contrast
        contrast = float(np.std(gray))

        # Resolution score
        pixels = width * height

        # Individual checks
        blur_ok = blur_score >= 80
        brightness_ok = 50 <= brightness <= 210
        contrast_ok = contrast >= 25
        resolution_ok = width >= 600 and height >= 400

        # Quality score
        scores = [
            1.0 if blur_ok else 0.0,
            1.0 if brightness_ok else 0.0,
            1.0 if contrast_ok else 0.0,
            1.0 if resolution_ok else 0.0,
        ]

        quality_score = round((sum(scores) / len(scores)) * 100, 2)

        if quality_score >= 75:
            quality = "GOOD"
        elif quality_score >= 50:
            quality = "MEDIUM"
        else:
            quality = "POOR"

        return {
            "quality_score": quality_score,
            "quality": quality,
            "width": width,
            "height": height,
            "blur_score": round(blur_score, 2),
            "brightness": round(brightness, 2),
            "contrast": round(contrast, 2),
            "resolution_pixels": pixels,
            "checks": {
                "blur_ok": blur_ok,
                "brightness_ok": brightness_ok,
                "contrast_ok": contrast_ok,
                "resolution_ok": resolution_ok,
            },
        }