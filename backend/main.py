from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.esp32 import router as esp32_router
from routes.tests import router as test_router
from routes.samples import router as samples_router
from config import CORS_ORIGINS

app = FastAPI(
    title="IoT Permeable Pavement API",
    description="Backend API for ESP32 Permeable Pavement Monitoring System",
    version="1.0.0"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ROUTES

app.include_router(esp32_router)
app.include_router(test_router)
app.include_router(samples_router)

@app.get("/")
def home():

    return {
        "message": "IoT Permeable Pavement Backend Running"
    }


@app.get("/health")
def health_check():

    return {
        "status": "online",
        "esp32": "waiting"
    }