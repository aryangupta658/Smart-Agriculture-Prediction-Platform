import os
import pickle
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "models")

with open(os.path.join(MODEL_DIR, "crop_model.pkl"), "rb") as f:
    crop_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "crop_scaler.pkl"), "rb") as f:
    crop_scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, "crop_label_encoder.pkl"), "rb") as f:
    crop_label_encoder = pickle.load(f)


def predict_crop(data):
    input_df = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])

    input_scaled = crop_scaler.transform(input_df)

    prediction = crop_model.predict(input_scaled)

    crop_name = crop_label_encoder.inverse_transform(prediction)[0]

    return {
        "recommended_crop": crop_name
    }