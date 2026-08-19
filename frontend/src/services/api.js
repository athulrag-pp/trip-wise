// TripWise API Client with Cloud Deployment & Standalone Fallback Support

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Comprehensive Indian Vehicles & Mileage Database (Motorcycles, Scooters, Cars, EVs)
export const VEHICLE_DATABASE = [
  // Motorcycles
  { id: 1, brand: 'Royal Enfield', model_name: 'Classic 350 (Motorcycle)', type: 'bike', mileage_kmpl: 35.0, fuel_type: 'petrol' },
  { id: 2, brand: 'Royal Enfield', model_name: 'Hunter 350 (Motorcycle)', type: 'bike', mileage_kmpl: 36.5, fuel_type: 'petrol' },
  { id: 3, brand: 'Royal Enfield', model_name: 'Himalayan 450 (Adventure)', type: 'bike', mileage_kmpl: 30.0, fuel_type: 'petrol' },
  { id: 4, brand: 'Hero', model_name: 'Splendor Plus (Motorcycle)', type: 'bike', mileage_kmpl: 65.0, fuel_type: 'petrol' },
  { id: 5, brand: 'Bajaj', model_name: 'Pulsar 150 (Motorcycle)', type: 'bike', mileage_kmpl: 48.0, fuel_type: 'petrol' },
  { id: 6, brand: 'TVS', model_name: 'Apache RTR 160 (Motorcycle)', type: 'bike', mileage_kmpl: 45.0, fuel_type: 'petrol' },
  { id: 7, brand: 'Honda', model_name: 'Shine 125 (Motorcycle)', type: 'bike', mileage_kmpl: 55.0, fuel_type: 'petrol' },
  { id: 8, brand: 'Yamaha', model_name: 'MT-15 V2 (Motorcycle)', type: 'bike', mileage_kmpl: 45.0, fuel_type: 'petrol' },
  { id: 9, brand: 'KTM', model_name: 'Duke 200 (Motorcycle)', type: 'bike', mileage_kmpl: 33.0, fuel_type: 'petrol' },

  // Scooters
  { id: 10, brand: 'Honda', model_name: 'Activa 6G (Scooter)', type: 'scooter', mileage_kmpl: 45.0, fuel_type: 'petrol' },
  { id: 11, brand: 'TVS', model_name: 'Jupiter 110 (Scooter)', type: 'scooter', mileage_kmpl: 46.0, fuel_type: 'petrol' },
  { id: 12, brand: 'Suzuki', model_name: 'Access 125 (Scooter)', type: 'scooter', mileage_kmpl: 48.0, fuel_type: 'petrol' },
  { id: 13, brand: 'TVS', model_name: 'Ntorq 125 (Scooter)', type: 'scooter', mileage_kmpl: 40.0, fuel_type: 'petrol' },
  { id: 14, brand: 'Ather', model_name: '450X (EV Scooter)', type: 'ev', mileage_kmpl: 0.03, fuel_type: 'electric' }, // 0.03 kWh/km
  { id: 15, brand: 'Ola', model_name: 'S1 Pro (EV Scooter)', type: 'ev', mileage_kmpl: 0.035, fuel_type: 'electric' },
  { id: 16, brand: 'TVS', model_name: 'iQube (EV Scooter)', type: 'ev', mileage_kmpl: 0.032, fuel_type: 'electric' },

  // Cars
  { id: 17, brand: 'Maruti Suzuki', model_name: 'Swift Dzire Petrol (Car)', type: 'car', mileage_kmpl: 22.4, fuel_type: 'petrol' },
  { id: 18, brand: 'Maruti Suzuki', model_name: 'Baleno Petrol (Car)', type: 'car', mileage_kmpl: 22.3, fuel_type: 'petrol' },
  { id: 19, brand: 'Hyundai', model_name: 'i20 Petrol (Car)', type: 'car', mileage_kmpl: 16.0, fuel_type: 'petrol' },
  { id: 20, brand: 'Hyundai', model_name: 'Creta Petrol (Car)', type: 'car', mileage_kmpl: 14.0, fuel_type: 'petrol' },
  { id: 21, brand: 'Hyundai', model_name: 'Creta Diesel (Car)', type: 'car', mileage_kmpl: 18.0, fuel_type: 'diesel' },
  { id: 22, brand: 'Tata', model_name: 'Punch Petrol (Car)', type: 'car', mileage_kmpl: 18.8, fuel_type: 'petrol' },
  { id: 23, brand: 'Tata', model_name: 'Nexon Petrol (Car)', type: 'car', mileage_kmpl: 17.0, fuel_type: 'petrol' },
  { id: 24, brand: 'Tata', model_name: 'Nexon EV Long Range (Car)', type: 'ev', mileage_kmpl: 0.15, fuel_type: 'electric' }, // 0.15 kWh/km
  { id: 25, brand: 'MG', model_name: 'ZS EV (Electric Car)', type: 'ev', mileage_kmpl: 0.16, fuel_type: 'electric' },
  { id: 26, brand: 'Kia', model_name: 'Seltos Petrol (Car)', type: 'car', mileage_kmpl: 13.8, fuel_type: 'petrol' },
  { id: 27, brand: 'Mahindra', model_name: 'Thar 4x4 (Car)', type: 'car', mileage_kmpl: 12.0, fuel_type: 'diesel' },
  { id: 28, brand: 'Toyota', model_name: 'Fortuner Diesel (Car)', type: 'car', mileage_kmpl: 10.5, fuel_type: 'diesel' },
  { id: 29, brand: 'Honda', model_name: 'City Petrol (Car)', type: 'car', mileage_kmpl: 17.8, fuel_type: 'petrol' },
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
    const isEV = payload.vehicle_type === 'ev';
    const fuelReq = isEV 
      ? (payload.distance_km * (payload.mileage_kmpl || 0.15)).toFixed(2)
      : (payload.distance_km / (payload.mileage_kmpl || 35)).toFixed(2);
    const fuelCost = Math.round(fuelReq * (isEV ? 8.5 : 102));
    
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
