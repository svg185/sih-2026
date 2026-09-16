import cv2


def load_document(image_path: str):
    """Load document image from disk and ensure 3-channel BGR format."""

    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)

    if image is None:
        raise FileNotFoundError(
            f"Could not read document image: {image_path}"
        )

    # Ensure image has 3 color channels
    if len(image.shape) != 3 or image.shape[2] != 3:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    return image


def resize_document(image, max_width: int = 1800):
    """Resize large images while preserving aspect ratio."""

    height, width = image.shape[:2]

    if width <= max_width:
        return image

    scale = max_width / width

    new_width = int(width * scale)
    new_height = int(height * scale)

    return cv2.resize(
        image,
        (new_width, new_height),
        interpolation=cv2.INTER_AREA,
    )


def enhance_document(image):
    """
    OCR preprocessing for identity documents.
    Keeps output as 3-channel BGR for PaddleOCR compatibility.
    """

    image = resize_document(image)

    # Convert to grayscale for enhancement
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Noise reduction
    denoised = cv2.fastNlMeansDenoising(
        gray,
        None,
        10,
        7,
        21,
    )

    # Contrast enhancement
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8),
    )

    enhanced_gray = clahe.apply(denoised)

    # Convert back to 3-channel BGR
    enhanced = cv2.cvtColor(
        enhanced_gray,
        cv2.COLOR_GRAY2BGR
    )

    return enhanced