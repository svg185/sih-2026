import cv2
import numpy as np

# Blank document
img = np.ones((900, 1400, 3), dtype=np.uint8) * 255

# Header
cv2.putText(
    img,
    "SAMPLE TRAVEL DOCUMENT",
    (80, 100),
    cv2.FONT_HERSHEY_SIMPLEX,
    1.5,
    (0, 0, 0),
    3
)

# Dummy fields
fields = [
    "DOCUMENT TYPE: PASSPORT",
    "SURNAME: SAMPLE",
    "GIVEN NAME: TEST USER",
    "DOCUMENT NO: X1234567",
    "NATIONALITY: IND",
    "DATE OF BIRTH: 01 JAN 2000",
    "DATE OF EXPIRY: 01 JAN 2030",
    "SEX: M",
]

y = 220

for field in fields:
    cv2.putText(
        img,
        field,
        (100, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.9,
        (0, 0, 0),
        2
    )
    y += 75

# Dummy MRZ-like lines
cv2.putText(
    img,
    "P<INDTESTUSER<<<<<<<<<<<<<<<<<<<<<<<<",
    (100, 790),
    cv2.FONT_HERSHEY_SIMPLEX,
    0.75,
    (0, 0, 0),
    2
)

cv2.putText(
    img,
    "X1234567<0IND0001011M3001017<<<<<<<<",
    (100, 840),
    cv2.FONT_HERSHEY_SIMPLEX,
    0.75,
    (0, 0, 0),
    2
)

cv2.imwrite(
    "sample_documents/sample_passport.jpg",
    img
)

print("Sample document created successfully!")