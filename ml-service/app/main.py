from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.crop_routes import router as crop_router
from app.routes.fertilizer_routes import router as fertilizer_router
from app.routes.disease_routes import router as disease_router

app = FastAPI(
    title="Smart Agriculture Prediction Platform API",
    description="API for crop recommendation, fertilizer recommendation, biodegradable alternatives, and plant disease detection",
    version="1.0.0"
)

# CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop_router)
app.include_router(fertilizer_router)
app.include_router(disease_router)


@app.get("/")
def home():
    return {
        "message": "Smart Agriculture Prediction Platform API is running"
    }