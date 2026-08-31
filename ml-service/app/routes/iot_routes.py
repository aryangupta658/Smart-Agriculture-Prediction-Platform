from fastapi import (
    APIRouter,
    Query,
)

from app.schemas.iot_schema import (
    IoTReadingInput,
)

from app.services.iot_service import (
    save_sensor_reading,
    get_latest_reading,
    get_sensor_history,
)


router = APIRouter(
    prefix="/iot",
    tags=["IoT Sensors"],
)


# =====================================================
# RECEIVE ESP32 DATA
# =====================================================

@router.post(
    "/readings"
)
def receive_sensor_reading(
    data: IoTReadingInput,
):

    reading = (
        save_sensor_reading(
            data
        )
    )


    return {
        "success": True,

        "message": (
            "Sensor reading received successfully."
        ),

        "data": reading,
    }


# =====================================================
# LATEST SENSOR DATA
# =====================================================

@router.get(
    "/latest"
)
def latest_sensor_reading():

    return (
        get_latest_reading()
    )


# =====================================================
# SENSOR HISTORY
# =====================================================

@router.get(
    "/history"
)
def sensor_reading_history(
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    )
):

    return (
        get_sensor_history(
            limit
        )
    )