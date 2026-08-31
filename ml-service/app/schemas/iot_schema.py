from typing import Optional

from pydantic import BaseModel


class IoTReadingInput(BaseModel):
    device_id: str

    temperature: Optional[float] = None

    humidity: Optional[float] = None

    soil_moisture: Optional[float] = None

    ph: Optional[float] = None