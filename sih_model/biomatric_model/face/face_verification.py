from .embedding import FaceEmbedder


class FaceVerifier:
    def __init__(self, threshold=0.50):
        self.embedder = FaceEmbedder()
        self.threshold = threshold

    def verify(self, document_image_path, live_image_path):
        # Get embeddings
        document_embedding = self.embedder.get_embedding(
            document_image_path
        )

        live_embedding = self.embedder.get_embedding(
            live_image_path
        )

        # Calculate cosine similarity
        similarity = self.embedder.cosine_similarity(
            document_embedding,
            live_embedding
        )

        match = similarity >= self.threshold

        return {
            "face_similarity": round(float(similarity), 4),
            "match": match
        }