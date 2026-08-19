import React, { useState } from 'react';
import { MapPin, Hotel, Utensils, Car, Compass, IndianRupee, ArrowRight, ArrowLeft, CheckCircle2, Fuel, Navigation } from 'lucide-react';

export default function PlanMyDay({ initialCity, onSubmitPlan }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    originCity: 'Chennai',
    city: initialCity || 'Kanyakumari',
    needsHotel: false,
    hotelBudget: 1200,
    hotelRating: 4.0,
    foodPreference: 'non_veg',
    foodBudgetTier: 'mid_range',
    transportType: 'personal_vehicle',
    vehicleType: 'bike',
    vehicleName: 'Royal Enfield Classic 350',
    distanceKm: 700, // Updated max up to 50000 km
    mileageKmpl: 35,
    activities: ['sightseeing', 'beach', 'cafe'],
    dailyBudget: 2500,
    peopleCount: 1,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleActivityToggle = (act) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(act);
      if (exists) {
        return { ...prev, activities: prev.activities.filter((a) => a !== act) };
      } else {
        return { ...prev, activities: [...prev.activities, act] };
      }
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPlan(formData);
  };

  const vehicleOptions = [
    { name: 'Royal Enfield Classic 350 (Bike)', type: 'bike', mileage: 35 },
    { name: 'Honda Activa 6G (Scooter)', type: 'scooter', mileage: 45 },
    { name: 'Bajaj Pulsar 150 (Bike)', type: 'bike', mileage: 48 },
    { name: 'Swift Dzire Petrol (Car)', type: 'car', mileage: 18.5 },
    { name: 'Hyundai i20 Petrol (Car)', type: 'car', mileage: 16 },
    { name: 'TVS Jupiter (Scooter)', type: 'scooter', mileage: 46 },
    { name: 'Tata Nexon EV (Car)', type: 'ev', mileage: 0.15 },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Progress Bar Header */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            STEP {currentStep} OF 8
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {Math.round((currentStep / 8) * 100)}% Completed
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(currentStep / 8) * 100}%`,
            background: 'var(--gradient-hero)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Wizard Form Card */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Step 1: Origin & Destination */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                <MapPin size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Starting Location & Destination</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enter your origin city and target destination</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Starting Point / Origin City</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.originCity}
                onChange={(e) => updateField('originCity', e.target.value)}
                placeholder="e.g. Chennai, Mumbai, Delhi, Hyderabad"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Destination City</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Kanyakumari, Bengaluru, Goa, Jaipur"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Number of Travelers</label>
              <input
                type="number"
                min="1"
                max="20"
                className="input-field"
                value={formData.peopleCount}
                onChange={(e) => updateField('peopleCount', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Accommodation */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
                <Hotel size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Accommodation Needs</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Do you require a hotel room for your stay?</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                className={`btn ${!formData.needsHotel ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateField('needsHotel', false)}
                style={{ padding: '1rem' }}
              >
                Already Have Accommodation
              </button>
              <button
                type="button"
                className={`btn ${formData.needsHotel ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateField('needsHotel', true)}
                style={{ padding: '1rem' }}
              >
                Need Hotel Accommodation
              </button>
            </div>

            {formData.needsHotel && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Nightly Hotel Budget (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    className="input-field"
                    value={formData.hotelBudget}
                    onChange={(e) => updateField('hotelBudget', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Preferred Rating</label>
                  <select
                    className="select-field"
                    value={formData.hotelRating}
                    onChange={(e) => updateField('hotelRating', parseFloat(e.target.value))}
                  >
                    <option value={3.5}>3.5+ Stars</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Food Preference */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
                <Utensils size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Food & Dining Preferences</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>What kind of meals do you prefer?</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Dietary Preference</label>
              <select
                className="select-field"
                value={formData.foodPreference}
                onChange={(e) => updateField('foodPreference', e.target.value)}
              >
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="fast_food">Fast Food & Street Food</option>
                <option value="local_cuisine">Local City Cuisine</option>
                <option value="cafe">Cafes & Bakeries</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Dining Pricing Tier</label>
              <select
                className="select-field"
                value={formData.foodBudgetTier}
                onChange={(e) => updateField('foodBudgetTier', e.target.value)}
              >
                <option value="budget">Budget (₹100–₹200 per meal)</option>
                <option value="mid_range">Mid-Range (₹250–₹500 per meal)</option>
                <option value="fine_dining">Fine Dining / Premium Cafes (₹750+ per meal)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Transportation */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-amber)' }}>
                <Car size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Transportation Mode</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>How will you travel on this route?</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'personal_vehicle', label: 'Personal Bike/Car' },
                { id: 'rental_vehicle', label: 'Rental Vehicle' },
                { id: 'public_transport', label: 'Public Transit (Bus/Train)' },
                { id: 'taxi', label: 'Cab / Taxi' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`btn ${formData.transportType === opt.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateField('transportType', opt.id)}
                  style={{ padding: '1rem' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Vehicle Selection */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-rose)' }}>
                <Fuel size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Vehicle Details</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Select vehicle to compute mileage & fuel expense</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Choose Vehicle from Database</label>
              <select
                className="select-field"
                value={formData.vehicleName}
                onChange={(e) => {
                  const sel = vehicleOptions.find((v) => v.name === e.target.value);
                  if (sel) {
                    setFormData((prev) => ({
                      ...prev,
                      vehicleName: sel.name,
                      vehicleType: sel.type,
                      mileageKmpl: sel.mileage
                    }));
                  }
                }}
              >
                {vehicleOptions.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} — {v.mileage} {v.type === 'ev' ? 'kWh/km' : 'km/L'}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Vehicle Mileage ({formData.vehicleType === 'ev' ? 'kWh/km' : 'km/L'})</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={formData.mileageKmpl}
                onChange={(e) => updateField('mileageKmpl', parseFloat(e.target.value) || 30)}
              />
            </div>
          </div>
        )}

        {/* Step 6: Upgraded Distance Range up to 50,000 km */}
        {currentStep === 6 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                <Navigation size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Total Route Distance</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Distance from {formData.originCity} to {formData.city}</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Route Distance:</span>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem' }}>{formData.distanceKm.toLocaleString()} km</strong>
              </label>
              <input
                type="range"
                min="5"
                max="50000"
                step="10"
                value={formData.distanceKm}
                onChange={(e) => updateField('distanceKm', parseInt(e.target.value))}
                style={{ width: '100%', margin: '1rem 0' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>5 km</span>
                <span>10,000 km</span>
                <span>50,000 km</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Activities */}
        {currentStep === 7 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
                <Compass size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Planned Activities</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Select all activities planned</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.85rem' }}>
              {[
                'sightseeing', 'shopping', 'entertainment', 'beach',
                'museum', 'adventure', 'cafe_hopping', 'temple_cultural'
              ].map((act) => {
                const selected = formData.activities.includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    className={`btn ${selected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleActivityToggle(act)}
                    style={{ padding: '0.85rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
                  >
                    {act.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 8: Daily Budget */}
        {currentStep === 8 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
                <IndianRupee size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Your Target Daily Budget</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enter how much you plan to spend (₹)</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Target Daily Budget (₹)</label>
              <input
                type="number"
                min="500"
                step="500"
                className="input-field"
                style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}
                value={formData.dailyBudget}
                onChange={(e) => updateField('dailyBudget', parseFloat(e.target.value) || 1000)}
              />
            </div>

            {/* Summary Preview */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Trip Summary</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📍 Route: <strong>{formData.originCity}</strong> $\rightarrow$ <strong>{formData.city}</strong> • 🚗 {formData.vehicleName} ({formData.distanceKm.toLocaleString()} km) • 👥 {formData.peopleCount} Traveler(s)
              </p>
            </div>
          </div>
        )}

        {/* Form Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {currentStep > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              <ArrowLeft size={18} /> Back
            </button>
          ) : <div />}

          {currentStep < 8 ? (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckCircle2 size={18} /> Calculate & Predict Expenses
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
