import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CheckCircle, AlertTriangle, Fuel, Utensils, Compass, Hotel, DollarSign, MapPin } from 'lucide-react';

export default function PredictionDashboard({ predictionResult, onExploreMap, onGenerateItinerary }) {
  if (!predictionResult) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
        No prediction data available. Please fill out the <strong>Plan My Day</strong> form first.
      </div>
    );
  }

  const {
    city,
    dailyBudget,
    predictedExpense,
    minExpense,
    maxExpense,
    breakdown,
    budgetStatus,
    vehicleDetails
  } = predictionResult;

  const isSufficient = budgetStatus === 'sufficient';
  const remainingBudget = dailyBudget - predictedExpense;

  const chartData = [
    { name: 'Food', cost: breakdown.food, color: '#10b981' },
    { name: 'Fuel', cost: breakdown.fuel, color: '#f43f5e' },
    { name: 'Local Travel', cost: breakdown.localTravel, color: '#f59e0b' },
    { name: 'Activities', cost: breakdown.activities, color: '#6366f1' },
    { name: 'Misc', cost: breakdown.misc, color: '#06b6d4' },
    { name: 'Accommodation', cost: breakdown.accommodation, color: '#a855f7' },
  ].filter(item => item.cost > 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Top Banner Status */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isSufficient ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
        border: `1px solid ${isSufficient ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
        padding: '1.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isSufficient ? (
            <CheckCircle size={40} color="var(--accent-emerald)" />
          ) : (
            <AlertTriangle size={40} color="var(--accent-rose)" />
          )}
          <div>
            <div className={`badge ${isSufficient ? 'badge-success' : 'badge-warning'}`}>
              {isSufficient ? '🟢 Budget Sufficient' : '🔴 Budget May Not Be Sufficient'}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginTop: '0.25rem' }}>
              {isSufficient 
                ? `You have ₹${Math.abs(remainingBudget).toLocaleString()} cushion remaining` 
                : `Shortfall of approximately ₹${Math.abs(remainingBudget).toLocaleString()}`}
            </h2>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Budget</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ₹{dailyBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Prediction & Breakdown Table */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.25rem' }}>
            Estimated Daily Expense
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Destination: <strong style={{ color: '#ffffff' }}>{city}</strong>
          </p>

          {/* Large Price Range Display */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid var(--accent-primary)',
            padding: '1.5rem',
            borderRadius: '16px',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Predicted Expense Range
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>
              ₹{minExpense.toLocaleString()} – ₹{maxExpense.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
              Expected Mean: ₹{predictedExpense.toLocaleString()}
            </span>
          </div>

          {/* Itemized Category Breakdown Table */}
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem' }}>Category Breakdown</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0' }}>Category</th>
                <th style={{ padding: '0.6rem 0', textAlign: 'right' }}>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.color }} />
                    {row.name}
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, color: '#ffffff' }}>
                    ₹{row.cost.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border-highlight)', fontWeight: 800, fontSize: '1rem' }}>
                <td style={{ padding: '0.85rem 0', color: 'var(--accent-cyan)' }}>Total Predicted</td>
                <td style={{ padding: '0.85rem 0', textAlign: 'right', color: 'var(--accent-cyan)' }}>
                  ₹{predictedExpense.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Interactive Charts & Vehicle Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Chart Container */}
          <div className="glass-card" style={{ padding: '2rem', height: '320px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>Cost Distribution</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="cost"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Cost']}
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Fuel Math Card */}
          {vehicleDetails && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-rose)', marginBottom: '0.75rem' }}>
                <Fuel size={20} />
                <h4 style={{ color: '#ffffff', margin: 0 }}>Vehicle Fuel Math Summary</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                🚗 <strong>{vehicleDetails.vehicleName}</strong> • {vehicleDetails.distanceKm} km travel distance @ {vehicleDetails.mileageKmpl} km/L mileage.
                <br />
                ⛽ Fuel Required: <strong>{vehicleDetails.fuelRequiredLiters} Liters</strong> @ ₹102/L = <strong>₹{breakdown.fuel}</strong>.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={onExploreMap} style={{ padding: '0.9rem' }}>
              <MapPin size={18} /> View Nearby Map
            </button>
            <button className="btn btn-primary" onClick={onGenerateItinerary} style={{ padding: '0.9rem' }}>
              <Compass size={18} /> Generate Timeline
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
