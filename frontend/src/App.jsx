import React, { useState, useEffect } from 'react';
import './App.css';

const daysOfWeek = [
  { id: '1', name: 'Monday' },
  { id: '2', name: 'Tuesday' },
  { id: '3', name: 'Wednesday' },
  { id: '4', name: 'Thursday' },
  { id: '5', name: 'Friday' },
  { id: '6', name: 'Saturday' },
  { id: '7', name: 'Sunday' },
];

function App() {
  const [airports, setAirports] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('https://zany-broccoli-v656954vpv6p3pqwj-3000.app.github.dev/airports')
      .then(res => res.json())
      .then(setAirports);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    const res = await fetch(
      `https://zany-broccoli-v656954vpv6p3pqwj-3000.app.github.dev/delay-chance?day_of_week=${selectedDay}&arrival_airport=${selectedAirport}`
    );
    if (res.ok) {
      setResult(await res.json());
    } else {
      setResult({ error: 'No data found' });
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#222', background: '#fff', minHeight: '100vh' }}>
      <h1>Flight Delay Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Day of Week:
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} required>
            <option value="">Select a day</option>
            {daysOfWeek.map(day => (
              <option key={day.id} value={day.id}>{day.name}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Airport:
          <select value={selectedAirport} onChange={e => setSelectedAirport(e.target.value)} required>
            <option value="">Select an airport</option>
            {airports.map(a => (
              <option key={a.airport_id} value={a.airport_id}>{a.airport_name}</option>
            ))}
          </select>
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }}>Check Delay Chance</button>
      </form>
      {result && (
        <div style={{ marginTop: '2rem' }}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <p>Delay Chance: {(result.delay_chance * 100).toFixed(2)}%</p>
              <p>Confidence: {result.confidence_percent}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
