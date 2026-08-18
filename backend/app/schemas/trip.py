from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# Vehicle Fuel Calculation Schemas
class FuelCalculationRequest(BaseModel):
    distance_km: float = Field(..., gt=0, description="Total travel distance in km")
    mileage_kmpl: float = Field(..., gt=0, description="Vehicle mileage in km/L or kWh consumption")
    fuel_type: str = Field("petrol", description="petrol | diesel | electric")
    fuel_price_per_l: float = Field(102.0, description="Fuel price per Liter or Electricity tariff per kWh")

class FuelCalculationResponse(BaseModel):
    vehicle_type: str
    distance_km: float
    mileage_kmpl: float
    fuel_required_liters: float
    fuel_cost_inr: float
    details: str

# Trip Prediction Schemas
class TripPredictionRequest(BaseModel):
    city: str = Field("Chennai", description="Destination city name")
    needs_hotel: bool = Field(False, description="Whether hotel stay is required")
    hotel_budget: float = Field(0.0, ge=0, description="Nightly hotel budget")
    hotel_rating: float = Field(4.0, ge=1.0, le=5.0, description="Hotel star rating preference")
    food_preference: str = Field("non_veg", description="veg | non_veg | fast_food | local_cuisine | cafe")
    food_budget_tier: str = Field("mid_range", description="budget | mid_range | fine_dining")
    transport_type: str = Field("personal_vehicle", description="personal_vehicle | rental_vehicle | public_transport | taxi")
    vehicle_type: str = Field("bike", description="bike | scooter | car | ev")
    vehicle_name: str = Field("Royal Enfield Classic 350", description="Vehicle name")
    distance_km: float = Field(60.0, gt=0, description="Expected travel distance in km")
    mileage_kmpl: float = Field(35.0, gt=0, description="Vehicle mileage in km/L")
    activities: List[str] = Field(default_factory=lambda: ["sightseeing", "beach", "cafe"])
    daily_budget: float = Field(1500.0, gt=0, description="Target daily budget in INR")
    people_count: int = Field(1, ge=1, description="Number of travelers")

class ExpenseBreakdown(BaseModel):
    food: float
    fuel: float
    local_travel: float
    activities: float
    misc: float
    accommodation: float
    total: float

class VehicleSummary(BaseModel):
    vehicle_name: str
    distance_km: float
    mileage_kmpl: float
    fuel_required_liters: float

class TripPredictionResponse(BaseModel):
    city: str
    daily_budget: float
    predicted_expense: float
    min_expense: float
    max_expense: float
    budget_status: str  # "sufficient" | "exceeded"
    variance_inr: float
    breakdown: ExpenseBreakdown
    vehicle_details: VehicleSummary

# Points of Interest Schemas
class RecommendationRequest(BaseModel):
    city: str = Field("Chennai")
    category: Optional[str] = Field("all", description="all | restaurant | hotel | fuel | hospital | atm | attraction")

class POIItem(BaseModel):
    id: int
    name: str
    category: str
    lat: float
    lng: float
    details: str
    price_info: str

# Itinerary Timeline Schemas
class ItineraryRequest(BaseModel):
    city: str = Field("Chennai")
    food_preference: str = Field("non_veg")
    daily_budget: float = Field(1500.0)

class TimelineItem(BaseModel):
    time: str
    title: str
    type: str  # food | spot | cafe | return
    spot: str
    est_cost: float
    details: str

class ItineraryResponse(BaseModel):
    city: str
    total_est_cost: float
    timeline: List[TimelineItem]
