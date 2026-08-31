import os
import pickle

import numpy as np
import pandas as pd

from app.services.crop_rotation_service import (
    get_crop_rotation,
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
# LOAD MODEL
# =====================================================

with open(
    os.path.join(
        MODEL_DIR,
        "crop_model.pkl",
    ),
    "rb",
) as f:
    crop_model = pickle.load(f)


with open(
    os.path.join(
        MODEL_DIR,
        "crop_scaler.pkl",
    ),
    "rb",
) as f:
    crop_scaler = pickle.load(f)


with open(
    os.path.join(
        MODEL_DIR,
        "crop_label_encoder.pkl",
    ),
    "rb",
) as f:
    crop_label_encoder = pickle.load(f)


# =====================================================
# SETTINGS
# =====================================================

# Maximum number of crop recommendations.
MAX_RECOMMENDATIONS = 3


# Ignore crops whose Random Forest score is below 1%.
#
# Example:
#
# Rice         90%
# Jute         10%
# Pomegranate   0%
#
# Pomegranate will not be included.
MIN_MATCH_SCORE = 0.01


# =====================================================
# BUILD ONE CROP RESULT
# =====================================================

def build_crop_result(
    crop_name,
    probability,
):
    """
    Build the response for one recommended crop.

    Crop prediction comes from Random Forest.

    Rotation guidance comes from the separate
    rule-based crop_rotation_service.
    """

    rotation = get_crop_rotation(
        crop_name
    )


    return {
        # ---------------------------------------------
        # CROP
        # ---------------------------------------------

        "crop": crop_name,


        # ---------------------------------------------
        # MODEL SCORE
        #
        # Kept in API for ranking/debugging.
        #
        # Frontend does not need to display this.
        # ---------------------------------------------

        "match_score": round(
            float(probability) * 100,
            2,
        ),


        # ---------------------------------------------
        # GENERAL ROTATION EXPLANATION
        # ---------------------------------------------

        "rotation_summary": rotation[
            "summary"
        ],


        # ---------------------------------------------
        # INDIVIDUAL ROTATION CROPS
        #
        # Example:
        #
        # [
        #   {
        #       "crop": "chickpea",
        #       "reason": "..."
        #   },
        #   ...
        # ]
        # ---------------------------------------------

        "rotation": rotation[
            "next_crops"
        ],
    }


# =====================================================
# PREDICT CROP
# =====================================================

def predict_crop(data):
    """
    Predict the most suitable crops.

    Returns:

    - best_match
    - up to two alternative crops
    - detailed crop rotation guidance

    Random Forest is responsible only for crop ranking.

    Crop rotation guidance is rule-based.
    """

    # =================================================
    # CREATE INPUT DATAFRAME
    # =================================================

    input_df = pd.DataFrame([
        {
            "N": data.N,

            "P": data.P,

            "K": data.K,

            "temperature":
                data.temperature,

            "humidity":
                data.humidity,

            "ph":
                data.ph,

            "rainfall":
                data.rainfall,
        }
    ])


    # =================================================
    # APPLY SAME SCALER USED DURING TRAINING
    # =================================================

    input_scaled = (
        crop_scaler.transform(
            input_df
        )
    )


    # =================================================
    # GET RANDOM FOREST CLASS SCORES
    # =================================================

    probabilities = (
        crop_model.predict_proba(
            input_scaled
        )[0]
    )


    # =================================================
    # SORT HIGHEST → LOWEST
    # =================================================

    sorted_indices = (
        np.argsort(
            probabilities
        )[::-1]
    )


    recommendations = []


    # =================================================
    # COLLECT TOP MEANINGFUL CROPS
    # =================================================

    for index in sorted_indices:

        probability = float(
            probabilities[index]
        )


        # ---------------------------------------------
        # Ignore scores below threshold
        # ---------------------------------------------

        if (
            probability
            <
            MIN_MATCH_SCORE
        ):
            continue


        # ---------------------------------------------
        # Random Forest class
        #
        # Example:
        #
        # 12
        # ---------------------------------------------

        encoded_class = (
            crop_model.classes_[
                index
            ]
        )


        # ---------------------------------------------
        # Convert encoded class to actual crop name
        #
        # Example:
        #
        # 12 → maize
        # ---------------------------------------------

        crop_name = (
            crop_label_encoder
            .inverse_transform(
                [
                    int(
                        encoded_class
                    )
                ]
            )[0]
        )


        # ---------------------------------------------
        # Build crop + rotation result
        # ---------------------------------------------

        recommendation = (
            build_crop_result(
                crop_name,
                probability,
            )
        )


        recommendations.append(
            recommendation
        )


        # ---------------------------------------------
        # Stop after 3 crops
        # ---------------------------------------------

        if (
            len(recommendations)
            >=
            MAX_RECOMMENDATIONS
        ):
            break


    # =================================================
    # SAFETY FALLBACK
    #
    # This should rarely happen.
    #
    # Example:
    # Every predict_proba score somehow fell below
    # MIN_MATCH_SCORE.
    #
    # In that case use normal model.predict().
    # =================================================

    if not recommendations:

        prediction = (
            crop_model.predict(
                input_scaled
            )
        )


        crop_name = (
            crop_label_encoder
            .inverse_transform(
                prediction
            )[0]
        )


        rotation = (
            get_crop_rotation(
                crop_name
            )
        )


        recommendations.append({
            "crop": crop_name,

            "match_score": None,

            "rotation_summary":
                rotation["summary"],

            "rotation":
                rotation["next_crops"],
        })


    # =================================================
    # BEST MATCH
    # =================================================

    best_match = (
        recommendations[0]
    )


    # =================================================
    # ALTERNATIVES
    # =================================================

    alternatives = (
        recommendations[1:]
    )


    # =================================================
    # FINAL RESPONSE
    # =================================================

    return {
        # ---------------------------------------------
        # OLD FIELD
        #
        # Keep this so older frontend code
        # does not break.
        # ---------------------------------------------

        "recommended_crop":
            best_match["crop"],


        # ---------------------------------------------
        # BEST CROP
        # ---------------------------------------------

        "best_match":
            best_match,


        # ---------------------------------------------
        # OTHER MEANINGFUL CROPS
        # ---------------------------------------------

        "alternatives":
            alternatives,


        # ---------------------------------------------
        # ALL RETURNED RECOMMENDATIONS
        #
        # Useful for future dashboard / analytics.
        # ---------------------------------------------

        "recommendations":
            recommendations,


        # ---------------------------------------------
        # EXPLANATION
        # ---------------------------------------------

        "message": (
            "Crop recommendations are ranked using "
            "the trained Random Forest model. "
            "Crop rotation and soil-benefit guidance "
            "is generated separately using rule-based "
            "agronomic guidance."
        ),
    }