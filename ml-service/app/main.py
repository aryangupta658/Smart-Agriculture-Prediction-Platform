from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)


from app.routes.crop_routes import (
    router as crop_router,
)

from app.routes.fertilizer_routes import (
    router as fertilizer_router,
)

from app.routes.disease_routes import (
    router as disease_router,
)

from app.routes.iot_routes import (
    router as iot_router,
)

from app.routes.npk_routes import (
    router as npk_router,
)

from app.routes.weather_routes import (
    router as weather_router,
)


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title=(
        "Smart Agriculture "
        "Prediction Platform API"
    ),

    version="1.0.0",

    description=(
        "ML, deep learning, IoT and "
        "rule-based services for AgriSmart."
    ),
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# ROUTERS
# =====================================================

app.include_router(
    crop_router
)

app.include_router(
    fertilizer_router
)

app.include_router(
    disease_router
)

app.include_router(
    iot_router
)

app.include_router(
    npk_router
)

app.include_router(
    weather_router
)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": (
            "Smart Agriculture "
            "Prediction Platform API "
            "is running"
        )
    }