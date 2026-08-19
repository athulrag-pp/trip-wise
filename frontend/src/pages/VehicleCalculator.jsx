import React, { useState } from 'react';
import { Fuel, Zap, Calculator, Navigation, MapPin, ArrowRight } from 'lucide-react';
import { VEHICLE_DATABASE } from '../services/api';

// Haversine Distance Formula for Real-World Route Math
function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  return Math.round(straightKm * 1.25);
}

export default function VehicleCalculator() {
  const [originCity, setOriginCity] = useState('Chennai');
  const [destinationCity, setDestinationCity] = useState('Kanyakumari');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const [selectedVehicleName, setSelectedVehicleName] = useState('Royal Enfield Classic 350 (Motorcycle)');
  const [vehicleType, setVehicleType] = useState('bike');
  const [distanceKm, setDistanceKm] = useState(700);
  const [mileageKmpl, setMileageKmpl] = useState(35);
  const [fuelPricePerL, setFuelPricePerL] = useState(102);

  // EV fields
  const [electricityCostPerKwh, setElectricityCostPerKwh] = useState(8.5); // ₹/kWh

  const isEV = vehicleType === 'ev';

  // Fuel & EV Math
  const fuelRequiredLiters = !isEV && mileageKmpl > 0 ? (distanceKm / mileageKmpl).toFixed(2) : 0;
  const fuelCostInr = !isEV ? Math.round(fuelRequiredLiters * fuelPricePerL) : 0;

  const energyRequiredKwh = isEV ? (distanceKm * mileageKmpl).toFixed(2) : 0;
  const evChargingCostInr = isEV ? Math.round(energyRequiredKwh * electricityCostPerKwh) : 0;

  const totalCost = isEV ? evChargingCostInr : fuelCostInr;

  // Auto Route Calculator using OpenStreetMap Geocoding
  const handleAutoRouteCalculate = async (e) => {
    e.preventDefault();
    if (!originCity.trim() || !destinationCity.trim()) return;

    setIsCalculatingRoute(true);
    try {
      const [resOrigin, resDest] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(originCity)}&format=json&limit=1`),
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinationCity)}&format=json&limit=1`)
      ]);

      const [dataOrigin, dataDest] = await Promise.all([resOrigin.json(), resDest.json()]);

      if (dataOrigin.length > 0 && dataDest.length > 0) {
        const lat1 = parseFloat(dataOrigin[0].lat);
        const lon1 = parseFloat(dataOrigin[0].lon);
        const lat2 = parseFloat(dataDest[0].lat);
        const lon2 = parseFloat(dataDest[0].lon);

        const routeKm = calculateHaversineKm(lat1, lon1, lat2, lon2);
        setDistanceKm(Math.min(routeKm, 50000));
      }
    } catch (err) {
      console.warn('Auto route calculation error:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '14px', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
          <Calculator size={32} />
        </div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Automatic Route & Vehicle Fuel Calculator</h1>
        <p style={{ color: 'var(--text-muted)' }}>Auto-compute distance (up to 50,000 km) and fuel expense for 29 Indian bikes, scooters, cars, and EVs</p>
      </div>

      {/* Auto Route Origin -> Destination Card */}
      <form onSubmit={handleAutoRouteCalculate} className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(99,102,241,0.15) 100%)' }}>
        <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation color="var(--accent-cyan)" size={20} /> Auto Route Distance Calculator
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Starting Point / Origin City</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Chennai, Mumbai, Delhi..."
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Destination City</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Kanyakumari, Bengaluru, Goa..."
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isCalculatingRoute} className="btn btn-primary" style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
            {isCalculatingRoute ? 'Calculating Route...' : 'Auto-Calculate Route Distance'} <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Form Controls */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Trip Parameters</h3>

          <div className="input-group">
            <label className="input-label">Select Vehicle ({VEHICLE_DATABASE.length} Models)</label>
            <select
              className="select-field"
              value={selectedVehicleName}
              onChange={(e) => {
                const sel = VEHICLE_DATABASE.find(v => v.model_name === e.target.value);
                if (sel) {
                  setSelectedVehicleName(sel.model_name);
                  setVehicleType(sel.type);
                  setMileageKmpl(sel.mileage_kmpl);
                }
              }}
            >
              {VEHICLE_DATABASE.map(v => (
                <option key={v.id} value={v.model_name}>
                  {v.brand} {v.model_name} — {v.mileage_kmpl} {v.type === 'ev' ? 'kWh/km' : 'km/L'}
                </option>
              ))}
            </select>
          </div>

          {/* Upgraded Max Distance Slider up to 50,000 km */}
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Trip Distance (km):</span>
              <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>{distanceKm.toLocaleString()} km</strong>
            </label>
            <input
              type="range"
              min="5"
              max="50000"
              step="10"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              style={{ width: '100%', margin: '0.75rem 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>5 km</span>
              <span>10,000 km</span>
              <span>50,000 km</span>
            </div>
          </div>

          {!isEV ? (
            <>
              <div className="input-group">
                <label className="input-label">Vehicle Mileage (km/L)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={mileageKmpl}
                  onChange={(e) => setMileageKmpl(parseFloat(e.target.value) || 1)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Fuel Price (₹ / Liter)</label>
                <input
                  type="number"
                  className="input-field"
                  value={fuelPricePerL}
                  onChange={(e) => setFuelPricePerL(parseFloat(e.target.value) || 0)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label className="input-label">Energy Rate (kWh per km)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={mileageKmpl}
                  onChange={(e) => setMileageKmpl(parseFloat(e.target.value) || 0.1)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Electricity Tariff (₹ / kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={electricityCostPerKwh}
                  onChange={(e) => setElectricityCostPerKwh(parseFloat(e.target.value) || 0)}
                />
              </div>
            </>
          )}
        </div>

        {/* Output Card */}
        <div className="glass-card" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(17,24,39,0.9) 0%, rgba(99,102,241,0.12) 100%)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Fuel / Energy Cost
            </span>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.5rem 0' }}>
              ₹{totalCost.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Route: <strong>{originCity}</strong> $\rightarrow$ <strong>{destinationCity}</strong>
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            marginTop: '1rem'
          }}>
            {!isEV ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Route Distance:</span>
                  <strong>{distanceKm.toLocaleString()} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vehicle Mileage:</span>
                  <strong>{mileageKmpl} km/L</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fuel Required:</span>
                  <strong style={{ color: 'var(--accent-rose)' }}>{fuelRequiredLiters.toLocaleString()} Liters</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fuel Tariff:</span>
                  <strong>₹{fuelPricePerL}/L</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Route Distance:</span>
                  <strong>{distanceKm.toLocaleString()} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Energy Required:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{energyRequiredKwh.toLocaleString()} kWh</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Grid Tariff:</span>
                  <strong>₹{electricityCostPerKwh}/kWh</strong>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
