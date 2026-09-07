import os


# True = Software simulator
# False = Real ESP32 hardware

SIMULATION_MODE = os.getenv("SIMULATION_MODE", "true").lower() == "true"


# Sensor data history limit

MAX_SENSOR_HISTORY = int(os.getenv("MAX_SENSOR_HISTORY", "50"))


# Simulation interval

SIMULATION_INTERVAL = float(os.getenv("SIMULATION_INTERVAL", "2"))

PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = [
	origin.strip()
	for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
	if origin.strip()
]