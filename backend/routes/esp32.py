from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

from config import MAX_SENSOR_HISTORY


router = APIRouter(
    prefix="/esp32",
    tags=["ESP32"]
)


# ==========================================
# LATEST SENSOR DATA
# ==========================================

latest_sensor_data = {
    "water_level": 0,
    "flow_rate": 0,
    "infiltration_rate": 0,
    "timestamp": None
}


# ==========================================
# SENSOR DATA HISTORY
# ==========================================

sensor_history = []

active_test_context = {
    "test_id": None,
    "sample_name": None,
}


def set_test_context(test_id=None, sample_name=None):
    active_test_context["test_id"] = test_id
    active_test_context["sample_name"] = sample_name


# ==========================================
# ESP32 DATA MODEL
# ==========================================

class SensorData(BaseModel):

    water_level: float
    flow_rate: float
    infiltration_rate: float


# ==========================================
# COMMON DATA STORAGE FUNCTION
#
# Simulator and Real ESP32 both use this
# ==========================================

def store_sensor_data(
    water_level: float,
    flow_rate: float,
    infiltration_rate: float,
    sample_name=None,
    test_id=None,
):

    global latest_sensor_data
    global sensor_history


    current_time = datetime.now().isoformat()


    new_data = {
        "water_level": water_level,
        "flow_rate": flow_rate,
        "infiltration_rate": infiltration_rate,
        "sample_name": sample_name or active_test_context["sample_name"],
        "test_id": test_id or active_test_context["test_id"],
        "timestamp": current_time
    }


    # Update latest data

    latest_sensor_data = new_data


    # Add data to history

    sensor_history.append(new_data)


    # Keep only latest readings

    if len(sensor_history) > MAX_SENSOR_HISTORY:

        sensor_history.pop(0)


    return new_data


# ==========================================
# ESP32 SENDS SENSOR DATA HERE
# ==========================================

@router.post("/data")
def receive_sensor_data(data: SensorData):


    stored_data = store_sensor_data(

        water_level=data.water_level,

        flow_rate=data.flow_rate,

        infiltration_rate=data.infiltration_rate

    )


    return {
        "status": "success",

        "message": "Sensor data received",

        "data": stored_data
    }


# ==========================================
# GET LATEST SENSOR DATA
# ==========================================

@router.get("/latest")
def get_latest_sensor_data():

    return {
        "status": "success",

        "data": latest_sensor_data
    }


# ==========================================
# GET SENSOR HISTORY
# ==========================================

@router.get("/history")
def get_sensor_history():

    return {
        "status": "success",

        "data": sensor_history
    }


# ==========================================
# ESP32 CONNECTION STATUS
# ==========================================

@router.get("/status")
def esp32_status():

    if latest_sensor_data["timestamp"] is None:

        return {
            "connected": False,

            "message": "Waiting for ESP32"
        }


    return {
        "connected": True,

        "message": "ESP32 Connected",

        "last_update": latest_sensor_data[
            "timestamp"
        ]
    }