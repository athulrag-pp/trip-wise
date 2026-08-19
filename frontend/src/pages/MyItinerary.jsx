import React from 'react';
import { Clock, MapPin, Utensils, Compass, Coffee, Moon, CheckCircle2, Navigation, Search, ExternalLink } from 'lucide-react';

export default function MyItinerary({ predictionResult }) {
  const city = predictionResult?.city || 'Chennai';

  const defaultTimeline = [
    { time: '08:30 AM', title: 'Breakfast & Morning Coffee', type: 'food', spot: 'Murugan Idli Shop', estCost: 150, details: 'Traditional South Indian breakfast (Idli, Vada, Filter Coffee)' },
    { time: '10:00 AM', title: 'Morning Sightseeing', type: 'spot', spot: 'Marina Beach Promenade', estCost: 50, details: 'Walk along India’s longest natural urban beach' },
    { time: '01:00 PM', title: 'Lunch Meal', type: 'food', spot: 'Buhari Restaurant', estCost: 350, details: 'Signature Chicken 65 & Biryani' },
    { time: '03:00 PM', title: 'Culture & Shopping', type: 'spot', spot: 'Kapaleeshwarar Temple & T. Nagar', estCost: 200, details: 'Explore heritage architecture & local shopping bazaar' },
    { time: '06:00 PM', title: 'Sunset Cafe Hopping', type: 'cafe', spot: 'Amethyst Cafe', estCost: 250, details: 'Garden cafe coffee & pastries' },
    { time: '08:30 PM', title: 'Dinner & Relaxation', type: 'food', spot: 'Savya Rasa Fine Dining', estCost: 400, details: 'Authentic South Indian multi-course dinner' },
    { time: '10:00 PM', title: 'Return Journey', type: 'return', spot: 'Accommodation / Home', estCost: 0, details: 'End of day trip schedule' },
  ];

  const getGoogleSearchUrl = (spotName) => {
    return `https://www.google.com/search?q=${encodeURIComponent(spotName + ' ' + city)}`;
  };

  const getGoogleMapsUrl = (spotName) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotName + ' ' + city)}`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem', borderRadius: '14px', color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>
          <Clock size={32} />
        </div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Your Personalized Daily Itinerary</h1>
        <p style={{ color: 'var(--text-muted)' }}>Auto-generated timeline schedule connected with Google Search & Navigation for <strong>{city}</strong></p>
      </div>

      {/* Timeline List */}
      <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
        {/* Vertical Connecting Line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '15px',
          bottom: '15px',
          width: '3px',
          background: 'var(--gradient-hero)'
        }} />

        {defaultTimeline.map((item, index) => (
          <div key={index} style={{ position: 'relative', marginBottom: '2rem' }}>
            {/* Timeline Node Icon */}
            <div style={{
              position: 'absolute',
              left: '-2.5rem',
              top: '0',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#111827',
              border: '2px solid var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              zIndex: 2
            }}>
              {item.type === 'food' && <Utensils size={18} />}
              {item.type === 'spot' && <Compass size={18} />}
              {item.type === 'cafe' && <Coffee size={18} />}
              {item.type === 'return' && <Moon size={18} />}
            </div>

            {/* Timeline Card Content */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {item.time}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  Est. ₹{item.estCost}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.25rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📍 <strong>{item.spot}</strong></p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>{item.details}</p>

              {/* Direct Web Browser Search & Navigation Links */}
              {item.type !== 'return' && (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a
                    href={getGoogleSearchUrl(item.spot)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Search size={12} /> Search on Google
                  </a>

                  <a
                    href={getGoogleMapsUrl(item.spot)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Navigation size={12} /> Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
