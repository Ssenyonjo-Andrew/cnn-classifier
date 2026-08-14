"""
FastAPI backend for CNN image classification
"""

import os
import io
import json
import logging
from contextlib import asynccontextmanager
from urllib import request, error as urllib_error

import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf

from config import (
    MODEL_PATH,
    MODEL_INPUT_SIZE,
    CLASS_NAMES,
    ALLOWED_ORIGINS,
    MAX_FILE_SIZE,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model variable
model = None


class ExplainRequest(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: dict[str, float]


def load_model():
    """Load the trained CNN model"""
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        
        logger.info(f"Loading model from {MODEL_PATH}...")
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully!")
        return model
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage app lifecycle - load model on startup
    """
    # Startup
    load_model()
    yield
    # Shutdown
    logger.info("Application shutting down...")


app = FastAPI(
    title="CNN Image Classifier",
    description="A professional API for CNN-based image classification",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for model prediction.
    
    Matches the training preprocessing:
    - Resize to 224x224
    - Divide by 255 (rescale to 0-1)
    - NO ImageNet normalization
    
    Args:
        image: PIL Image object
        
    Returns:
        Preprocessed numpy array ready for model prediction
    """
    # Resize to model input size
    image = image.resize(MODEL_INPUT_SIZE, Image.Resampling.LANCZOS)
    
    # Convert to RGB if necessary (in case of RGBA or grayscale)
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # Simple rescaling: divide by 255 (matches training)
    img_array = img_array / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    logger.info(f"Image preprocessed: shape={img_array.shape}, dtype={img_array.dtype}, min={img_array.min():.4f}, max={img_array.max():.4f}")
    
    return img_array


def get_fallback_explanation(predicted_class: str, confidence: float, probabilities: dict) -> str:
    """Create a concise fallback explanation when the AI service is unavailable."""
    top_class = next(iter(probabilities.items()))[0]
    if predicted_class == "Healthy":
        return (
            f"The model classifies this maize leaf as {predicted_class} with {confidence:.1f}% confidence. "
            f"The strongest evidence comes from the probability distribution, with {top_class} leading the prediction. "
            "No major disease pattern is indicated in the current analysis."
        )

    return (
        f"The model identifies this sample as {predicted_class} with {confidence:.1f}% confidence. "
        f"The strongest signals in the evidence set point toward {top_class}, which suggests a likely disease pattern. "
        "A field inspection and expert confirmation are recommended for a final decision."
    )


def generate_ai_explanation(predicted_class: str, confidence: float, probabilities: dict):
    """Generate a technical explanation using OpenRouter or return a safe fallback."""
    probability_summary = ", ".join(
        f"{name}: {value:.1f}%" for name, value in list(probabilities.items())[:4]
    )
    fallback = get_fallback_explanation(predicted_class, confidence, probabilities)

    if not OPENROUTER_API_KEY:
        return fallback, "fallback"

    prompt = (
        "You are a concise agricultural AI assistant. "
        "Write a short technical explanation for a maize leaf diagnosis. "
        f"Predicted class: {predicted_class}. Confidence: {confidence:.1f}%. "
        f"Probability breakdown: {probability_summary}. "
        "Keep the response to three short paragraphs, mention likely visual symptoms and practical field actions, and note that expert confirmation is helpful."
    )

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You help farmers and agronomists interpret maize disease predictions. Write clear and technical explanations.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 220,
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "MaizeGuard",
    }

    req = request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=30) as response:
            response_data = json.loads(response.read().decode("utf-8"))
            explanation = response_data["choices"][0]["message"]["content"].strip()
            return explanation, "openrouter"
    except (urllib_error.URLError, urllib_error.HTTPError, KeyError, ValueError) as exc:
        logger.warning(f"OpenRouter explanation generation failed: {exc}")
        return fallback, "fallback"


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API is running"""
    return {
        "message": "CNN Image Classifier API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    model_loaded = model is not None
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_path": MODEL_PATH,
        "input_size": MODEL_INPUT_SIZE,
    }


@app.post("/predict", tags=["Prediction"])
async def predict(file: UploadFile = File(...)):
    """
    Predict image class
    
    Args:
        file: Image file (jpg, png, gif, webp)
        
    Returns:
        JSON with predicted class, confidence, and all probabilities
    """
    # Validate model is loaded
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please check server logs.",
        )
    
    # Validate file is provided
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided",
        )
    
    # Validate file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in {"jpg", "jpeg", "png", "gif", "webp"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: jpg, jpeg, png, gif, webp. Got: {file_extension}",
        )
    
    try:
        # Read file
        contents = await file.read()
        
        # Validate file size
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024:.1f}MB",
            )
        
        # Open image
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Get results
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = CLASS_NAMES[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx]) * 100
        
        # Create probability map for all classes
        probabilities = {
            CLASS_NAMES[i]: float(predictions[0][i]) * 100
            for i in range(len(CLASS_NAMES))
        }
        
        # Sort by confidence
        sorted_probs = dict(
            sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
        )

        return {
            "success": True,
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "probabilities": {k: round(v, 2) for k, v in sorted_probs.items()},
            "input_size": MODEL_INPUT_SIZE,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing image: {str(e)}",
        )


@app.post("/explain", tags=["Prediction"])
async def explain(request: ExplainRequest):
    """Generate an AI explanation for a completed prediction."""
    explanation, explanation_source = generate_ai_explanation(
        request.predicted_class,
        request.confidence,
        request.probabilities,
    )

    return {
        "success": True,
        "explanation": explanation,
        "explanation_source": explanation_source,
    }


@app.get("/info", tags=["Info"])
async def model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded",
        )
    
    return {
        "model_loaded": True,
        "input_size": MODEL_INPUT_SIZE,
        "class_names": CLASS_NAMES,
        "num_classes": len(CLASS_NAMES),
        "model_path": MODEL_PATH,
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
