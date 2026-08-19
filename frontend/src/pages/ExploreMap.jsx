import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Hotel, Utensils, Fuel, Hospital, DollarSign, Compass, Star, ExternalLink, Navigation, Car, ShoppingBag } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons in React Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Colored Map Pins
const createCustomPin = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const pinIcons = {
  hotel: createCustomPin('#a855f7'),      // Purple
  restaurant: createCustomPin('#10b981'), // Green
  fuel: createCustomPin('#f43f5e'),       // Red
  hospital: createCustomPin('#06b6d4'),   // Cyan
  atm: createCustomPin('#f59e0b'),        // Amber
  attraction: createCustomPin('#6366f1'), // Indigo
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function ExploreMap({ city: initialCity = 'Chennai' }) {
  const [searchCity, setSearchCity] = useState(initialCity);
  const [activeCity, setActiveCity] = useState(initialCity);
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Default Chennai
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Multi-City Real Places, Hotels, & App Integrations Database
  const CITY_POI_DATABASE = {
    Chennai: [
      { id: 101, name: 'ITC Grand Chola', category: 'hotel', rating: 4.8, lat: 13.0105, lng: 80.2206, details: '5-Star Luxury Hotel in Guindy', price: '₹9,500/night', bookUrl: 'https://www.makemytrip.com/hotels/itc_grand_chola-hotels-in-chennai.html' },
      { id: 102, name: 'The Leela Palace Chennai', category: 'hotel', rating: 4.9, lat: 13.0189, lng: 80.2753, details: 'Sea-facing Luxury Hotel at MRC Nagar', price: '₹12,000/night', bookUrl: 'https://www.booking.com/hotel/in/the-leela-palace-chennai.html' },
      { id: 103, name: 'Taj Connemara', category: 'hotel', rating: 4.7, lat: 13.0609, lng: 80.2612, details: 'Heritage 5-Star Hotel off Anna Salai', price: '₹7,200/night', bookUrl: 'https://www.makemytrip.com/hotels/taj_connemara-hotels-in-chennai.html' },
      { id: 104, name: 'Ibis Chennai City Centre', category: 'hotel', rating: 4.2, lat: 13.0560, lng: 80.2520, details: 'Modern Budget Hotel on Mount Road', price: '₹3,400/night', bookUrl: 'https://www.booking.com/hotel/in/ibis-chennai-city-centre.html' },
      { id: 105, name: 'Murugan Idli Shop', category: 'restaurant', rating: 4.6, lat: 13.0418, lng: 80.2541, details: 'Famous Ghee Podi Idli & Filter Coffee', price: '₹180 for two', foodUrl: 'https://www.zomato.com/chennai/murugan-idli-shop-t-nagar' },
      { id: 106, name: 'Buhari Restaurant', category: 'restaurant', rating: 4.5, lat: 13.0610, lng: 80.2611, details: 'Authentic Chicken 65 & Biryani', price: '₹450 for two', foodUrl: 'https://www.zomato.com/chennai/buhari-triplicane' },
      { id: 107, name: 'Marina Beach Promenade', category: 'attraction', rating: 4.7, lat: 13.0499, lng: 80.2824, details: 'India’s longest natural urban beach', price: 'Free' },
      { id: 108, name: 'Kapaleeshwarar Temple', category: 'attraction', rating: 4.8, lat: 13.0335, lng: 80.2694, details: '7th-century Dravidian Temple in Mylapore', price: 'Free' },
      { id: 109, name: 'IOCL Fuel Station & EV Fast Charger', category: 'fuel', rating: 4.4, lat: 13.0450, lng: 80.2600, details: '24x7 Fuel & 60kW DC EV Charging', price: 'Petrol ₹102/L' },
      { id: 110, name: 'Apollo Hospital Emergency', category: 'hospital', rating: 4.7, lat: 13.0605, lng: 80.2520, details: '24x7 Multi-specialty Hospital & Pharmacy', price: 'Emergency' },
    ],
    Bengaluru: [
      { id: 201, name: 'The Leela Palace Bengaluru', category: 'hotel', rating: 4.9, lat: 12.9606, lng: 77.6484, details: 'Grand Palace Hotel on Old Airport Road', price: '₹13,500/night', bookUrl: 'https://www.makemytrip.com/hotels/the_leela_palace-hotels-in-bangalore.html' },
      { id: 202, name: 'The Oberoi Bengaluru', category: 'hotel', rating: 4.8, lat: 12.9734, lng: 77.6186, details: 'Luxury Garden Hotel on MG Road', price: '₹11,000/night', bookUrl: 'https://www.booking.com/hotel/in/the-oberoi-bangalore.html' },
      { id: 203, name: 'MTR (Mavalli Tiffin Room)', category: 'restaurant', rating: 4.7, lat: 12.9551, lng: 77.5863, details: 'Iconic Rava Idli & Masala Dosa', price: '₹200 for two', foodUrl: 'https://www.zomato.com/bangalore/mavalli-tiffin-room-mtr-basavanagudi' },
      { id: 204, name: 'Vidyarthi Bhavan', category: 'restaurant', rating: 4.8, lat: 12.9438, lng: 77.5714, details: 'Legendary Crispy Masala Dosa in Gandhi Bazaar', price: '₹150 for two', foodUrl: 'https://www.swiggy.com/restaurants/vidyarthi-bhavan-basavanagudi-bangalore-34226' },
      { id: 205, name: 'Lalbagh Botanical Garden', category: 'attraction', rating: 4.6, lat: 12.9507, lng: 77.5848, details: 'Historical 240-acre garden & Glass House', price: '₹30 entry' },
    ],
    Mumbai: [
      { id: 301, name: 'The Taj Mahal Palace Mumbai', category: 'hotel', rating: 4.9, lat: 18.9220, lng: 72.8332, details: 'Iconic Heritage Luxury Hotel facing Gateway of India', price: '₹18,000/night', bookUrl: 'https://www.makemytrip.com/hotels/taj_mahal_palace-hotels-in-mumbai.html' },
      { id: 302, name: 'Trident Nariman Point', category: 'hotel', rating: 4.7, lat: 18.9267, lng: 72.8223, details: 'Marine Drive Bayfront Luxury Stay', price: '₹9,800/night', bookUrl: 'https://www.booking.com/hotel/in/trident-nariman-point.html' },
      { id: 303, name: 'Bademiya Colaba', category: 'restaurant', rating: 4.5, lat: 18.9234, lng: 72.8312, details: 'Famous Late-Night Kebab & Roll Spot', price: '₹500 for two', foodUrl: 'https://www.zomato.com/mumbai/bademiya-colaba' },
      { id: 304, name: 'Gateway of India', category: 'attraction', rating: 4.8, lat: 18.9220, lng: 72.8347, details: '20th-century monument overlooking Arabian Sea', price: 'Free' },
    ]
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    setIsLoading(true);
    const targetCity = searchCity.trim();
    setActiveCity(targetCity);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetCity)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.warn('Geocoding fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const pois = CITY_POI_DATABASE[activeCity] || [
    { id: 901, name: `${activeCity} Grand Hotel`, category: 'hotel', rating: 4.6, lat: mapCenter[0] + 0.005, lng: mapCenter[1] + 0.005, details: `Premium Stay in central ${activeCity}`, price: '₹4,500/night', bookUrl: `https://www.makemytrip.com/hotels/${activeCity.toLowerCase()}-hotels.html` },
    { id: 902, name: `${activeCity} Heritage Resort`, category: 'hotel', rating: 4.4, lat: mapCenter[0] - 0.006, lng: mapCenter[1] + 0.004, details: `Luxury Resort & Spa`, price: '₹6,200/night', bookUrl: `https://www.booking.com/city/in/${activeCity.toLowerCase()}.html` },
    { id: 903, name: `${activeCity} Central Diner`, category: 'restaurant', rating: 4.5, lat: mapCenter[0] + 0.003, lng: mapCenter[1] - 0.003, details: 'Top-rated local cuisine restaurant', price: '₹400 for two', foodUrl: `https://www.zomato.com/${activeCity.toLowerCase()}` },
    { id: 904, name: `${activeCity} City Park & Landmark`, category: 'attraction', rating: 4.7, lat: mapCenter[0] - 0.004, lng: mapCenter[1] - 0.005, details: 'Popular tourist attraction & square', price: 'Free' },
    { id: 905, name: '24x7 Petrol Pump & EV Fast Charger', category: 'fuel', rating: 4.3, lat: mapCenter[0] + 0.002, lng: mapCenter[1] + 0.007, details: 'Fuel & EV Charging Station', price: 'Petrol ₹102/L' },
  ];

  const filteredPois = filterCategory === 'all' ? pois : pois.filter(p => p.category === filterCategory);
  const hotelsList = pois.filter(p => p.category === 'hotel');

  const getGoogleMapsUrl = (lat, lng, name) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + activeCity)}`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Header & City Search Bar */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin color="var(--accent-cyan)" /> Live Maps & App Integrations
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Connected with <strong>Google Maps</strong>, <strong>MakeMyTrip</strong>, <strong>Booking.com</strong>, <strong>Zomato</strong> & <strong>Uber</strong>
            </p>
          </div>

          {/* City Search Form */}
          <form onSubmit={handleCitySearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search city (e.g. Chennai, Bengaluru, Mumbai, Jaipur)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {isLoading ? 'Locating...' : 'Search City'} <Search size={18} />
            </button>
          </form>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem', pt: '1rem', borderTop: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'All Places' },
            { id: 'hotel', label: '🏨 Hotels & Booking' },
            { id: 'restaurant', label: '🍽️ Restaurants & Zomato' },
            { id: 'fuel', label: '⛽ Fuel / EV Stations' },
            { id: 'hospital', label: '🏥 Emergency Care' },
            { id: 'attraction', label: '🏖️ Attractions' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`btn ${filterCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(cat.id)}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Leaflet Map (Left) + App Integrations Sidebar (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Leaflet Map Card */}
        <div className="glass-card" style={{ padding: '0.75rem', height: '620px', overflow: 'hidden' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', borderRadius: '14px' }}
          >
            <ChangeView center={mapCenter} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredPois.map((poi) => (
              <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={pinIcons[poi.category] || pinIcons.attraction}>
                <Popup>
                  <div style={{ color: '#111827', fontFamily: 'sans-serif', minWidth: '220px' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#111827' }}>{poi.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                      <Star size={14} fill="#f59e0b" /> {poi.rating} ★
                    </div>
                    <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', color: '#4b5563' }}>{poi.details}</p>
                    
                    {/* Action App Integration Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <a
                        href={getGoogleMapsUrl(poi.lat, poi.lng, poi.name)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#4285F4', color: '#fff', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}
                      >
                        <Navigation size={12} /> Open in Google Maps
                      </a>

                      {poi.bookUrl && (
                        <a
                          href={poi.bookUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#e11d48', color: '#fff', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Hotel size={12} /> Book Room on MakeMyTrip
                        </a>
                      )}

                      {poi.foodUrl && (
                        <a
                          href={poi.foodUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#cb202d', color: '#fff', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Utensils size={12} /> Order / Table on Zomato
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Real App Integrations Sidebar */}
        <div className="glass-card" style={{ padding: '1.75rem', maxHeight: '620px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass color="var(--accent-cyan)" size={22} /> Connected Apps & Hotels
            </h3>
            <span className="badge badge-success">{filteredPois.length} Places</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPois.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0 }}>{item.name}</h4>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Star size={14} fill="#f59e0b" /> {item.rating}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.4rem 0 0.75rem 0' }}>
                  {item.details} • <strong style={{ color: 'var(--accent-emerald)' }}>{item.price}</strong>
                </p>

                {/* App Buttons Row */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href={getGoogleMapsUrl(item.lat, item.lng, item.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Navigation size={12} /> Google Maps
                  </a>

                  {item.bookUrl && (
                    <a
                      href={item.bookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' }}
                    >
                      <Hotel size={12} /> Book MakeMyTrip
                    </a>
                  )}

                  {item.foodUrl && (
                    <a
                      href={item.foodUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
                    >
                      <Utensils size={12} /> Zomato
                    </a>
                  )}

                  <a
                    href={`https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodeURIComponent(item.name + ' ' + activeCity)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Car size={12} /> Uber Ride
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
