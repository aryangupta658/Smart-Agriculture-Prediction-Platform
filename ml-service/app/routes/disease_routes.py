from fastapi import APIRouter, UploadFile, File
from app.services.disease_service import predict_disease_from_image

router = APIRouter(
    prefix="/disease",
    tags=["Disease Detection"]
)


@router.post("/predict")
async def disease_prediction(file: UploadFile = File(...)):
    file_bytes = await file.read()

    result = predict_disease_from_image(file_bytes)

    return result