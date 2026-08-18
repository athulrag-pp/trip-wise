const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchVehicles() {
  try {
    const res = await fetch(`${API_BASE_URL}/vehicles`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (err) {
    console.warn('API fallback for vehicles:', err);
    return [
      { id: 1, brand: 'Royal Enfield', model_name: 'Classic 350', type: 'bike', mileage_kmpl: 35.0, fuel_type: 'petrol' },
      { id: 2, brand: 'Honda', model_name: 'Activa 6G', type: 'scooter', mileage_kmpl: 45.0, fuel_type: 'petrol' },
      { id: 3, brand: 'Bajaj', model_name: 'Pulsar 150', type: 'bike', mileage_kmpl: 48.0, fuel_type: 'petrol' },
      { id: 4, brand: 'Maruti Suzuki', model_name: 'Swift Dzire', type: 'car', mileage_kmpl: 18.5, fuel_type: 'petrol' },
      { id: 7, brand: 'Tata', model_name: 'Nexon EV', type: 'ev_car', mileage_kmpl: 0.15, fuel_type: 'electric' },
    ];
  }
}

export async function calculateFuelCost(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/calculate-fuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Fuel calculation failed');
    return await res.json();
  } catch (err) {
    console.warn('API fallback for calculateFuelCost:', err);
    const isEV = payload.fuel_type === 'electric';
    const reqAmount = isEV 
      ? (payload.distance_km * payload.mileage_kmpl).toFixed(2)
      : (payload.distance_km / payload.mileage_kmpl).toFixed(2);
    const cost = Math.round(reqAmount * payload.fuel_price_per_l);
    return {
      vehicle_type: isEV ? 'EV' : 'ICE',
      distance_km: payload.distance_km,
      mileage_kmpl: payload.mileage_kmpl,
      fuel_required_liters: parseFloat(reqAmount),
      fuel_cost_inr: cost,
      details: `${isEV ? 'Energy' : 'Fuel'} required: ${reqAmount}`
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
    activities: formData.activities || ['sightseeing', 'beach'],
    daily_budget: formData.dailyBudget || 1500,
    people_count: formData.peopleCount || 1,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/predict-expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Expense prediction failed');
    const data = await res.json();
    
    // Map FastAPI snake_case response to React camelCase state format
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
  } catch (err) {
    console.warn('Backend offline, using local client calculation:', err);
    // Fallback logic
    const fuelReq = (payload.distance_km / payload.mileage_kmpl).toFixed(2);
    const fuelCost = Math.round(fuelReq * 102);
    const foodCost = payload.food_budget_tier === 'fine_dining' ? 900 : (payload.food_budget_tier === 'mid_range' ? 500 : 300);
    const activitiesCost = payload.activities.length * 120;
    const stayCost = payload.needs_hotel ? payload.hotel_budget : 0;
    const total = foodCost + fuelCost + 100 + activitiesCost + 100 + stayCost;

    return {
      city: payload.city,
      dailyBudget: payload.daily_budget,
      predictedExpense: total,
      minExpense: Math.round(total * 0.9),
      maxExpense: Math.round(total * 1.1),
      budgetStatus: payload.daily_budget >= total ? 'sufficient' : 'exceeded',
      varianceInr: payload.daily_budget - total,
      breakdown: {
        food: foodCost,
        fuel: fuelCost,
        localTravel: 100,
        activities: activitiesCost,
        misc: 100,
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
