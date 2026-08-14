# Quick Start Guide - CNN Image Classifier

## ⚡ 5-Minute Setup

### Step 1: Add Your Model
```bash
# Place your trained model file here:
backend/model/your_model.h5
```

### Step 2: Update Config (Backend)
Edit `backend/config.py`:
```python
# Update these with YOUR model info:
MODEL_INPUT_SIZE = (224, 224)  # Change to match your model

CLASS_NAMES = [
    "class_1",
    "class_2", 
    "class_3",
]  # Update with YOUR class names
```

### Step 3: Start Backend
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py

# macOS/Linux
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
✅ Backend running at `http://localhost:8000`

### Step 4: Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend opens at `http://localhost:5173`

## 🎯 Usage

1. Upload an image by dragging & dropping or clicking the upload zone
2. Image automatically sends to backend for classification
3. View results with confidence scores and class probabilities
4. Upload another image or refresh

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Model not found | Ensure `backend/model/your_model.h5` exists |
| Connection refused | Backend must be running on port 8000 |
| Wrong predictions | Update `MODEL_INPUT_SIZE` and `CLASS_NAMES` in config |
| CORS error | Check `ALLOWED_ORIGINS` in `backend/config.py` |

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/predict` | Classify image |
| GET | `/health` | Check model status |
| GET | `/info` | Get model info |
| GET | `/docs` | Swagger documentation |

## 🐳 Docker Option

```bash
docker-compose up
```
Runs both backend and frontend in containers.

## 📁 File Structure Quick Reference

```
backend/
├── config.py       ← UPDATE: MODEL_INPUT_SIZE, CLASS_NAMES
├── main.py         ← FastAPI server
├── requirements.txt
└── model/
    └── your_model.h5  ← PLACE YOUR MODEL HERE

frontend/
├── src/
│   ├── App.tsx     ← Main component
│   └── lib/api.ts  ← API client
└── package.json
```

## 🚀 Next Steps

- Update `CLASS_NAMES` with your actual classes
- Adjust `MODEL_INPUT_SIZE` to match your model
- Test with sample images
- Deploy using Docker or your hosting platform
- (Optional) Enable GPU: `pip install tensorflow-gpu`

## 💡 Tips

- Ensure images are clear and well-lit
- Supported formats: JPG, PNG, GIF, WebP
- Max file size: 5MB
- Model preprocessing is automatic (resize + normalize)

---
Everything is ready to use! Just add your model and start classifying. 🎉
