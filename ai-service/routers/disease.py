import asyncio
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from services.ml_inference import predict_disease

router = APIRouter()
_executor = ThreadPoolExecutor(max_workers=2)


@router.post("/detect")
async def detect_disease(
    file: UploadFile = File(...),
    crop: str = Form(default="auto")
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")
    # Run CPU-heavy inference in thread pool — keeps FastAPI event loop free
    loop = asyncio.get_event_loop()
    func = partial(predict_disease, contents, crop=crop)
    result = await loop.run_in_executor(_executor, func)
    return result
