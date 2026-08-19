import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Fuel, Map, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import AIPromptPlanner from '../components/AIPromptPlanner';

export default function Home({ onStartPlanning, onExploreCalc, onPlanSubmit }) {
  const [quickCity, setQuickCity] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    onStartPlanning(quickCity || 'Chennai');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 1.5rem 4rem 1.5rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> ML-Powered Travel Intelligence
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Know what your day will cost <br />
          <span style={{
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            before you step out.
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          Planning a trip to an unfamiliar city? TripWise uses Machine Learning, vehicle mileage mathematics, and smart recommendations to forecast exact costs and auto-generate your perfect daily schedule.
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleStart} style={{
          display: 'flex',
          gap: '0.75rem',
          maxWidth: '540px',
          margin: '0 auto 3rem auto',
          background: 'rgba(17, 24, 39, 0.8)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <input
            type="text"
            placeholder="Enter destination (e.g., Chennai, Bengaluru)..."
            value={quickCity}
            onChange={(e) => setQuickCity(e.target.value)}
            className="input-field"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '0.75rem 1rem'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Start Planning <ArrowRight size={18} />
          </button>
        </form>

        {/* Highlight Stats Pill */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>6 Categories</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Food, Fuel, Transit, Stay, Activities & Misc</p>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>±5% Accuracy</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ML Regression Expense Predictor</p>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-amber)', fontWeight: 800 }}>100% Free</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OpenStreetMap & Open GIS APIs</p>
          </div>
        </div>

        {/* AI Prompt Planner Section */}
        {onPlanSubmit && (
          <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
            <AIPromptPlanner onPlanGenerated={onPlanSubmit} />
          </div>
        )}
      </section>

      {/* Feature Cards Grid */}
      <section style={{ maxWidth: '1100px', margin: '3rem auto 0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#ffffff' }}>
          Built for Travelers & Smart Planners
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Card 1 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '1.75rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>ML Expense Predictor</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Trained regression algorithms predict your expected daily expense range based on trip parameters and budget targets.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-interactive" onClick={onExploreCalc} style={{ padding: '1.75rem' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Fuel size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Fuel & EV Calculator</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Exact fuel math based on bike/car mileage (km/L) and local fuel prices, with extensible EV charging support.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '1.75rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Map size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Interactive GIS Map</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Locate restaurants, hotels, fuel pumps, EV stations, ATMs, and emergency hospitals using OpenStreetMap.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '1.75rem' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Timeline Itinerary</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Auto-generate a step-by-step daily timeline schedule (breakfast, spots, lunch, activities, dinner, return).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
