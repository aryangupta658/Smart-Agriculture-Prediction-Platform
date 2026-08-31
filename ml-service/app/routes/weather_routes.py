from fastapi import (
    APIRouter,
    HTTPException,
    Query,
)

from app.services.weather_service import (
    find_indian_location,
    get_historical_rainfall,
)


router = APIRouter(
    prefix="/weather",
    tags=["Weather"],
)


# =====================================================
# SEARCH LOCATION
# =====================================================

@router.get(
    "/locations"
)
async def search_locations(
    city: str = Query(
        ...,
        min_length=2,
    ),
):

    results = (
        await find_indian_location(
            city=city,
        )
    )


    if not results:

        raise HTTPException(
            status_code=404,
            detail=(
                "No matching Indian "
                "location found."
            ),
        )


    return {
        "available": True,

        "locations":
            results,
    }


# =====================================================
# HISTORICAL RAINFALL
# =====================================================

@router.get(
    "/rainfall/history"
)
async def rainfall_history(
    city: str = Query(
        ...,
        min_length=2,
    ),

    state: str = Query(
        ...,
        min_length=2,
    ),

    days: int = Query(
        default=30,
    ),
):

    location = (
        await find_indian_location(
            city=city,
            state=state,
        )
    )


    if not location:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Could not find "
                f"{city}, {state}, India."
            ),
        )


    rainfall = (
        await get_historical_rainfall(
            latitude=
                location[
                    "latitude"
                ],

            longitude=
                location[
                    "longitude"
                ],

            days=days,
        )
    )


    return {
        "available": True,

        "location":
            location,

        **rainfall,
    }