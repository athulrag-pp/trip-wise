from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import vehicle, predict, recommendations, itinerary, ai_planner
from app.core.database import engine, Base
from app.models import trip_model

# Create SQLite DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TripWise API",
    description="Backend REST services for TripWise expense prediction & smart trip planning",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(vehicle.router)
app.include_router(predict.router)
app.include_router(recommendations.router)
app.include_router(itinerary.router)
app.include_router(ai_planner.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TripWise API",
        "tagline": "Know what your day will cost before you step out.",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TripWise Backend",
        "database": "SQLite initialized",
        "version": "1.0.0"
    }
