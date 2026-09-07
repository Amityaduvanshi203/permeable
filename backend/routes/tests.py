from fastapi import APIRouter
import asyncio
import json
import random
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from pydantic import BaseModel, Field

from config import (
    SIMULATION_MODE,
    SIMULATION_INTERVAL
)

from routes.esp32 import sensor_history, set_test_context, store_sensor_data


router = APIRouter(
    prefix="/test",
    tags=["Test Control"]
)


# ==========================================
# TEST STATE
# ==========================================

test_status = {
    "running": False,
    "message": "Test not started"
}


class TestConfiguration(BaseModel):
    sample_name: str = Field(min_length=1)
    water_quantity: float = Field(gt=0)
    thickness: float = Field(gt=0)


test_configuration = {
    "sample_name": "",
    "water_quantity": None,
    "thickness": None
}


# Background simulator task
simulation_task = None
report_history = []
REPORTS_FILE = Path(__file__).resolve().parent.parent / "data" / "reports.json"


def load_report_history():
    if not REPORTS_FILE.exists():
        return []
    try:
        return json.loads(REPORTS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []


def save_report_history():
    REPORTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORTS_FILE.write_text(json.dumps(report_history, indent=2), encoding="utf-8")


report_history = load_report_history()


# ==========================================
# SENSOR DATA SIMULATOR
# ==========================================

async def run_simulator():

    while test_status["running"]:

        simulated_data = {
            "water_level": round(
                random.uniform(10, 100),
                2
            ),

            "flow_rate": round(
                random.uniform(1, 10),
                2
            ),

            "infiltration_rate": round(
                random.uniform(2, 15),
                2
            )
        }

        # Store data using same function
        # that future ESP32 data will use

        store_sensor_data(
            water_level=simulated_data["water_level"],
            flow_rate=simulated_data["flow_rate"],
            infiltration_rate=simulated_data[
                "infiltration_rate"
            ]
        )

        await asyncio.sleep(
            SIMULATION_INTERVAL
        )


def build_report(report):
    readings = report.get("readings") or [reading for reading in sensor_history if reading.get("test_id") == report["test_id"]]
    metrics = {
        "reading_count": len(readings),
        "average_water_level": round(sum(item["water_level"] for item in readings) / len(readings), 2) if readings else 0,
        "average_flow_rate": round(sum(item["flow_rate"] for item in readings) / len(readings), 2) if readings else 0,
        "average_infiltration_rate": round(sum(item["infiltration_rate"] for item in readings) / len(readings), 2) if readings else 0,
        "best_infiltration_rate": round(max((item["infiltration_rate"] for item in readings), default=0), 2),
    }
    return {**report, "readings": readings, "metrics": metrics}


# ==========================================
# START TEST
# ==========================================

@router.post("/start")
async def start_test(configuration: TestConfiguration):

    global test_status
    global simulation_task
    global test_configuration

    if test_status["running"]:

        return {
            "status": "success",
            "message": "Test already running",
            "data": test_status
        }

    test_configuration = configuration.model_dump()
    test_id = str(uuid4())
    report_history.append({
        "test_id": test_id,
        "sample_name": configuration.sample_name.strip(),
        "started_at": datetime.now().isoformat(),
        "ended_at": None,
        "configuration": test_configuration,
        "readings": [],
    })
    save_report_history()
    set_test_context(test_id, configuration.sample_name.strip())


    test_status = {
        "running": True,
        "message": "Test is running"
    }


    # Start simulator only if
    # simulation mode is enabled

    if SIMULATION_MODE:

        simulation_task = asyncio.create_task(
            run_simulator()
        )


    return {
        "status": "success",
        "data": {
            **test_status,
            "configuration": test_configuration,
            "test_id": test_id,
        }
    }


# ==========================================
# STOP TEST
# ==========================================

@router.post("/stop")
async def stop_test():

    global test_status
    global simulation_task


    test_status = {
        "running": False,
        "message": "Test stopped"
    }


    # Stop simulator

    if simulation_task:

        simulation_task.cancel()

        simulation_task = None


    return {
        "status": "success",
        "data": test_status
    }


# ==========================================
# GET TEST STATUS
# ==========================================

@router.get("/status")
def get_test_status():

    return {
        "status": "success",
        "data": {
            **test_status,
            "configuration": test_configuration
        }
    }


@router.get("/configuration")
def get_test_configuration():

    return {
        "status": "success",
        "data": test_configuration
    }

    if report_history:
        report_history[-1]["ended_at"] = datetime.now().isoformat()
        report_history[-1]["readings"] = [
            reading for reading in sensor_history if reading.get("test_id") == report_history[-1]["test_id"]
        ]
        save_report_history()
    set_test_context()


@router.get("/reports")
def get_reports():
    return {
        "status": "success",
        "data": [build_report(report) for report in report_history],
    }


@router.get("/reports/comparison")
def compare_reports(sample_name: str):
    matching_reports = [
        build_report(report)
        for report in report_history
        if report["sample_name"].casefold() == sample_name.strip().casefold()
    ]
    matching_reports.sort(key=lambda report: report["started_at"])
    previous = matching_reports[-2] if len(matching_reports) > 1 else None
    current = matching_reports[-1] if matching_reports else None

    delta = None
    if previous and current:
        delta = {
            metric: round(current["metrics"][metric] - previous["metrics"][metric], 2)
            for metric in ("average_water_level", "average_flow_rate", "average_infiltration_rate", "best_infiltration_rate")
        }

    return {
        "status": "success",
        "data": {
            "sample_name": sample_name.strip(),
            "reports": matching_reports,
            "previous": previous,
            "current": current,
            "delta": delta,
        },
    }