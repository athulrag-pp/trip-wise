import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Utensils, Hotel, Fuel, Hospital, DollarSign, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom Marker Pins
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const icons = {
  restaurant: createCustomIcon('#10b981'), // Green
  hotel: createCustomIcon('#a855f7'),      // Purple
  fuel: createCustomIcon('#f43f5e'),       // Red
  hospital: createCustomIcon('#06b6d4'),   // Cyan
  atm: createCustomIcon('#f59e0b'),        // Amber
  attraction: createCustomIcon('#6366f1'), // Indigo
};

export default function ExploreMap({ city = 'Chennai' }) {
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample POI database for Chennai
  const pointsOfInterest = [
    { id: 1, name: 'Marina Beach', category: 'attraction', lat: 13.0499, lng: 80.2824, details: 'Famous long urban beach & walking promenade', price: 'Free' },
    { id: 2, name: 'Kapaleeshwarar Temple', category: 'attraction', lat: 13.0335, lng: 80.2694, details: '7th-century Dravidian architecture temple', price: 'Free' },
    { id: 3, name: 'Murugan Idli Shop', category: 'restaurant', lat: 13.0418, lng: 80.2541, details: 'Authentic South Indian Breakfast & Ghee Podi Idli', price: '₹180 for two' },
    { id: 4, name: 'Buhari Restaurant', category: 'restaurant', lat: 13.0610, lng: 80.2611, details: 'Home of original Chicken 65 & Biryani', price: '₹450 for two' },
    { id: 5, name: 'The Park Hotel Chennai', category: 'hotel', lat: 13.0560, lng: 80.2505, details: '5-star luxury hotel in city center', price: '₹4,500/night' },
    { id: 6, name: 'HP Fuel Station & EV Charger', category: 'fuel', lat: 13.0450, lng: 80.2600, details: '24x7 Petrol/Diesel & 60kW DC EV Fast Charger', price: 'Petrol ₹102/L' },
    { id: 7, name: 'Apollo Hospital Greams Road', category: 'hospital', lat: 13.0605, lng: 80.2520, details: '24x7 Emergency Care & Pharmacy', price: 'Emergency' },
    { id: 8, name: 'HDFC Bank ATM', category: 'atm', lat: 13.0480, lng: 80.2650, details: '24 Hours ATM & Cash Recycler', price: 'ATM' },
  ];

  const filteredPois = filterCategory === 'all' 
    ? pointsOfInterest 
    : pointsOfInterest.filter(p => p.category === filterCategory);

  const chennaiCenter = [13.0500, 80.2650];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Explore {city} Points of Interest</h1>
          <p style={{ color: 'var(--text-muted)' }}>Interactive OpenStreetMap showing restaurants, hotels, fuel, and essential facilities</p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {[
            { id: 'all', label: 'All Places' },
            { id: 'restaurant', label: 'Restaurants' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'fuel', label: 'Fuel / EV' },
            { id: 'hospital', label: 'Hospitals' },
            { id: 'attraction', label: 'Attractions' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`btn ${filterCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(cat.id)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Card Container */}
      <div className="glass-card" style={{ padding: '0.75rem', height: '550px', overflow: 'hidden' }}>
        <MapContainer
          center={chennaiCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: '14px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPois.map((poi) => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={icons[poi.category] || icons.attraction}>
              <Popup>
                <div style={{ color: '#111827', fontFamily: 'sans-serif' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{poi.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{poi.details}</p>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6366f1' }}>{poi.price}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
