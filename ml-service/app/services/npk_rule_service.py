import os

import pandas as pd


# =====================================================
# PATHS
# =====================================================

# Current file:
#
# Smart-Agriculture-Prediction-Platform/
# └── ml-service/
#     └── app/
#         └── services/
#             └── npk_rule_service.py

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# BASE_DIR:
#
# Smart-Agriculture-Prediction-Platform/ml-service


PROJECT_DIR = os.path.dirname(
    BASE_DIR
)

# PROJECT_DIR:
#
# Smart-Agriculture-Prediction-Platform


DATASET_PATH = os.path.join(
    PROJECT_DIR,
    "datasets",
    "Fertilizer Prediction.csv",
)


# =====================================================
# CHECK DATASET EXISTS
# =====================================================

if not os.path.exists(
    DATASET_PATH
):
    raise FileNotFoundError(
        f"Fertilizer dataset not found: {DATASET_PATH}"
    )


# =====================================================
# LOAD DATASET
# =====================================================

fertilizer_df = pd.read_csv(
    DATASET_PATH
)


# =====================================================
# CLEAN COLUMN NAMES
# =====================================================

# Example:
#
# " Soil Type "
#
# becomes:
#
# "Soil Type"

fertilizer_df.columns = (
    fertilizer_df.columns
    .astype(str)
    .str.strip()
)


# =====================================================
# REQUIRED COLUMNS
# =====================================================

REQUIRED_COLUMNS = [
    "Soil Type",
    "Nitrogen",
    "Phosphorus",
    "Potassium",
]


missing_columns = [
    column
    for column in REQUIRED_COLUMNS
    if column
    not in fertilizer_df.columns
]


if missing_columns:
    raise ValueError(
        "Fertilizer dataset is missing required columns: "
        + ", ".join(
            missing_columns
        )
    )


# =====================================================
# CLEAN SOIL TYPE
# =====================================================

fertilizer_df[
    "Soil Type"
] = (
    fertilizer_df[
        "Soil Type"
    ]
    .astype(str)
    .str.strip()
)


# =====================================================
# CONVERT NUTRIENTS TO NUMERIC
# =====================================================

NUTRIENT_COLUMNS = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
]


for column in NUTRIENT_COLUMNS:

    fertilizer_df[
        column
    ] = pd.to_numeric(
        fertilizer_df[
            column
        ],
        errors="coerce",
    )


# =====================================================
# VALID SOIL TYPES
# =====================================================

VALID_SOIL_TYPES = sorted(
    fertilizer_df[
        "Soil Type"
    ]
    .dropna()
    .unique()
    .tolist()
)


# =====================================================
# HELPER: FIND SOIL TYPE CASE-INSENSITIVELY
# =====================================================

def find_soil_type(
    soil_type: str
):
    """
    Match soil type without caring about capitalization.

    Example:

    alluvial
    Alluvial
    ALLUVIAL

    all match:
    Alluvial
    """

    requested = (
        str(
            soil_type
        )
        .strip()
        .lower()
    )


    for valid_soil in (
        VALID_SOIL_TYPES
    ):

        if (
            str(
                valid_soil
            )
            .strip()
            .lower()
            ==
            requested
        ):
            return valid_soil


    return None


# =====================================================
# ESTIMATE NPK
# =====================================================

