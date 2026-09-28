# AI-Based Biometric Verification Module

## Overview

This module is the biometric verification component of the SIH project:

**AI-Based Fake Identity & Document Screening System**

The module verifies a person's identity using facial biometrics and performs additional security checks.

It contains four main biometric components:

1. Face Verification
2. Liveness Detection
3. Face Morphing / Manipulation Detection
4. Duplicate Identity Detection

---

## Biometric Pipeline

The complete biometric verification flow is:

Document Photo + Live Photo
        ↓
Face Detection & Alignment
        ↓
Face Embedding
        ↓
Face Similarity / Verification
        ↓
Liveness Detection
        ↓
Morph / Face Manipulation Detection
        ↓
Duplicate Identity Detection
        ↓
Final Decision

The system produces a final status:

- APPROVED
- REVIEW
- REJECTED

---

## Technologies Used

### Face Verification

**InsightFace**

InsightFace is used to detect faces and generate 512-dimensional face embeddings.

The embeddings are compared using cosine similarity.

### Liveness Detection

**MobileNetV3-Large**

A pretrained MobileNetV3-Large model was fine-tuned for binary classification:

- Real
- Fake

The model is stored as:

`biomatric_model/models/liveness_mobilenetv3.pth`

### Morph Detection

**EfficientNet-B0**

EfficientNet-B0 is used to classify a face image as:

- Genuine
- Morph

The model is stored as:

`biomatric_model/models/morph_efficientnet_b0_best.pth`

### Duplicate Identity Detection

Face embeddings are compared against stored identity embeddings using cosine similarity.

The current prototype database is:

`biomatric_model/database/identity_database.json`

---

## Project Structure

```text
sih_model/
│
├── app.py
├── README.md
├── requirements.txt
│
└── biomatric_model/
    ├── __init__.py
    ├── biometric_pipeline.py
    │
    ├── database/
    │   └── identity_database.json
    │
    ├── duplicate/
    │   ├── __init__.py
    │   └── duplicate_identity.py
    │
    ├── face/
    │   ├── __init__.py
    │   ├── embedding.py
    │   └── face_verification.py
    │
    ├── liveness/
    │   ├── __init__.py
    │   └── liveness.py
    │
    ├── models/
    │   ├── liveness_mobilenetv3.pth
    │   └── morph_efficientnet_b0_best.pth
    │
    └── morph/
        ├── __init__.py
        └── morph_detection.py