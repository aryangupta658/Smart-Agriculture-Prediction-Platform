import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "models")

disease_model = tf.keras.models.load_model(
    os.path.join(MODEL_DIR, "best_disease_model.keras")
)

with open(os.path.join(MODEL_DIR, "disease_class_names.json"), "r") as f:
    disease_class_names = json.load(f)

IMG_SIZE = 224


def predict_disease_from_image(file_bytes):
    image = Image.open(BytesIO(file_bytes)).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))

    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)

    prediction = disease_model.predict(image_array)

    predicted_index = int(np.argmax(prediction[0]))
    confidence = float(np.max(prediction[0]) * 100)
    predicted_class = disease_class_names[predicted_index]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2)
    }