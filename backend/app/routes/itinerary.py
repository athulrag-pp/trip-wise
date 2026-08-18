from fastapi import APIRouter
from app.schemas.trip import ItineraryRequest, ItineraryResponse, TimelineItem

router = APIRouter(prefix="/api", tags=["Itinerary Generator"])

@router.post("/generate-itinerary", response_model=ItineraryResponse)
def generate_itinerary(req: ItineraryRequest):
    """Generate personalized daily timeline itinerary."""
    timeline = [
        TimelineItem(time="08:30 AM", title="Breakfast & Coffee", type="food", spot="Murugan Idli Shop", est_cost=150.0, details="Traditional South Indian breakfast"),
        TimelineItem(time="10:00 AM", title="Morning Beach Walk", type="spot", spot="Marina Beach Promenade", est_cost=50.0, details="Walk along India's longest urban beach"),
        TimelineItem(time="01:00 PM", title="Lunch Feast", type="food", spot="Buhari Restaurant", est_cost=350.0, details="Signature Chicken 65 & Biryani"),
        TimelineItem(time="03:00 PM", title="Culture & Shopping", type="spot", spot="Kapaleeshwarar Temple & T. Nagar", est_cost=200.0, details="Heritage temple & local bazaar"),
        TimelineItem(time="06:00 PM", title="Evening Cafe", type="cafe", spot="Amethyst Cafe", est_cost=250.0, details="Garden cafe coffee & pastries"),
        TimelineItem(time="08:30 PM", title="Dinner", type="food", spot="Savya Rasa", est_cost=400.0, details="South Indian multi-course dinner"),
        TimelineItem(time="10:00 PM", title="Return Journey", type="return", spot="Hotel / Home", est_cost=0.0, details="End of daily trip"),
    ]
    total_cost = sum(t.est_cost for t in timeline)

    return ItineraryResponse(
        city=req.city,
        total_est_cost=total_cost,
        timeline=timeline
    )
