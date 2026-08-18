import React from 'react';
import { Heart, Code2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(11, 15, 25, 0.95)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span>TripWise AI & ML Portfolio Project</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-cyan)' }}>
            <Code2 size={16} /> B.Tech AI & Data Science
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '600px' }}>
          Predicting travel costs, vehicle fuel math, localized recommendations, and AI smart itinerary generation. Built with React, FastAPI, Scikit-Learn, and OpenStreetMap.
        </p>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          &copy; {new Date().getFullYear()} TripWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
