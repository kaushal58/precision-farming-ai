"""
AI Crop Guardian — ML Microservice
Disease detection (CNN), Pest detection (YOLO), Irrigation prediction
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import disease, pest, irrigation
from services.ml_inference import load_disease_model_at_startup

app = FastAPI(
    title="AI Crop Guardian — ML Service",
    description="Precision farming AI inference APIs",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(disease.router,    prefix="/api/v1/disease",    tags=["Disease"])
app.include_router(pest.router,       prefix="/api/v1/pest",       tags=["Pest"])
app.include_router(irrigation.router, prefix="/api/v1/irrigation", tags=["Irrigation"])


@app.on_event("startup")
def startup_event():
    """Load and warm up models once at startup — never per request."""
    load_disease_model_at_startup()


@app.get("/health")
def health():
    from services.ml_inference import _disease_model
    return {
        "status":       "ok",
        "service":      "ai-crop-guardian-ml",
        "model_loaded": _disease_model is not None,
    }
