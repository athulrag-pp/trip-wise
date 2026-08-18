import React, { useState } from 'react';
import { Fuel, Zap, Calculator, RefreshCw } from 'lucide-react';

export default function VehicleCalculator() {
  const [vehicleType, setVehicleType] = useState('petrol_bike');
  const [distanceKm, setDistanceKm] = useState(60);
  const [mileageKmpl, setMileageKmpl] = useState(35);
  const [fuelPricePerL, setFuelPricePerL] = useState(102);

  // EV fields
  const [evConsumptionPerKm, setEvConsumptionPerKm] = useState(0.12); // kWh/km
  const [electricityCostPerKwh, setElectricityCostPerKwh] = useState(8.5); // ₹/kWh

  // Calculations
  const isEV = vehicleType === 'ev';
  
  // Fuel Math: Fuel Required = Distance / Mileage; Fuel Cost = Fuel Required * Price
  const fuelRequiredLiters = !isEV && mileageKmpl > 0 ? (distanceKm / mileageKmpl).toFixed(2) : 0;
  const fuelCostInr = !isEV ? Math.round(fuelRequiredLiters * fuelPricePerL) : 0;

  // EV Math: Energy Required = Distance * Consumption; Charging Cost = Energy * Electricity Cost
  const energyRequiredKwh = isEV ? (distanceKm * evConsumptionPerKm).toFixed(2) : 0;
  const evChargingCostInr = isEV ? Math.round(energyRequiredKwh * electricityCostPerKwh) : 0;

  const totalCost = isEV ? evChargingCostInr : fuelCostInr;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '14px', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
          <Calculator size={32} />
        </div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Vehicle Cost & Fuel Calculator</h1>
        <p style={{ color: 'var(--text-muted)' }}>Calculate exact fuel or electric charging expenses for any trip distance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Form Controls */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Trip Parameters</h3>

          <div className="input-group">
            <label className="input-label">Vehicle Powertrain Type</label>
            <select
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="petrol_bike">Petrol Motorcycle / Scooter</option>
              <option value="petrol_car">Petrol / Diesel Car</option>
              <option value="ev">Electric Vehicle (EV Bike / Car)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Trip Distance (km): {distanceKm} km</label>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              style={{ width: '100%', margin: '0.5rem 0' }}
            />
          </div>

          {!isEV ? (
            <>
              <div className="input-group">
                <label className="input-label">Vehicle Mileage (km/L)</label>
                <input
                  type="number"
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
                  value={evConsumptionPerKm}
                  onChange={(e) => setEvConsumptionPerKm(parseFloat(e.target.value) || 0.1)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Electricity Cost (₹ / kWh)</label>
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
          background: 'linear-gradient(180deg, rgba(17,24,39,0.9) 0%, rgba(99,102,241,0.1) 100%)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Fuel / Energy Cost
            </span>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.5rem 0' }}>
              ₹{totalCost.toLocaleString()}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem',
            lineHeight: 1.7
          }}>
            {!isEV ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Distance:</span>
                  <strong>{distanceKm} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Mileage:</span>
                  <strong>{mileageKmpl} km/L</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fuel Required:</span>
                  <strong style={{ color: 'var(--accent-rose)' }}>{fuelRequiredLiters} Liters</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fuel Rate:</span>
                  <strong>₹{fuelPricePerL}/L</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Distance:</span>
                  <strong>{distanceKm} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Energy Required:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{energyRequiredKwh} kWh</strong>
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
