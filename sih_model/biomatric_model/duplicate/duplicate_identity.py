import json
import numpy as np
from pathlib import Path


class DuplicateIdentityDetector:
    def __init__(self, database_path="identity_database.json", threshold=0.50):
        self.database_path = Path(database_path)
        self.threshold = threshold

        if self.database_path.exists():
            with open(self.database_path, "r") as f:
                self.database = json.load(f)
        else:
            self.database = {}

    def cosine_similarity(self, embedding1, embedding2):
        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)

        similarity = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )

        return float(similarity)

    def check_duplicate(self, embedding):
        best_identity = None
        best_similarity = -1.0

        for identity_id, stored_data in self.database.items():
            stored_embedding = stored_data["embedding"]

            similarity = self.cosine_similarity(
                embedding,
                stored_embedding
            )

            if similarity > best_similarity:
                best_similarity = similarity
                best_identity = identity_id

        if best_similarity >= self.threshold:
            return {
                "duplicate": True,
                "identity_id": best_identity,
                "similarity": round(best_similarity, 4)
            }

        return {
            "duplicate": False,
            "identity_id": None,
            "similarity": round(best_similarity, 4)
        }

    def add_identity(self, identity_id, embedding):
        self.database[identity_id] = {
            "embedding": np.array(embedding).tolist()
        }

        with open(self.database_path, "w") as f:
            json.dump(self.database, f, indent=2)

        return {
            "success": True,
            "identity_id": identity_id
        }