# TripWise — Personalized Daily Expense Prediction & Smart Trip Planner

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0-cyan.svg)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.6-orange.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Tagline:** *“Know what your day will cost before you step out.”*

TripWise is a personalized web application engineered for travelers visiting unfamiliar cities. It combines **Machine Learning (Gradient Boosting Regressor)**, **GIS Mapping (Leaflet + OpenStreetMap)**, **Vehicle Powertrain Expense Math**, **Location Recommendation Systems**, and **AI Natural Language Trip Planning** to forecast travel expenses, evaluate budget feasibility, recommend nearby spots, and build custom timeline itineraries.

---

## 🌟 Key Features

* 📊 **ML Daily Expense Predictor**: Trained regression algorithm forecasting total daily spending with itemized category cost breakdowns (Food, Fuel, Local Travel, Activities, Misc, Accommodation).
* ⛽ **Vehicle Fuel & Energy Calculator**: Exact fuel expense math based on vehicle mileage ($Fuel = \frac{Distance}{Mileage} \times Price$) for petrol/diesel 2-wheelers and 4-wheelers, plus extensible charging math for Electric Vehicles (EVs).
* 🟢🔴 **Budget Feasibility Status**: Real-time evaluation comparing target budgets against predicted costs with delta cushion/shortfall alerts.
* 🗺️ **Interactive GIS Map**: OpenStreetMap integration featuring category markers for Restaurants, Hotels, Fuel/EV Stations, Hospitals, ATMs, and Attractions.
* 🗓️ **Timeline Itinerary Generator**: Auto-generated daily schedule (Breakfast $\rightarrow$ Morning Sightseeing $\rightarrow$ Lunch $\rightarrow$ Afternoon Activity $\rightarrow$ Evening Cafe $\rightarrow$ Dinner $\rightarrow$ Return).
* 🤖 **AI Natural Language Planner**: NLP query parser converting prompts like *"I have ₹1500 and I'm visiting Chennai for one day by bike"* into structured predictions and natural-language itineraries.

---

## 🤖 Machine Learning Methodology & Model Evaluation

We trained and evaluated three classical ML regression models on a realistic dataset of 2,000 urban Indian travel spending records.

### Model Evaluation Results

| ML Algorithm | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | $R^2$ Score | Selection Status |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | ₹445.98 | ₹620.84 | 0.9304 | Baseline |
| **Random Forest Regressor** | ₹335.24 | ₹494.21 | 0.9559 | Runner-up |
| **Gradient Boosting Regressor** | **₹202.20** | **₹305.52** | **0.9831** | 🏆 **Best Model Selected** |

### Why Gradient Boosting Performed Best
Gradient Boosting builds an ensemble of shallow decision trees sequentially, with each tree correcting the residual errors of prior trees. This non-linear capability allows it to accurately model complex feature interactions (such as non-linear vehicle fuel curves across vehicle types and tiered dining preferences) significantly better than linear models.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────────────────────────┐
                    │            USER / WEB BROWSER            │
                    └────────────────────┬─────────────────────┘
                                         │ HTTP / JSON
                                         ▼
                    ┌──────────────────────────────────────────┐
                    │          React Frontend (Vite)           │
                    │   - Multi-Step Form  - Recharts Dashboard│
                    │   - Leaflet Map      - Itinerary Timeline│
                    └────────────────────┬─────────────────────┘
                                         │ REST API Calls
                                         ▼
                    ┌──────────────────────────────────────────┐
                    │          FastAPI Backend Application     │
                    │   - Pydantic Validation  - API Routes    │
                    │   - Business Logic       - CORS Support  │
                    └──────┬─────────────────┬──────────────┬──┘
                           │                 │              │
                           ▼                 ▼              ▼
         ┌───────────────────┐     ┌───────────┐     ┌──────────────────────┐
         │  ML Expense Model │     │ SQLite DB │     │ Leaflet / OSM Service│
         │  (Joblib Pipeline)│     │(SQLAlchemy│     │(Nominatim & Overpass)│
         └───────────────────┘     └───────────┘     └──────────────────────┘
```

---

## 📂 Repository Structure

```text
tripwise/
├── README.md                     # Comprehensive documentation
├── .gitignore                    # Version control exclusions
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Footer
│   │   ├── pages/                # Home, PlanMyDay, PredictionDashboard, VehicleCalculator, ExploreMap, MyItinerary
│   │   ├── services/             # API client (api.js)
│   │   └── index.css             # Glassmorphism Design System
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint & router registration
│   │   ├── core/                 # Database config & settings
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── routes/               # API endpoint handlers (vehicle, predict, recommendations, itinerary, ai_planner)
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Vehicle & Prediction business logic
│   │   └── ml_models/            # Serialized .joblib ML model pipeline
│   └── requirements.txt
│
└── ml/                           # Machine Learning Workspace
    ├── dataset/                  # Dataset generator script & CSV dataset
    ├── models/                   # Saved .joblib model artifacts
    └── train.py                  # Model training & comparison pipeline
```

---

## ⚡ Quick Start & Installation

### Prerequisites
* Python 3.10+
* Node.js v18+ & npm

### 1. Backend Setup & Server Execution
```bash
cd backend
pip install -r requirements.txt

# Run ML model training pipeline
python ../ml/train.py

# Launch FastAPI backend server
python -m uvicorn app.main:app --reload --port 8000
```
*Swagger API Docs: `http://localhost:8000/docs`*

### 2. Frontend Setup & Execution
```bash
cd frontend
npm install
npm run dev
```
*Frontend Application: `http://localhost:5173`*

---

## 🎓 Resume & Portfolio Highlights

### Resume Bullet Points (B.Tech AI & Data Science)
* **Developed TripWise**, an end-to-end full-stack ML travel expense predictor & smart planning platform using **React**, **FastAPI**, and **Scikit-Learn**.
* **Engineered a Gradient Boosting Regressor** achieving an **$R^2$ score of 0.9831** and **MAE of ₹202.20**, outperforming Linear Regression and Random Forest models across 2,000 trip samples.
* **Integrated OpenStreetMap & Leaflet GIS** to render interactive points of interest (Restaurants, Hotels, EV Charging, Emergency Facilities) without third-party API costs.
* **Implemented an NLP AI Smart Planner** endpoint that parses natural-language prompts into structured budget constraints and automated itineraries.

---

## 📄 License
This project is open-source under the MIT License.
