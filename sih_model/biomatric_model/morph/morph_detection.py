import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image


class MorphDetector:
    def __init__(self, model_path):
        # Use GPU if available, otherwise CPU
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        # Create the same EfficientNet-B0 architecture
        self.model = models.efficientnet_b0(weights=None)

        # Our model has 2 classes:
        # 0 = genuine
        # 1 = morph
        self.model.classifier[1] = nn.Linear(
            self.model.classifier[1].in_features,
            2
        )

        # Load trained weights
        self.model.load_state_dict(
            torch.load(model_path, map_location=self.device)
        )

        self.model.to(self.device)
        self.model.eval()

        # Same preprocessing used during testing
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                [0.485, 0.456, 0.406],
                [0.229, 0.224, 0.225]
            )
        ])

        self.classes = ["genuine", "morph"]

    def predict(self, image_path):
        # Load image
        image = Image.open(image_path).convert("RGB")

        # Preprocess
        image = self.transform(image).unsqueeze(0)
        image = image.to(self.device)

        # Prediction
        with torch.no_grad():
            output = self.model(image)
            probabilities = torch.softmax(output, dim=1)

        predicted_class = torch.argmax(
            probabilities, dim=1
        ).item()

        confidence = probabilities[0][predicted_class].item()

        label = self.classes[predicted_class]

        return {
            "morph": label == "morph",
            "label": label,
            "confidence": round(confidence, 4)
        }