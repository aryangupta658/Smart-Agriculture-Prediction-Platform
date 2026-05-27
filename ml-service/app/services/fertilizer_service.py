import os
import pickle
import pandas as pd

from app.services.biodegradable_service import get_biodegradable_alternative

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "models")

with open(os.path.join(MODEL_DIR, "fertilizer_model.pkl"), "rb") as f:
    fertilizer_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "fertilizer_scaler.pkl"), "rb") as f:
    fertilizer_scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, "soil_encoder.pkl"), "rb") as f:
    soil_encoder = pickle.load(f)

with open(os.path.join(MODEL_DIR, "crop_encoder.pkl"), "rb") as f:
    crop_encoder = pickle.load(f)

with open(os.path.join(MODEL_DIR, "fertilizer_encoder.pkl"), "rb") as f:
    fertilizer_encoder = pickle.load(f)


def predict_fertilizer(data):
    if data.Soil_Type not in soil_encoder.classes_:
        return {
            "error": f"Invalid Soil Type: {data.Soil_Type}",
            "valid_soil_types": soil_encoder.classes_.tolist()
        }

    if data.Crop_Type not in crop_encoder.classes_:
        return {
            "error": f"Invalid Crop Type: {data.Crop_Type}",
            "valid_crop_types": crop_encoder.classes_.tolist()
        }

    soil_encoded = soil_encoder.transform([data.Soil_Type])[0]
    crop_encoded = crop_encoder.transform([data.Crop_Type])[0]

    input_df = pd.DataFrame([{
        "Temperature": data.Temperature,
        "Humidity": data.Humidity,
        "Soil Moisture": data.Soil_Moisture,
        "Soil Type": soil_encoded,
        "Crop Type": crop_encoded,
        "Nitrogen": data.Nitrogen,
        "Potassium": data.Potassium,
        "Phosphorus": data.Phosphorus
    }])

    input_scaled = fertilizer_scaler.transform(input_df)
    prediction = fertilizer_model.predict(input_scaled)
    fertilizer_name = fertilizer_encoder.inverse_transform(prediction)[0]

    biodegradable = get_biodegradable_alternative(fertilizer_name)

    return {
        "recommended_fertilizer": fertilizer_name,
        "biodegradable_alternative": biodegradable["alternative"],
        "reason": biodegradable["reason"]
    }