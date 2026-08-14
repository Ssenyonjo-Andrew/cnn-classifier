"""
Configuration file for CNN model and application settings
"""

import os
from pathlib import Path

# Model settings
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "maizeguard_final.h5")
MODEL_INPUT_SIZE = (224, 224)  # Change this to match your model input size (e.g., (256, 256) for ResNet)

# Class names - UPDATE THESE WITH YOUR MODEL'S CLASSES
CLASS_NAMES = [
    "Common Rust",
    "Gray Leaf Spot",
    "Healthy",
    "Northern Leaf Blight",
]

# OpenRouter AI settings
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")  # Set in environment variables
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

# Server settings
BACKEND_PORT = 8000
BACKEND_HOST = "0.0.0.0"

# CORS settings (update for production)
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# File upload settings
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}

# Model preprocessing settings
NORMALIZE_MEAN = [0.485, 0.456, 0.406]  # ImageNet normalization (standard)
NORMALIZE_STD = [0.229, 0.224, 0.225]   # ImageNet normalization (standard)
