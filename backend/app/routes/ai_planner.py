from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.schemas.trip import TripPredictionRequest
from app.services.prediction_service import PredictionService
import re

router = APIRouter(prefix="/api", tags=["AI Smart Planner"])

class AIPromptRequest(BaseModel):
    prompt: str = Field(..., example="I have ₹1500 and I'm visiting Chennai for one day. I like non-veg food and want to visit 3 places by bike.")

class AIPromptResponse(BaseModel):
    parsed_destination: str
    parsed_budget: float
    parsed_transport: str
    predicted_expense: float
    budget_status: str
    ai_generated_plan: str

@router.post("/ai-plan", response_model=AIPromptResponse)
def generate_ai_trip_plan(req: AIPromptRequest):
    p = req.prompt.lower()

    # Extract budget from prompt (e.g. ₹1500 or 1500 rs)
    budget_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d{3,6})', p)
    budget = float(budget_match.group(1)) if budget_match else 1500.0

    # Extract city
    cities = ["chennai", "bengaluru", "mumbai", "delhi", "jaipur", "kochi", "hyderabad", "goa"]
    city = "Chennai"
    for c in cities:
        if c in p:
            city = c.capitalize()
            break

    # Extract transport
    transport = "bike"
    if "car" in p:
        transport = "car"
    elif "scooter" in p:
        transport = "scooter"
    elif "bus" in p or "metro" in p:
        transport = "public_transport"

    # Call ML prediction engine
    pred_req = TripPredictionRequest(
        city=city,
        daily_budget=budget,
        vehicle_type=transport if transport in ["bike", "scooter", "car"] else "bike",
        distance_km=50.0,
        mileage_kmpl=35.0,
        food_preference="non_veg" if "non" in p or "chicken" in p else "veg"
    )
    res = PredictionService.predict_daily_expense(pred_req)

    # Format natural language plan
    ai_plan = (
        f"🌟 **TripWise AI Smart Itinerary for {city}**\n\n"
        f"• **Morning (08:30 AM)**: Start with breakfast at a top-rated local eatery (Est. ₹{res.breakdown.food*0.25:.0f}).\n"
        f"• **Sightseeing (10:00 AM)**: Explore major heritage spots and scenic promenades (Est. fuel: ₹{res.breakdown.fuel:.0f}).\n"
        f"• **Lunch (01:00 PM)**: Enjoy a delicious lunch meal respecting your food preferences (Est. ₹{res.breakdown.food*0.45:.0f}).\n"
        f"• **Afternoon Activity (03:30 PM)**: Visit cultural centers or local shopping markets.\n"
        f"• **Dinner & Return (08:30 PM)**: Conclude with dinner and safe return (Est. ₹{res.breakdown.food*0.30:.0f}).\n\n"
        f"💰 **Total Predicted Cost**: ₹{res.predicted_expense:.0f} vs Your Budget: ₹{budget:.0f} "
        f"({res.budget_status.upper()})"
    )

    return AIPromptResponse(
        parsed_destination=city,
        parsed_budget=budget,
        parsed_transport=transport,
        predicted_expense=res.predicted_expense,
        budget_status=res.budget_status,
        ai_generated_plan=ai_plan
    )
