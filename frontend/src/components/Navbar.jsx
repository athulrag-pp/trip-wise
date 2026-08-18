import React from 'react';
import { Compass, MapPin, Calculator, Map, Calendar, Home as HomeIcon } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'plan', label: 'Plan My Day', icon: MapPin },
    { id: 'calc', label: 'Vehicle Calculator', icon: Calculator },
    { id: 'explore', label: 'Explore Map', icon: Map },
    { id: 'itinerary', label: 'My Itinerary', icon: Calendar },
  ];

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'var(--gradient-hero)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Compass size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TripWise
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Smart Trip Planner & ML Predictor
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="btn"
                style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.875rem'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
