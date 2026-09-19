from backend.document_ai.validation.document_type_detector import DocumentTypeDetector


ocr_text = """
PASSPORT
REPUBLIC OF INDIA
SURNAME
SAMMAL
NATIONALITY
INDIAN
P<INDIA
"""


detector = DocumentTypeDetector()

result = detector.detect(ocr_text)

print("\n===== DOCUMENT TYPE RESULT =====")

for key, value in result.items():
    print(f"{key}: {value}")