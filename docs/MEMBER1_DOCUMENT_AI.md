# Member 1 — Document AI, OCR, MRZ & Document Verification

## 1. Objective

The objective of Member 1 is to develop the Document AI module for the
AI-Based Fake Identity and Document Screening System.

The module processes identity documents and performs:

- OCR text extraction
- Document type detection
- Document quality analysis
- MRZ parsing and validation
- Tampering detection
- Face detection
- Risk analysis
- Final verification decision

---

## 2. Document Verification Workflow

```text
Document Upload
       |
       v
Image / Document Preprocessing
       |
       v
OCR Text Extraction
       |
       +--------------------+
       |                    |
       v                    v
Document Type           Quality Analysis
Detection
       |
       v
MRZ Extraction
       |
       v
MRZ Parsing & Validation
       |
       +--------------------+
       |                    |
       v                    v
Tampering Detection     Face Detection
       |
       v
Final Risk Engine
       |
       v
Verification Decision
3. System Architecture
The Member 1 module follows a modular architecture where every document verification task is handled by a separate component.
backend/
│
└── document_ai/
    │
    ├── api/
    │   └── api.py
    │
    ├── ocr/
    │   └── engine.py
    │
    ├── quality/
    │   └── quality_analyzer.py
    │
    ├── validation/
    │   └── document_type_detector.py
    │
    ├── mrz/
    │   ├── parser.py
    │   └── validator.py
    │
    ├── tampering/
    │   └── detector.py
    │
    ├── face/
    │   └── detector.py
    │
    ├── risk_engine/
    │   └── risk_engine.py
    │
    └── pipeline/
        └── verification_pipeline.py
The main verification pipeline connects all these modules.
4. OCR Module
4.1 Purpose
The OCR module extracts text from identity and travel documents.
OCR stands for Optical Character Recognition.
The extracted information is used by the document type detector and MRZ verification system.
4.2 Technology Used
Python
PaddleOCR
OpenCV
4.3 OCR Processing Flow
Input Document
      |
      v
Image Resize
      |
      v
Grayscale Conversion
      |
      v
Noise Reduction
      |
      v
CLAHE Enhancement
      |
      v
Enhanced Image
      |
      v
PaddleOCR
      |
      v
Extracted Text + Confidence
4.4 Image Preprocessing
Before OCR, the document image is enhanced.
The preprocessing includes:
Image resizing
Grayscale conversion
Noise reduction
Contrast enhancement
Conversion back to a 3-channel image
OCR processing
CLAHE (Contrast Limited Adaptive Histogram Equalization) is used to improve local image contrast.
4.5 OCR Output
The OCR engine returns:
Extracted text
Individual text detections
Confidence scores
Detection count
Average confidence
Example:
{
    "engine": "PaddleOCR",
    "average_confidence": 0.9564,
    "detection_count": 31
}
5. Document Quality Analysis
5.1 Purpose
The Quality Analyzer checks whether the uploaded document image is suitable for further processing.
Poor image quality can reduce OCR and verification accuracy.
5.2 Quality Parameters
The system checks:
Blur
Brightness
Contrast
Resolution
5.3 Quality Processing
Document Image
      |
      +----> Blur Analysis
      |
      +----> Brightness Analysis
      |
      +----> Contrast Analysis
      |
      +----> Resolution Analysis
      |
      v
Quality Score
5.4 Example Output
{
    "quality_score": 75,
    "quality": "GOOD",
    "blur_score": 3474.25,
    "brightness": 207.17,
    "contrast": 48.1,
    "resolution_pixels": 199655
}
The quality result is also passed to the Risk Engine.
6. Document Type Detection
6.1 Purpose
The Document Type Detector identifies the type of uploaded identity document using OCR-extracted text.
6.2 Supported Document Types
The current detector supports:
Passport
ID Card
Driving License
6.3 Detection Process
OCR Text
   |
   v
Keyword / Pattern Analysis
   |
   v
Document Type Scores
   |
   v
Highest Confidence Type
6.4 Example
{
    "document_type": "PASSPORT",
    "confidence": 0.9,
    "scores": {
        "PASSPORT": 90,
        "ID_CARD": 0,
        "DRIVING_LICENSE": 0
    }
}
The detected document type determines which validation rules should be applied.
7. MRZ Module
7.1 What is MRZ?
MRZ stands for Machine Readable Zone.
It is the machine-readable section present on passports and other machine-readable travel documents.
The MRZ contains structured information such as:
Document type
Country code
Document number
Name
Date of birth
Sex
Date of expiry
Personal number
Check digits
8. MRZ Parser
8.1 Purpose
The MRZ parser extracts and structures MRZ information from OCR text.
8.2 Parsing Process
OCR Text
   |
   v
MRZ Candidate Detection
   |
   v
MRZ Line Extraction
   |
   v
MRZ Structure Parsing
   |
   v
Structured MRZ Data
8.3 Parser Validation
The parser checks whether the detected MRZ has the expected structure.
For example, a TD3 passport MRZ is expected to contain two MRZ lines with the required length and format.
If the structure is invalid, the parser returns an error instead of producing unreliable passport information.
9. MRZ Validator
9.1 Purpose
The MRZ Validator performs detailed validation of the parsed MRZ.
9.2 Validation Checks
The validator checks:
Passport number check digit
Date of birth check digit
Date of expiry check digit
Personal number check digit
Composite check digit
MRZ line structure
Required MRZ length
9.3 Example Valid Result
{
    "valid": true,
    "passport_number_check": true,
    "date_of_birth_check": true,
    "date_of_expiry_check": true,
    "personal_number_check": true,
    "composite_check": true
}
9.4 Invalid MRZ Handling
If the MRZ validation fails, the system does not automatically classify the document as fake.
Instead, the failed validation becomes a risk signal for the Risk Engine.
Example:
{
    "valid": false,
    "error": "TD3 passport requires exactly 2 MRZ lines"
}
10. Document Tampering Detection
10.1 Purpose
The Tampering Detector performs image-level analysis to identify possible signs of document manipulation.
10.2 Indicators
The module analyzes:
Image noise
Edge density
Image variance
Other image-level characteristics
10.3 Processing Flow
Document Image
      |
      v
Image Analysis
      |
      +----> Noise Score
      |
      +----> Edge Density
      |
      +----> Variance
      |
      v
Tampering Risk
      |
      v
Tampering Result
10.4 Example Result
{
    "tampered": false,
    "risk_score": 0.0439,
    "noise_score": 0.0317,
    "edge_density": 0.093,
    "variance_score": 0.0212,
    "message": "No obvious tampering detected"
}
10.5 Important Limitation
The current tampering module is a screening mechanism.
It should not be treated as forensic proof of document authenticity.
A document may require manual or advanced forensic verification even if the current detector reports no obvious tampering.
11. Face Detection
11.1 Purpose
The Face Detection module detects a face present on the identity document.
11.2 Technology
Python
OpenCV
Haar Cascade Classifier
11.3 Processing Flow
Document Image
      |
      v
Image Conversion
      |
      v
Face Detection
      |
      v
Face Count
      |
      v
Bounding Box Coordinates
11.4 Example Result
{
    "face_detected": true,
    "face_count": 1,
    "faces": [
        {
            "x": 32,
            "y": 144,
            "width": 105,
            "height": 105
        }
    ]
}
The face detection result is passed to the final Risk Engine.
12. Document Verification Pipeline
The complete verification pipeline is implemented in:
backend/document_ai/pipeline/verification_pipeline.py
The pipeline combines all Member 1 modules.
12.1 Pipeline Steps
Step 1 — OCR
The uploaded image is processed using PaddleOCR.
Step 2 — Quality Analysis
The image quality is checked.
Step 3 — Document Type Detection
The OCR text is used to identify the document type.
Step 4 — MRZ Parsing
If MRZ information is present, it is parsed.
Step 5 — MRZ Validation
The MRZ check digits and structure are validated.
Step 6 — Tampering Detection
The image is analyzed for possible manipulation.
Step 7 — Face Detection
The system detects faces in the document.
Step 8 — Risk Analysis
All results are passed to the Risk Engine.
Step 9 — Final Decision
The Risk Engine produces the final screening status.
13. Risk Engine
13.1 Purpose
The Risk Engine combines the results of all verification modules into a single risk-based decision.
13.2 Input Signals
The Risk Engine uses:
OCR confidence
Document type confidence
Document quality
MRZ validation
Tampering result
Face detection
13.3 Risk Scoring
The current scoring logic increases the risk score when important verification checks fail.
Examples of risk signals:
Low OCR confidence
Unknown document type
Poor document quality
MRZ validation failure
Possible tampering
No face detected
The final score is normalized between:
0.0 → 1.0
14. Risk Decision Levels
Risk Score
Status
0.00 – 0.29
VERIFIED
0.30 – 0.59
REQUIRES_REVIEW
0.60 – 1.00
SUSPICIOUS
VERIFIED
The available verification signals do not indicate a significant problem.
REQUIRES_REVIEW
One or more important checks failed and the document should receive additional verification.
SUSPICIOUS
Multiple or significant risk indicators are present.
The status is a screening decision and is not by itself a legal or forensic determination of fraud.
15. Risk Engine Output
Example:
{
    "status": "REQUIRES_REVIEW",
    "risk_score": 0.35,
    "risk_percentage": 35,
    "warnings": [
        "Passport MRZ validation failed"
    ],
    "checks": {
        "ocr_ok": true,
        "document_type_ok": true,
        "quality_ok": true,
        "mrz_ok": false,
        "tampering_ok": true,
        "face_detected": true
    }
}
16. FastAPI Integration
The complete Document AI pipeline is exposed through FastAPI.
API Endpoint
POST /verify
16.1 Input
The API accepts a document through multipart file upload.
16.2 Processing
File Upload
     |
     v
File Type Detection
     |
     v
Document Conversion
     |
     v
Image Preparation
     |
     v
Verification Pipeline
     |
     v
JSON Response
17. Supported File Formats
The API supports common identity-document and office-document formats.
Image Formats
.jpg
.jpeg
.jfif
.png
.webp
.bmp
.tif
.tiff
PDF
.pdf
Word / Text Documents
.doc
.docx
.odt
.rtf
.txt
Spreadsheet Formats
.xls
.xlsx
.csv
.ods
Presentation Formats
.ppt
.pptx
.odp
Some formats require external conversion software such as LibreOffice before they can be processed by the image-based verification pipeline.
18. PDF Processing
PDF files are converted into images before being passed to the verification pipeline.
The system uses:
PyMuPDF
for PDF processing.
Processing flow:
PDF
 |
 v
First Page Extraction
 |
 v
PNG Image
 |
 v
Document Verification Pipeline
19. Office Document Processing
Office/OpenDocument files can be converted to PDF using LibreOffice.
Processing flow:
DOC / DOCX / XLS / XLSX / PPT / PPTX
                  |
                  v
             LibreOffice
                  |
                  v
                 PDF
                  |
                  v
              PNG Image
                  |
                  v
        Verification Pipeline
20. API Response Structure
The /verify endpoint returns a structured JSON response.
General structure:
{
    "success": true,
    "filename": "document.jpg",
    "file_type": ".jpg",
    "verification": {
        "document": {},
        "ocr": {},
        "quality": {},
        "document_type": {},
        "mrz": {},
        "tampering": {},
        "face": {},
        "risk": {}
    }
}
This structure allows the frontend and other team members to consume each verification result independently.
21. Testing
The Member 1 modules were tested individually and through the complete FastAPI pipeline.
Testing includes:
OCR testing
MRZ parser testing
MRZ validator testing
Quality analyzer testing
Document type detection testing
Tampering detection testing
Face detection testing
Complete pipeline testing
FastAPI API testing
JFIF upload testing
22. Sample End-to-End Test
A test passport image was uploaded through the FastAPI Swagger interface.
The API returned:
HTTP Status: 200
Observed results:
OCR Confidence       : 95.64%
OCR Detection Count  : 31

Document Type        : PASSPORT
Type Confidence      : 90%

Quality Score        : 75
Quality              : GOOD

MRZ Validation       : FAILED

Tampering Detected   : NO

Face Detected        : YES
Face Count           : 1

Final Status         : REQUIRES_REVIEW
Risk Score           : 0.35
Risk Percentage      : 35%
The test confirms that the complete verification pipeline can process a document and combine multiple verification signals into a final risk-based result.
23. Example API Result
{
    "success": true,
    "filename": "image.jpeg.jfif",
    "file_type": ".jfif",
    "verification": {
        "document": {
            "status": "processed"
        },
        "ocr": {
            "engine": "PaddleOCR",
            "average_confidence": 0.9564,
            "detection_count": 31
        },
        "quality": {
            "quality_score": 75,
            "quality": "GOOD"
        },
        "document_type": {
            "document_type": "PASSPORT",
            "confidence": 0.9
        },
        "mrz": {
            "parsed": {
                "valid": false,
                "error": "Invalid TD3 MRZ length"
            },
            "validation": {
                "valid": false,
                "error": "TD3 passport requires exactly 2 MRZ lines"
            }
        },
        "tampering": {
            "tampered": false,
            "risk_score": 0.0439
        },
        "face": {
            "face_detected": true,
            "face_count": 1
        },
        "risk": {
            "status": "REQUIRES_REVIEW",
            "risk_score": 0.35,
            "risk_percentage": 35
        }
    }
}
24. Error Handling
The API handles:
Missing files
Unsupported extensions
Invalid documents
Empty PDFs
PDF conversion errors
Office conversion errors
Missing LibreOffice installation
OCR processing errors
Pipeline processing errors
The API returns appropriate HTTP error responses when processing fails.
25. Technologies Used
Technology
Purpose
Python
Core development
FastAPI
REST API
PaddleOCR
OCR
OpenCV
Image processing and face detection
PyMuPDF
PDF processing
LibreOffice
Office document conversion
Git
Version control
GitHub
Code repository
26. Project Directory
backend/
└── document_ai/
    │
    ├── api/
    │   └── api.py
    │
    ├── ocr/
    │   ├── engine.py
    │   └── test_ocr.py
    │
    ├── quality/
    │   ├── quality_analyzer.py
    │   └── test_quality.py
    │
    ├── validation/
    │   ├── document_type_detector.py
    │   └── test_document_type.py
    │
    ├── mrz/
    │   ├── parser.py
    │   ├── validator.py
    │   └── tests
    │
    ├── tampering/
    │   ├── detector.py
    │   └── test_tampering.py
    │
    ├── face/
    │   ├── detector.py
    │   └── test_face.py
    │
    ├── risk_engine/
    │   └── risk_engine.py
    │
    └── pipeline/
        ├── verification_pipeline.py
        └── test_pipeline.py
27. Security and Reliability Considerations
The system is designed as an AI-assisted screening system.
Important considerations:
OCR output can contain errors.
MRZ validation can fail because of poor image quality or OCR errors.
Face detection does not establish identity by itself.
Image-based tampering detection cannot guarantee document authenticity.
Risk scores should be interpreted as screening signals.
Important cases should receive manual or additional verification.
28. Current Limitations
The current implementation has the following limitations:
OCR accuracy depends on document image quality.
MRZ extraction may fail when MRZ characters are unclear.
Face detection only detects the presence of a face; it does not perform identity matching.
Tampering detection is based on image-level indicators.
The current system does not perform cryptographic document authentication.
The current Risk Engine uses rule-based scoring.
Office document processing requires compatible conversion software.
29. Future Improvements
Possible future improvements include:
Advanced MRZ OCR preprocessing
Deep-learning based document forgery detection
Face verification against document portrait
Passport chip/NFC verification
Digital signature verification
Advanced document layout analysis
Government database verification where legally permitted
Better document-specific validation rules
Machine-learning based risk scoring
Multi-page document processing
Improved anti-spoofing detection
30. Member 1 Deliverables
The following components have been implemented:
[x] OCR Engine
[x] OCR Image Preprocessing
[x] Document Quality Analyzer
[x] Document Type Detector
[x] MRZ Parser
[x] MRZ Validator
[x] Tampering Detector
[x] Face Detector
[x] Document Verification Pipeline
[x] Risk Engine
[x] FastAPI Verification API
[x] PDF Processing
[x] Common Image Format Processing
[x] JFIF Processing
[x] Office Document Conversion Handler
[x] End-to-End Testing
[x] GitHub Integration
[x] API Testing through Swagger
31. Final Status
MEMBER 1 — DOCUMENT AI
Status: COMPLETED
The Document AI module successfully combines OCR, document classification, quality analysis, MRZ validation, tampering screening, face detection, and risk analysis into a single verification pipeline.
The module is integrated with FastAPI and provides a structured JSON response that can be consumed by the project's frontend and other backend modules.