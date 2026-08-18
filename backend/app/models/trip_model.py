import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.core.database import Base

class TripPlanModel(Base):
    __tablename__ = "trip_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    city = Column(String, index=True)
    daily_budget = Column(Float)
    predicted_expense = Column(Float)
    budget_status = Column(String)
    vehicle_name = Column(String)
    distance_km = Column(Float)
    food_preference = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VehicleModel(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String)
    model_name = Column(String)
    type = Column(String)
    mileage_kmpl = Column(Float)
    fuel_type = Column(String)
