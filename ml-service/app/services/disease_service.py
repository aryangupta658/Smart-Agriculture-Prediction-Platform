import os
import json
import numpy as np
import tensorflow as tf

from PIL import Image
from io import BytesIO

from app.services.disease_guide_service import (
    get_disease_guide,
)


# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
)


# =====================================================
# LOAD DISEASE MODEL
# =====================================================

disease_model = tf.keras.models.load_model(
    os.path.join(
        MODEL_DIR,
        "best_disease_model.keras",
    )
)


# =====================================================
# LOAD CLASS NAMES
# =====================================================

with open(
    os.path.join(
        MODEL_DIR,
        "disease_class_names.json",
    ),
    "r",
) as f:
    disease_class_names = json.load(f)


# =====================================================
# IMAGE SIZE
# =====================================================

IMG_SIZE = 224


# =====================================================
# PREDICT DISEASE
# =====================================================

def predict_disease_from_image(file_bytes):
    """
    Predict plant disease from uploaded image bytes.

    Returns:
    - predicted disease class
    - model confidence
    - treatment guidance
    - prevention guidance
    """

    # -------------------------------------------------
    # Read image
    # -------------------------------------------------

    image = Image.open(
        BytesIO(file_bytes)
    ).convert("RGB")


    # -------------------------------------------------
    # Resize image
    #
    # Keep exactly the same size used during training.
    # -------------------------------------------------

    image = image.resize(
        (
            IMG_SIZE,
            IMG_SIZE,
        )
    )


    # -------------------------------------------------
    # Convert PIL image to NumPy
    # -------------------------------------------------

    image_array = np.array(
        image
    )


    # IMPORTANT:
    #
    # Your existing working service did not divide
    # pixels by 255.0, so this updated version does
    # not change that preprocessing.
    #
    # Keep preprocessing exactly consistent with
    # how your model was trained.
    # -------------------------------------------------


    # Add batch dimension:
    #
    # (224, 224, 3)
    #
    # becomes
    #
    # (1, 224, 224, 3)

    image_array = np.expand_dims(
        image_array,
        axis=0,
    )


    # -------------------------------------------------
    # MODEL PREDICTION
    # -------------------------------------------------

    prediction = disease_model.predict(
        image_array,
        verbose=0,
    )


    # -------------------------------------------------
    # CLASS INDEX
    # -------------------------------------------------

    predicted_index = int(
        np.argmax(
            prediction[0]
        )
    )


    # -------------------------------------------------
    # CONFIDENCE
    # -------------------------------------------------

    confidence = float(
        np.max(
            prediction[0]
        )
        * 100
    )


    # -------------------------------------------------
    # CLASS NAME
    # -------------------------------------------------

    predicted_class = (
        disease_class_names[
            predicted_index
        ]
    )


    # -------------------------------------------------
    # TREATMENT + PREVENTION
    #
    # These come from the separate rule-based
    # disease guide service.
    # -------------------------------------------------

    guide = get_disease_guide(
        predicted_class
    )


    treatment = guide.get(
        "treatment",
        (
            "Specific treatment information "
            "is not available for this condition."
        ),
    )


    prevention = guide.get(
        "prevention",
        (
            "Maintain good crop sanitation, "
            "proper irrigation and regular "
            "plant monitoring."
        ),
    )


    # -------------------------------------------------
    # FRONTEND FRIENDLY NAME
    #
    # Example:
    #
    # Tomato___Early_blight
    #
    # becomes:
    #
    # Tomato Early blight
    #
    # We still return predicted_class separately
    # so your current frontend/API does not break.
    # -------------------------------------------------

    display_name = (
        predicted_class
        .replace("___", " ")
        .replace("_", " ")
        .strip()
    )


    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "predicted_class": predicted_class,

        "display_name": display_name,

        "confidence": round(
            confidence,
            2,
        ),

        "treatment": treatment,

        "prevention": prevention,
    }