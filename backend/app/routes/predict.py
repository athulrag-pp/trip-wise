from fastapi import APIRouter
from app.schemas.trip import TripPredictionRequest, TripPredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/api", tags=["Expense Prediction"])

@router.post("/predict-expense", response_model=TripPredictionResponse)
def predict_expense(req: TripPredictionRequest):
    """Predict total estimated daily expense, category breakdown, and budget status."""
    return PredictionService.predict_daily_expense(req)
