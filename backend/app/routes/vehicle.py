from fastapi import APIRouter
from typing import List
from app.schemas.trip import FuelCalculationRequest, FuelCalculationResponse
from app.services.vehicle_service import VehicleService

router = APIRouter(prefix="/api", tags=["Vehicles & Fuel"])

@router.get("/vehicles")
def get_vehicles():
    """Fetch pre-populated vehicle database for fuel calculator dropdowns."""
    return VehicleService.get_all_vehicles()

@router.post("/calculate-fuel", response_model=FuelCalculationResponse)
def calculate_fuel(req: FuelCalculationRequest):
    """Pure vehicle cost calculation (Fuel required & INR cost)."""
    return VehicleService.calculate_fuel_cost(req)
