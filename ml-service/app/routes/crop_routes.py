from fastapi import APIRouter
from app.schemas.crop_schema import CropInput
from app.services.crop_service import predict_crop

router = APIRouter(
    prefix="/crop",
    tags=["Crop Recommendation"]
)


@router.post("/predict")
def crop_prediction(data: CropInput):
    return predict_crop(data)