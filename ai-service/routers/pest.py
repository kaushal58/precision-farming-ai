from fastapi import APIRouter, File, UploadFile, HTTPException
from services.ml_inference import predict_pest

router = APIRouter()


@router.post("/detect")
async def detect_pest(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    contents = await file.read()
    result = predict_pest(contents)
    return result
