from app.schemas.trip import FuelCalculationRequest, FuelCalculationResponse

# Pre-populated Vehicle Database
VEHICLE_DATABASE = [
    {"id": 1, "brand": "Royal Enfield", "model_name": "Classic 350", "type": "bike", "mileage_kmpl": 35.0, "fuel_type": "petrol"},
    {"id": 2, "brand": "Honda", "model_name": "Activa 6G", "type": "scooter", "mileage_kmpl": 45.0, "fuel_type": "petrol"},
    {"id": 3, "brand": "Bajaj", "model_name": "Pulsar 150", "type": "bike", "mileage_kmpl": 48.0, "fuel_type": "petrol"},
    {"id": 4, "brand": "Maruti Suzuki", "model_name": "Swift Dzire", "type": "car", "mileage_kmpl": 18.5, "fuel_type": "petrol"},
    {"id": 5, "brand": "Hyundai", "model_name": "i20 Petrol", "type": "car", "mileage_kmpl": 16.0, "fuel_type": "petrol"},
    {"id": 6, "brand": "TVS", "model_name": "Jupiter 110", "type": "scooter", "mileage_kmpl": 46.0, "fuel_type": "petrol"},
    {"id": 7, "brand": "Tata", "model_name": "Nexon EV", "type": "ev_car", "mileage_kmpl": 0.15, "fuel_type": "electric"}, # 0.15 kWh/km
    {"id": 8, "brand": "Ather", "model_name": "450X", "type": "ev_two_wheeler", "mileage_kmpl": 0.03, "fuel_type": "electric"}, # 0.03 kWh/km
]

class VehicleService:
    @staticmethod
    def get_all_vehicles():
        return VEHICLE_DATABASE

    @staticmethod
    def calculate_fuel_cost(req: FuelCalculationRequest) -> FuelCalculationResponse:
        is_ev = req.fuel_type.lower() == "electric"
        
        if is_ev:
            # EV Math: Energy (kWh) = Distance (km) * Consumption (kWh/km)
            energy_kwh = round(req.distance_km * req.mileage_kmpl, 2)
            cost_inr = round(energy_kwh * req.fuel_price_per_l, 2)
            details = f"EV Charging required: {energy_kwh} kWh @ ₹{req.fuel_price_per_l}/kWh grid tariff"
            return FuelCalculationResponse(
                vehicle_type="EV",
                distance_km=req.distance_km,
                mileage_kmpl=req.mileage_kmpl,
                fuel_required_liters=energy_kwh,
                fuel_cost_inr=cost_inr,
                details=details
            )
        else:
            # Petrol/Diesel Math: Fuel (Liters) = Distance (km) / Mileage (km/L)
            liters_req = round(req.distance_km / req.mileage_kmpl, 2) if req.mileage_kmpl > 0 else 0.0
            cost_inr = round(liters_req * req.fuel_price_per_l, 2)
            details = f"Fuel required: {liters_req} Liters @ ₹{req.fuel_price_per_l}/L"
            return FuelCalculationResponse(
                vehicle_type="ICE",
                distance_km=req.distance_km,
                mileage_kmpl=req.mileage_kmpl,
                fuel_required_liters=liters_req,
                fuel_cost_inr=cost_inr,
                details=details
            )
