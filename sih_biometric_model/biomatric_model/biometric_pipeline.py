from .face.face_verification import FaceVerifier
from .liveness.liveness import LivenessDetector
from .morph.morph_detection import MorphDetector
from .face.embedding import FaceEmbedder
from .duplicate.duplicate_identity import DuplicateIdentityDetector

from pathlib import Path

class BiometricPipeline:

    def __init__(self):

        # Base folder = biomatric_model
        base_dir = Path(__file__).resolve().parent

        # Model paths
        liveness_model = (
            base_dir / "models" / "liveness_mobilenetv3.pth"
        )

        morph_model = (
            base_dir / "models" / "morph_efficientnet_b0_best.pth"
        )

        # Database path
        database_path = (
            base_dir / "database" / "identity_database.json"
        )

        # Initialize modules
        self.face_verifier = FaceVerifier(threshold=0.50)

        self.liveness_detector = LivenessDetector(
            str(liveness_model)
        )

        self.morph_detector = MorphDetector(
            str(morph_model)
        )

        self.embedder = FaceEmbedder()

        self.duplicate_detector = DuplicateIdentityDetector(
            database_path=str(database_path),
            threshold=0.50
        )

    def verify(self, document_image, live_image):

        # 1. Face verification
        face_result = self.face_verifier.verify(
            document_image,
            live_image
        )

        # 2. Liveness
        liveness_result = self.liveness_detector.predict(
            live_image
        )

        # 3. Morph detection
        morph_result = self.morph_detector.predict(
            document_image
        )

        # 4. Generate live-face embedding
        live_embedding = self.embedder.get_embedding(
            live_image
        )

        # 5. Duplicate identity check
        duplicate_result = self.duplicate_detector.check_duplicate(
            live_embedding
        )

        # 6. Final decision
        if not face_result["match"] or not liveness_result["liveness"]:
            status = "REJECTED"

        elif morph_result["morph"]:
            status = "REVIEW"

        elif duplicate_result["duplicate"]:
            status = "REVIEW"

        else:
            status = "APPROVED"

        # Final result
        return {
            "face_detected": True,

            "face_similarity": face_result["face_similarity"],
            "match": face_result["match"],

            "liveness": liveness_result["liveness"],
            "liveness_label": liveness_result["label"],
            "liveness_confidence": liveness_result["confidence"],

            "morph": morph_result["morph"],
            "morph_label": morph_result["label"],
            "morph_confidence": morph_result["confidence"],

            "duplicate": duplicate_result["duplicate"],
            "duplicate_identity": duplicate_result["identity_id"],
            "duplicate_similarity": duplicate_result["similarity"],

            "status": status
        }


    