def estimate_npk(
    soil_type: str
):
    """
    Estimate N, P and K dynamically from the
    fertilizer dataset.

    Method:

    1. User selects soil type.
    2. Filter all dataset rows having that soil type.
    3. Calculate median Nitrogen.
    4. Calculate median Phosphorus.
    5. Calculate median Potassium.
    6. Return those values.

    This is an estimate and NOT a laboratory soil test.
    """


    # =================================================
    # VALIDATE INPUT
    # =================================================

    if (
        soil_type is None
        or
        not str(
            soil_type
        ).strip()
    ):

        return {
            "error":
                "Soil type is required.",

            "valid_soil_types":
                VALID_SOIL_TYPES,
        }


    # =================================================
    # FIND ACTUAL DATASET SOIL TYPE
    # =================================================

    matched_soil_type = (
        find_soil_type(
            soil_type
        )
    )


    if (
        matched_soil_type
        is None
    ):

        return {
            "error":
                (
                    f"Unknown soil type: "
                    f"{soil_type}"
                ),

            "valid_soil_types":
                VALID_SOIL_TYPES,
        }


    # =================================================
    # FILTER DATASET BY SOIL TYPE
    # =================================================

    soil_data = (
        fertilizer_df[
            fertilizer_df[
                "Soil Type"
            ]
            ==
            matched_soil_type
        ]
        .copy()
    )


    # =================================================
    # SAFETY CHECK
    # =================================================

    if soil_data.empty:

        return {
            "error":
                (
                    "No dataset records were found "
                    f"for soil type: {matched_soil_type}"
                ),
        }


    # =================================================
    # REMOVE ROWS WHERE ALL NPK VALUES ARE MISSING
    # =================================================

    soil_data = (
        soil_data.dropna(
            subset=[
                "Nitrogen",
                "Phosphorus",
                "Potassium",
            ],
            how="all",
        )
    )


    if soil_data.empty:

        return {
            "error":
                (
                    "No valid nutrient records were "
                    f"found for {matched_soil_type}."
                ),
        }


    # =================================================
    # CALCULATE MEDIANS
    # =================================================

    nitrogen_median = (
        soil_data[
            "Nitrogen"
        ]
        .median()
    )


    phosphorus_median = (
        soil_data[
            "Phosphorus"
        ]
        .median()
    )


    potassium_median = (
        soil_data[
            "Potassium"
        ]
        .median()
    )


    # =================================================
    # CHECK RESULTS
    # =================================================

    if (
        pd.isna(
            nitrogen_median
        )
        or
        pd.isna(
            phosphorus_median
        )
        or
        pd.isna(
            potassium_median
        )
    ):

        return {
            "error":
                (
                    "Unable to calculate median "
                    f"NPK values for {matched_soil_type}."
                ),
        }


    # =================================================
    # COUNT VALID VALUES USED
    # =================================================

    nitrogen_records = int(
        soil_data[
            "Nitrogen"
        ]
        .notna()
        .sum()
    )


    phosphorus_records = int(
        soil_data[
            "Phosphorus"
        ]
        .notna()
        .sum()
    )


    potassium_records = int(
        soil_data[
            "Potassium"
        ]
        .notna()
        .sum()
    )


    total_soil_records = int(
        len(
            soil_data
        )
    )


    # =================================================
    # RESPONSE
    # =================================================

    return {
        "soil_type":
            matched_soil_type,


        # ---------------------------------------------
        # MEDIAN N
        # ---------------------------------------------

        "nitrogen":
            round(
                float(
                    nitrogen_median
                ),
                1,
            ),


        # ---------------------------------------------
        # MEDIAN P
        # ---------------------------------------------

        "phosphorus":
            round(
                float(
                    phosphorus_median
                ),
                1,
            ),


        # ---------------------------------------------
        # MEDIAN K
        # ---------------------------------------------

        "potassium":
            round(
                float(
                    potassium_median
                ),
                1,
            ),


        # ---------------------------------------------
        # INFORMATION
        # ---------------------------------------------

        "records_used":
            total_soil_records,


        "nutrient_records": {
            "nitrogen":
                nitrogen_records,

            "phosphorus":
                phosphorus_records,

            "potassium":
                potassium_records,
        },


        "method":
            "dynamic_dataset_median",


        "reason":
            (
                "The system filters the fertilizer "
                f"dataset for records where Soil Type is "
                f"'{matched_soil_type}' and dynamically "
                "calculates the median Nitrogen, "
                "Phosphorus, and Potassium values. "
                "Median is used because it is less "
                "sensitive to unusually high or low "
                "values than the arithmetic mean. "
                "These NPK values are estimates based "
                "on the project dataset and are not "
                "laboratory soil-test measurements."
            ),
    }