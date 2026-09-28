from biomatric_model.biometric_pipeline import BiometricPipeline
from tkinter import Tk, filedialog


def select_image(title):
    root = Tk()
    root.withdraw()

    file_path = filedialog.askopenfilename(
        title=title,
        filetypes=[
            ("Image files", "*.jpg *.jpeg *.png *.webp"),
            ("All files", "*.*")
        ]
    )

    root.destroy()
    return file_path


def main():

    print("\n========================================")
    print("     AI BIOMETRIC VERIFICATION SYSTEM")
    print("========================================\n")

    # Select document image
    print("Select the document image...")
    document_image = select_image(
        "Select Document Image"
    )

    if not document_image:
        print("No document image selected.")
        return

    print("Document image selected.")

    # Select live image
    print("\nSelect the live image...")
    live_image = select_image(
        "Select Live Image"
    )

    if not live_image:
        print("No live image selected.")
        return

    print("Live image selected.")

    print("\nLoading biometric models...")

    pipeline = BiometricPipeline()

    print("Models loaded successfully.")
    print("\nRunning biometric verification...\n")

    result = pipeline.verify(
        document_image,
        live_image
    )

    print("========== VERIFICATION RESULT ==========\n")

    print(f"Face Detected       : {result['face_detected']}")
    print(f"Face Similarity     : {result['face_similarity']}")
    print(f"Face Match          : {result['match']}")

    print(f"\nLiveness            : {result['liveness_label']}")
    print(f"Liveness Confidence : {result['liveness_confidence']}")

    print(f"\nMorph Detection     : {result['morph_label']}")
    print(f"Morph Confidence    : {result['morph_confidence']}")

    print(f"\nDuplicate Identity  : {result['duplicate']}")
    print(f"Identity ID         : {result['duplicate_identity']}")
    print(f"Duplicate Similarity: {result['duplicate_similarity']}")

    print(f"\nFINAL STATUS        : {result['status']}")

    print("\n========================================\n")


if __name__ == "__main__":
    main()