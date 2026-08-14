# CNN Image Classifier

A professional, production-ready web application for CNN-based image classification using **FastAPI** (Python) + **React 18** + **TypeScript** + **Tailwind CSS**.

## Features

 **Modern UI**
- Clean, professional dark/light mode design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Lucide React icons

 **Backend**
- FastAPI with automatic documentation
- TensorFlow/Keras model loading
- Image preprocessing and normalization
- CORS enabled for development/production
- Comprehensive error handling
- Health check and model info endpoints

 **Frontend**
- Drag & drop image upload
- Real-time image preview
- Loading animations
- Beautiful prediction results with confidence scores
- Class probability bar charts
- Connection status indicators
- Model status monitoring

## Project Structure

```
cnn-classifier/
├── backend/
│   ├── main.py                 
│   ├── config.py               
│   ├── requirements.txt         
│   ├── model/
│   │   └── your_model.h5       
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.tsx
│   │   │   ├── PredictionResult.tsx
│   │   │   └── Navbar.tsx
│   │   ├── lib/
│   │   │   └── api.ts         
│   │   ├── types/
│   │   │   └── index.ts        
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .gitignore
├── docker-compose.yml          
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ & npm/yarn
- Your trained CNN model (.h5 or .keras format)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Place your model:**
   - Copy your trained `.h5` or `.keras` model to `backend/model/your_model.h5`
   - Update `MODEL_PATH` in `backend/config.py` if needed

5. **Update configuration:**
   Edit `backend/config.py`:
   ```python
   MODEL_INPUT_SIZE = (224, 224)  # Change to your model's input size
   
   CLASS_NAMES = [
       "cat",
       "dog",
       "bird",
       # Add all your classes
   ]
   ```

6. **Run backend:**
   ```bash
   python main.py
   ```
   
   Backend will be available at `http://localhost:8000`
   API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory (new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will open at `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

## Configuration Guide

### Backend Configuration (`backend/config.py`)

```python
# Model settings
MODEL_PATH = "path/to/your/model.h5"
MODEL_INPUT_SIZE = (224, 224)  # Must match your model input

# Class names (update these!)
CLASS_NAMES = ["class_1", "class_2", "class_3"]

# Server settings
BACKEND_PORT = 8000
BACKEND_HOST = "0.0.0.0"

# CORS (update for production)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# File upload
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Normalization (ImageNet standard)
NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD = [0.229, 0.224, 0.225]
```

### Frontend Configuration

**Environment Variables** (`.env` or `.env.local`):
```
VITE_API_URL=http://localhost:8000
```

### Model Requirements

Your CNN model should:
- Accept image input of shape `(batch, height, width, 3)` (RGB)
- Output shape `(batch, num_classes)` with softmax activation
- Be saved as TensorFlow/Keras model (.h5 or .keras format)

Example model creation:
```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(224, 224, 3)),
    # ... your layers ...
    tf.keras.layers.Dense(num_classes, activation='softmax')
])

model.save('model.h5')
```

## API Endpoints

### Health & Info
- `GET /` - API status
- `GET /health` - Model health check
- `GET /info` - Model information

### Prediction
- `POST /predict` - Classify image
  - Input: multipart/form-data with `file` (image)
  - Output: JSON with predicted class, confidence, all probabilities

**Example Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@image.jpg"
```

**Example Response:**
```json
{
  "success": true,
  "predicted_class": "cat",
  "confidence": 95.32,
  "probabilities": {
    "cat": 95.32,
    "dog": 4.21,
    "bird": 0.47
  },
  "input_size": [224, 224]
}
```

## Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up

# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

## Troubleshooting

### Model not loading
- Verify model path in `config.py`
- Check if `.h5` file exists
- Ensure TensorFlow version compatibility

### CORS errors
- Update `ALLOWED_ORIGINS` in `config.py`
- Ensure `VITE_API_URL` matches backend URL

### Connection refused
- Backend not running? Start with `python main.py`
- Wrong port? Check `BACKEND_PORT` in config
- Firewall blocking? Allow localhost connections

### Slow predictions
- Optimize model size
- Use GPU if available (install `tensorflow-gpu`)
- Reduce image preprocessing steps

## Performance Optimization

**Backend:**
- Use GPU: `pip install tensorflow-gpu`
- Model quantization for faster inference
- Batch processing support

**Frontend:**
- Lazy load components
- Image compression before upload
- Caching API responses

## Production Deployment

1. **Backend:**
   - Use production ASGI server (Gunicorn + Uvicorn)
   - Set `ALLOWED_ORIGINS` to your domain
   - Use environment variables for sensitive config
   - Enable HTTPS

2. **Frontend:**
   - Run `npm run build`
   - Deploy dist/ folder to static hosting
   - Update `VITE_API_URL` for production API

**Docker Production:**
```bash
docker-compose -f docker-compose.yml up -d
```

## Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- TensorFlow/Keras - Deep learning
- Uvicorn - ASGI server
- Pillow - Image processing

**Frontend:**
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- Lucide React - Icons

## License

MIT

## Support

For issues or questions, check the project structure and ensure all configurations are properly set.

---

**Ready to use!** Just add your trained model to `backend/model/` and update the configuration. 
