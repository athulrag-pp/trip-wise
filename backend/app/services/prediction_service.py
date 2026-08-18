import os
import joblib
import pandas as pd
from app.schemas.trip import TripPredictionRequest, TripPredictionResponse, ExpenseBreakdown, VehicleSummary
from app.services.vehicle_service import VehicleService, FuelCalculationRequest

MODEL_PATH = "/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/backend/app/ml_models/tripwise_expense_model.joblib"

class PredictionService:
    _ml_pipeline = None

    @classmethod
    def get_model(cls):
        if cls._ml_pipeline is None and os.path.exists(MODEL_PATH):
            try:
                cls._ml_pipeline = joblib.load(MODEL_PATH)
                print(f"🤖 Loaded trained ML Model pipeline from {MODEL_PATH}")
            except Exception as e:
                print(f"⚠️ Error loading ML model: {e}")
        return cls._ml_pipeline

    @classmethod
    def predict_daily_expense(cls, req: TripPredictionRequest) -> TripPredictionResponse:
        # 1. Calculate Fuel Math
        fuel_req = FuelCalculationRequest(
            distance_km=req.distance_km,
            mileage_kmpl=req.mileage_kmpl,
            fuel_type="electric" if req.vehicle_type == "ev" else "petrol",
            fuel_price_per_l=102.0 if req.vehicle_type != "ev" else 8.5
        )
        fuel_calc = VehicleService.calculate_fuel_cost(fuel_req)
        fuel_cost = fuel_calc.fuel_cost_inr

        # 2. Estimate Category Breakdown
        food_base_rates = {"budget": 150.0, "mid_range": 300.0, "fine_dining": 650.0}
        food_cost = round(food_base_rates.get(req.food_budget_tier, 300.0) * 3 * req.people_count, 2)
        
        transit_rates = {"personal_vehicle": 50.0, "rental_vehicle": 300.0, "public_transport": 100.0, "taxi": 450.0}
        local_travel_cost = transit_rates.get(req.transport_type, 100.0) * req.people_count
        
        activities_cost = round(len(req.activities) * 120.0 * req.people_count, 2)
        misc_cost = round(100.0 * req.people_count, 2)
        accommodation_cost = round(req.hotel_budget, 2) if req.needs_hotel else 0.0

        # Rule baseline
        rule_total = food_cost + fuel_cost + local_travel_cost + activities_cost + misc_cost + accommodation_cost

        # 3. Check ML Model Prediction
        ml_model = cls.get_model()
        if ml_model is not None:
            input_data = pd.DataFrame([{
                "city": req.city,
                "distance_km": req.distance_km,
                "vehicle_type": req.vehicle_type,
                "mileage_kmpl": req.mileage_kmpl,
                "fuel_price_per_l": 102.0 if req.vehicle_type != "ev" else 8.5,
                "food_type": req.food_preference,
                "food_budget_tier": req.food_budget_tier,
                "meals_per_day": 3,
                "activity_count": len(req.activities),
                "activity_type": req.activities[0] if req.activities else "sightseeing",
                "needs_accommodation": 1 if req.needs_hotel else 0,
                "hotel_cost_per_night": req.hotel_budget if req.needs_hotel else 0.0,
                "people_count": req.people_count,
                "transport_type": req.transport_type
            }])
            ml_pred = ml_model.predict(input_data)[0]
            final_predicted = round(float(ml_pred), 2)
        else:
            final_predicted = round(rule_total, 2)

        min_exp = round(final_predicted * 0.90, 2)
        max_exp = round(final_predicted * 1.10, 2)

        is_sufficient = req.daily_budget >= final_predicted
        variance = round(req.daily_budget - final_predicted, 2)

        return TripPredictionResponse(
            city=req.city,
            daily_budget=req.daily_budget,
            predicted_expense=final_predicted,
            min_expense=min_exp,
            max_expense=max_exp,
            budget_status="sufficient" if is_sufficient else "exceeded",
            variance_inr=variance,
            breakdown=ExpenseBreakdown(
                food=food_cost,
                fuel=fuel_cost,
                local_travel=local_travel_cost,
                activities=activities_cost,
                misc=misc_cost,
                accommodation=accommodation_cost,
                total=final_predicted
            ),
            vehicle_details=VehicleSummary(
                vehicle_name=req.vehicle_name,
                distance_km=req.distance_km,
                mileage_kmpl=req.mileage_kmpl,
                fuel_required_liters=fuel_calc.fuel_required_liters
            )
        )
