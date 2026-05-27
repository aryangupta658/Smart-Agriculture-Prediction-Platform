from fastapi import APIRouter
from app.schemas.fertilizer_schema import FertilizerInput
from app.services.fertilizer_service import predict_fertilizer

router = APIRouter(
    prefix="/fertilizer",
    tags=["Fertilizer Recommendation"]
)


@router.post("/predict")
def fertilizer_prediction(data: FertilizerInput):
    return predict_fertilizer(data)