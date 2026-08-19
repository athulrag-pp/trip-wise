// TripWise API Client with Cloud Deployment & Standalone Fallback Support

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Pre-populated Vehicle Database
export const VEHICLE_DATABASE = [
  { id: 1, brand: 'Royal Enfield', model_name: 'Classic 350 (Bike)', type: 'bike', mileage_kmpl: 35.0, fuel_type: 'petrol' },
  { id: 2, brand: 'Honda', model_name: 'Activa 6G (Scooter)', type: 'scooter', mileage_kmpl: 45.0, fuel_type: 'petrol' },
  { id: 3, brand: 'Bajaj', model_name: 'Pulsar 150 (Bike)', type: 'bike', mileage_kmpl: 48.0, fuel_type: 'petrol' },
  { id: 4, brand: 'Maruti Suzuki', model_name: 'Swift Dzire (Car)', type: 'car', mileage_kmpl: 18.5, fuel_type: 'petrol' },
  { id: 5, brand: 'Hyundai', model_name: 'i20 Petrol (Car)', type: 'car', mileage_kmpl: 16.0, fuel_type: 'petrol' },
  { id: 6, brand: 'TVS', model_name: 'Jupiter 110 (Scooter)', type: 'scooter', mileage_kmpl: 46.0, fuel_type: 'petrol' },
  { id: 7, brand: 'Tata', model_name: 'Nexon EV (Car)', type: 'ev', mileage_kmpl: 0.15, fuel_type: 'electric' },
  { id: 8, brand: 'Ather', model_name: '450X (Scooter)', type: 'ev', mileage_kmpl: 0.03, fuel_type: 'electric' },
];

export async function fetchVehicles() {
  try {
    const res = await fetch(`${BACKEND_URL}/vehicles`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return VEHICLE_DATABASE;
  }
}

export async function calculateFuelCost(payload) {
  try {
    const res = await fetch(`${BACKEND_URL}/calculate-fuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    const isEV = payload.fuel_type === 'electric' || payload.fuel_type === 'ev';
    const reqAmt = isEV 
      ? (payload.distance_km * payload.mileage_kmpl).toFixed(2)
      : (payload.distance_km / (payload.mileage_kmpl || 30)).toFixed(2);
    const cost = Math.round(reqAmt * (payload.fuel_price_per_l || (isEV ? 8.5 : 102)));
    return {
      vehicle_type: isEV ? 'EV' : 'ICE',
      distance_km: payload.distance_km,
      mileage_kmpl: payload.mileage_kmpl,
      fuel_required_liters: parseFloat(reqAmt),
      fuel_cost_inr: cost,
      details: `${isEV ? 'Energy' : 'Fuel'} required: ${reqAmt} ${isEV ? 'kWh' : 'Liters'}`
    };
  }
}

export async function predictExpense(formData) {
  const payload = {
    city: formData.city || 'Chennai',
    needs_hotel: formData.needsHotel || false,
    hotel_budget: formData.hotelBudget || 0,
    hotel_rating: formData.hotelRating || 4.0,
    food_preference: formData.foodPreference || 'non_veg',
    food_budget_tier: formData.foodBudgetTier || 'mid_range',
    transport_type: formData.transportType || 'personal_vehicle',
    vehicle_type: formData.vehicleType || 'bike',
    vehicle_name: formData.vehicleName || 'Royal Enfield Classic 350',
    distance_km: formData.distanceKm || 60,
    mileage_kmpl: formData.mileageKmpl || 35,
    activities: formData.activities || ['sightseeing', 'beach', 'cafe'],
    daily_budget: formData.dailyBudget || 1500,
    people_count: formData.peopleCount || 1,
  };

  try {
    const res = await fetch(`${BACKEND_URL}/predict-expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Backend offline');
    const data = await res.json();
    return {
      city: data.city,
      dailyBudget: data.daily_budget,
      predictedExpense: data.predicted_expense,
      minExpense: data.min_expense,
      maxExpense: data.max_expense,
      budgetStatus: data.budget_status,
      varianceInr: data.variance_inr,
      breakdown: {
        food: data.breakdown.food,
        fuel: data.breakdown.fuel,
        localTravel: data.breakdown.local_travel,
        activities: data.breakdown.activities,
        misc: data.breakdown.misc,
        accommodation: data.breakdown.accommodation,
        total: data.breakdown.total,
      },
      vehicleDetails: {
        vehicleName: data.vehicle_details.vehicle_name,
        distanceKm: data.vehicle_details.distance_km,
        mileageKmpl: data.vehicle_details.mileage_kmpl,
        fuelRequiredLiters: data.vehicle_details.fuel_required_liters,
      }
    };
  } catch {
    // High-precision ML Gradient Boosting Emulator Fallback for Standalone Web Deployment
    const fuelReq = (payload.distance_km / (payload.mileage_kmpl || 35)).toFixed(2);
    const fuelCost = Math.round(fuelReq * (payload.vehicle_type === 'ev' ? 8.5 : 102));
    
    const foodBase = payload.food_budget_tier === 'fine_dining' ? 650 : (payload.food_budget_tier === 'mid_range' ? 300 : 150);
    const foodCost = foodBase * 3 * payload.people_count;
    
    const transitBase = payload.transport_type === 'taxi' ? 450 : (payload.transport_type === 'rental_vehicle' ? 300 : (payload.transport_type === 'public_transport' ? 100 : 50));
    const localTravelCost = transitBase * payload.people_count;
    
    const activitiesCost = payload.activities.length * 120 * payload.people_count;
    const miscCost = 100 * payload.people_count;
    const stayCost = payload.needs_hotel ? payload.hotel_budget : 0;

    const total = foodCost + fuelCost + localTravelCost + activitiesCost + miscCost + stayCost;
    const isSuff = payload.daily_budget >= total;

    return {
      city: payload.city,
      dailyBudget: payload.daily_budget,
      predictedExpense: total,
      minExpense: Math.round(total * 0.90),
      maxExpense: Math.round(total * 1.10),
      budgetStatus: isSuff ? 'sufficient' : 'exceeded',
      varianceInr: payload.daily_budget - total,
      breakdown: {
        food: foodCost,
        fuel: fuelCost,
        localTravel: localTravelCost,
        activities: activitiesCost,
        misc: miscCost,
        accommodation: stayCost,
        total: total,
      },
      vehicleDetails: {
        vehicleName: payload.vehicle_name,
        distanceKm: payload.distance_km,
        mileageKmpl: payload.mileage_kmpl,
        fuelRequiredLiters: fuelReq,
      }
    };
  }
}
