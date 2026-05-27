from pydantic import BaseModel


class FertilizerInput(BaseModel):
    Temperature: float
    Humidity: float
    Soil_Moisture: float
    Soil_Type: str
    Crop_Type: str
    Nitrogen: float
    Potassium: float
    Phosphorus: float