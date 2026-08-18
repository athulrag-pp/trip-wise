from fastapi import APIRouter
from typing import List
from app.schemas.trip import RecommendationRequest, POIItem

router = APIRouter(prefix="/api", tags=["Recommendations & Map"])

SAMPLE_POIS = [
    {"id": 1, "name": "Marina Beach", "category": "attraction", "lat": 13.0499, "lng": 80.2824, "details": "Famous long urban beach & walking promenade", "price_info": "Free"},
    {"id": 2, "name": "Kapaleeshwarar Temple", "category": "attraction", "lat": 13.0335, "lng": 80.2694, "details": "7th-century Dravidian architecture temple", "price_info": "Free"},
    {"id": 3, "name": "Murugan Idli Shop", "category": "restaurant", "lat": 13.0418, "lng": 80.2541, "details": "Authentic South Indian Breakfast & Ghee Podi Idli", "price_info": "₹180 for two"},
    {"id": 4, "name": "Buhari Restaurant", "category": "restaurant", "lat": 13.0610, "lng": 80.2611, "details": "Home of original Chicken 65 & Biryani", "price_info": "₹450 for two"},
    {"id": 5, "name": "The Park Hotel Chennai", "category": "hotel", "lat": 13.0560, "lng": 80.2505, "details": "5-star luxury hotel in city center", "price_info": "₹4,500/night"},
    {"id": 6, "name": "HP Fuel Station & EV Charger", "category": "fuel", "lat": 13.0450, "lng": 80.2600, "details": "24x7 Petrol/Diesel & 60kW DC EV Fast Charger", "price_info": "Petrol ₹102/L"},
    {"id": 7, "name": "Apollo Hospital Greams Road", "category": "hospital", "lat": 13.0605, "lng": 80.2520, "details": "24x7 Emergency Care & Pharmacy", "price_info": "Emergency"},
    {"id": 8, "name": "HDFC Bank ATM", "category": "atm", "lat": 13.0480, "lng": 80.2650, "details": "24 Hours ATM & Cash Recycler", "price_info": "ATM"},
]

@router.post("/recommendations", response_model=List[POIItem])
def get_recommendations(req: RecommendationRequest):
    """Fetch points of interest filtered by category and city."""
    if not req.category or req.category == "all":
        return SAMPLE_POIS
    return [p for p in SAMPLE_POIS if p["category"] == req.category]
