import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlanMyDay from './pages/PlanMyDay';
import PredictionDashboard from './pages/PredictionDashboard';
import VehicleCalculator from './pages/VehicleCalculator';
import ExploreMap from './pages/ExploreMap';
import MyItinerary from './pages/MyItinerary';
import { predictExpense } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [isLoading, setIsLoading] = useState(false);

  // Initial Prediction State
  const [predictionResult, setPredictionResult] = useState({
    city: 'Chennai',
    dailyBudget: 1500,
    predictedExpense: 1634.24,
    minExpense: 1470.82,
    maxExpense: 1797.66,
    budgetStatus: 'exceeded',
    varianceInr: -134.24,
    breakdown: {
      food: 900,
      fuel: 174.42,
      localTravel: 50,
      activities: 360,
      misc: 100,
      accommodation: 0,
      total: 1634.24
    },
    vehicleDetails: {
      vehicleName: 'Royal Enfield Classic 350',
      distanceKm: 60,
      mileageKmpl: 35,
      fuelRequiredLiters: 1.71
    }
  });

  const handleStartPlanning = (city) => {
    setSelectedCity(city);
    setActivePage('plan');
  };

  const handlePlanSubmit = async (formDataOrResult) => {
    setIsLoading(true);
    try {
      if (formDataOrResult.predictedExpense && formDataOrResult.breakdown) {
        // Direct prediction object from AI planner
        setPredictionResult(formDataOrResult);
      } else {
        // Form data object
        const result = await predictExpense(formDataOrResult);
        setPredictionResult(result);
      }
      setActivePage('dashboard');
    } catch (err) {
      console.error('Error predicting expense:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }}>
        {isLoading && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: 'var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1.25rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              🤖 ML Model Predicting Daily Expense & Analyzing Budget...
            </p>
          </div>
        )}

        {activePage === 'home' && (
          <Home
            onStartPlanning={handleStartPlanning}
            onExploreCalc={() => setActivePage('calc')}
            onPlanSubmit={handlePlanSubmit}
          />
        )}

        {activePage === 'plan' && (
          <PlanMyDay
            initialCity={selectedCity}
            onSubmitPlan={handlePlanSubmit}
          />
        )}

        {activePage === 'dashboard' && (
          <PredictionDashboard
            predictionResult={predictionResult}
            onExploreMap={() => setActivePage('explore')}
            onGenerateItinerary={() => setActivePage('itinerary')}
          />
        )}

        {activePage === 'calc' && <VehicleCalculator />}

        {activePage === 'explore' && <ExploreMap city={predictionResult?.city || 'Chennai'} />}

        {activePage === 'itinerary' && <MyItinerary predictionResult={predictionResult} />}
      </main>

      <Footer />
    </div>
  );
}
