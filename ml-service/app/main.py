from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.crop_routes import router as crop_router
from app.routes.fertilizer_routes import router as fertilizer_router
from app.routes.disease_routes import router as disease_router
from app.routes.iot_routes import router as iot_router
from app.routes.npk_routes import router as npk_router
from app.routes.weather_routes import router as weather_router


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(
    title="Smart Agriculture Prediction Platform API",
    version="1.0.0",
    description=(
        "API for crop recommendation, fertilizer recommendation, "
        "plant disease detection, IoT sensor monitoring, "
        "NPK estimation and historical rainfall analysis."
    ),
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    # Local development
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    # Allow Vercel production / preview domains
    allow_origin_regex=r"https://.*\.vercel\.app",

    # You are not using browser cookies for these APIs.
    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# ROUTERS
# =====================================================

app.include_router(crop_router)

app.include_router(fertilizer_router)

app.include_router(disease_router)

app.include_router(iot_router)

app.include_router(npk_router)

app.include_router(weather_router)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "Smart Agriculture Prediction Platform API is running"
    }