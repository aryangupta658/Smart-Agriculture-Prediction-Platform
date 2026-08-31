from fastapi import APIRouter

from app.services.npk_rule_service import (
    estimate_npk,
)


router = APIRouter(
    prefix="/npk",
    tags=["NPK Estimation"],
)


@router.get(
    "/estimate/{soil_type}"
)
def get_npk_estimate(
    soil_type: str
):
    return estimate_npk(
        soil_type
    )