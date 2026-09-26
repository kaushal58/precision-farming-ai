from fastapi import APIRouter
from pydantic import BaseModel
from services.ml_inference import predict_irrigation

router = APIRouter()


class IrrigationInput(BaseModel):
    soil_moisture: float = 45
    temperature: float = 28
    humidity: float = 60
    rainfall: float = 0
    crop_type: str = "wheat"


@router.post("/predict")
def irrigation_predict(data: IrrigationInput):
    return predict_irrigation(data.model_dump())
