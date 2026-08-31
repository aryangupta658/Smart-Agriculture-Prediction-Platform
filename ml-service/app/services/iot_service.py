from collections import deque
from datetime import datetime, timezone


# =====================================================
# STORAGE
# =====================================================
#
# This is in-memory storage for your prototype.
#
# Maximum readings:
# 500
#
# At 30 seconds/read:
# about 4 hours of readings.
#
# Later PostgreSQL can replace this.
# =====================================================

MAX_HISTORY = 500


sensor_history = deque(
    maxlen=MAX_HISTORY
)


latest_reading = None


# =====================================================
# SAVE SENSOR READING
# =====================================================

def save_sensor_reading(data):
    global latest_reading


    reading = {
        "device_id":
            data.device_id,

        "temperature":
            data.temperature,

        "humidity":
            data.humidity,

        "soil_moisture":
            data.soil_moisture,

        "ph":
            data.ph,

        "received_at":
            datetime.now(
                timezone.utc
            ).isoformat(),
    }


    latest_reading = reading


    sensor_history.append(
        reading
    )


    return reading


# =====================================================
# LATEST READING
# =====================================================

def get_latest_reading():

    if latest_reading is None:

        return {
            "available": False,

            "message": (
                "No sensor reading has been "
                "received yet."
            ),
        }


    return {
        "available": True,

        **latest_reading,
    }


# =====================================================
# HISTORY
# =====================================================

def get_sensor_history(
    limit=100,
):

    try:
        limit = int(limit)

    except (
        TypeError,
        ValueError,
    ):
        limit = 100


    limit = max(
        1,
        min(
            limit,
            MAX_HISTORY,
        ),
    )


    readings = list(
        sensor_history
    )[-limit:]


    return {
        "available":
            len(readings) > 0,

        "count":
            len(readings),

        "readings":
            readings,
    }