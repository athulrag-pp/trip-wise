import React, { useState } from 'react';
import { Sparkles, ArrowRight, Bot, Compass, CheckCircle2 } from 'lucide-react';
import { predictExpense } from '../services/api';

export default function AIPromptPlanner({ onPlanGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setAiOutput(null);

    // Simulate AI parsing + ML prediction execution
    setTimeout(async () => {
      const budgetMatch = prompt.match(/(?:₹|rs\.?|inr)?\s*(\d{3,6})/i);
      const budget = budgetMatch ? parseFloat(budgetMatch[1]) : 1500;

      let city = 'Chennai';
      const cities = ['chennai', 'bengaluru', 'mumbai', 'delhi', 'jaipur', 'kochi', 'hyderabad', 'goa'];
      for (const c of cities) {
        if (prompt.toLowerCase().includes(c)) {
          city = c.charAt(0).toUpperCase() + c.slice(1);
          break;
        }
      }

      const result = await predictExpense({
        city: city,
        dailyBudget: budget,
        vehicleName: prompt.toLowerCase().includes('car') ? 'Swift Dzire Petrol' : 'Royal Enfield Classic 350',
        distanceKm: 60,
        mileageKmpl: 35,
        foodPreference: prompt.toLowerCase().includes('non') ? 'non_veg' : 'veg',
        activities: ['sightseeing', 'beach', 'cafe']
      });

      setAiOutput({
        city: city,
        budget: budget,
        predictedExpense: result.predictedExpense,
        status: result.budgetStatus,
        result: result,
        plan: `🌟 **TripWise AI Smart Itinerary for ${city}**\n\n` +
          `• **Morning (08:30 AM)**: Start with breakfast at a top-rated local eatery (Est. ₹${Math.round(result.breakdown.food * 0.25)}).\n` +
          `• **Sightseeing (10:00 AM)**: Explore major heritage spots and scenic promenades (Est. fuel: ₹${result.breakdown.fuel}).\n` +
          `• **Lunch (01:00 PM)**: Enjoy a delicious lunch meal respecting your food preferences (Est. ₹${Math.round(result.breakdown.food * 0.45)}).\n` +
          `• **Afternoon Activity (03:30 PM)**: Visit cultural centers or local shopping markets.\n` +
          `• **Dinner & Return (08:30 PM)**: Conclude with dinner and safe return (Est. ₹${Math.round(result.breakdown.food * 0.30)}).\n\n` +
          `💰 **Total Predicted Cost**: ₹${result.predictedExpense} vs Your Target Budget: ₹${budget} (${result.budgetStatus.toUpperCase()})`
      });

      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem', background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(99,102,241,0.12) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: 'var(--gradient-hero)', padding: '0.5rem', borderRadius: '12px', color: '#fff' }}>
          <Bot size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>AI Natural Language Trip Planner</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type your trip in plain English (e.g. "I have ₹1500 and I'm visiting Chennai for one day by bike")</p>
        </div>
      </div>

      <form onSubmit={handleAISubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="e.g., I have ₹1500 and visiting Bengaluru by car with 3 attractions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field"
          style={{ flex: 1, minWidth: '280px' }}
        />
        <button type="submit" disabled={isGenerating} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          {isGenerating ? '🤖 AI Processing...' : 'Generate AI Plan'} <Sparkles size={18} />
        </button>
      </form>

      {aiOutput && (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(11,15,25,0.8)', borderRadius: '14px', border: '1px solid var(--border-highlight)' }}>
          <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: '#f3f4f6', lineHeight: 1.7 }}>
            {aiOutput.plan}
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => onPlanGenerated(aiOutput.result)} style={{ fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> View Full Breakdown Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
