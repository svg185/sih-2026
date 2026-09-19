from backend.document_ai.quality.quality_analyzer import DocumentQualityAnalyzer


image_path = "sample_documents/sample_passport.jpg"

analyzer = DocumentQualityAnalyzer()

result = analyzer.analyze(image_path)

print("\n===== DOCUMENT QUALITY RESULT =====")

for key, value in result.items():
    print(f"{key}: {value}")