import React, { useState, useEffect } from 'react';

function App() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Live Data
  const fetchCrops = () => {
    fetch('http://localhost:5001/api/crops')
      .then(res => res.json())
      .then(result => {
        if (result.success) setCrops(result.data);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // 2. Trigger Smart Irrigation (Fast POST Request to Backend)
  const startIrrigation = (id) => {
    fetch('http://localhost:5001/api/sensor-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropId: id, currentMoisture: 75 }) // Simulates boosting moisture to 75%
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchCrops(); // Refresh screen instantly
        }
      })
      .catch(err => console.error("Error updating sensor:", err));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#0b0f19', minHeight: '100vh', padding: '40px', color: '#ffffff' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '28px', letterSpacing: '1px' }}>⚡ ELORNA AgTech Intelligence</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '16px' }}>Founder Command Center | Real-time Soil Moisture & Irrigation Control System</p>
      </header>

      {loading ? (
        <p style={{ color: '#38bdf8' }}>Connecting to Elorna Core Sensors...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {crops.map(crop => (
            <div key={crop.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '25px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', border: '1px solid #1e293b', borderLeft: crop.status === 'Healthy' ? '5px solid #10b981' : '5px solid #ef4444' }}>
              <h2 style={{ color: '#f1f5f9', marginTop: 0, fontSize: '20px' }}>{crop.cropName}</h2>
              <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '15px' }}>
                Optimal Moisture: <strong style={{ color: '#38bdf8' }}>{crop.optimalMoisture}</strong>
              </p>
              <p style={{ fontSize: '15px', color: '#94a3b8' }}>
                Current Soil Moisture: <strong style={{ color: crop.status === 'Healthy' ? '#10b981' : '#ef4444' }}>{crop.currentMoisture}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', backgroundColor: crop.status === 'Healthy' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: crop.status === 'Healthy' ? '#10b981' : '#ef4444' }}>
                  SYSTEM: {crop.status.toUpperCase()}
                </span>
                
                {crop.status !== 'Healthy' && (
                  <button onClick={() => startIrrigation(crop.id)} style={{ backgroundColor: '#38bdf8', color: '#0b0f19', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                    Start Irrigation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
