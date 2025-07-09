'use client';
import { useState } from 'react';

export default function SegmentForm({ segmentNumber, segmentName }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [modules, setModules] = useState({
    gl: false,
    ar: false,
    ap: false,
    fa: false,
    cost: false,
    cash: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code,
      name,
      active,
      ...modules
    };

    // ✅ Dynamic API path
    const apiSegmentName = segmentName.toLowerCase().replace(/\s+/g, '_')
    const apiPath = `/api/segment${segmentNumber}_${apiSegmentName}`

    try {
      const res = await fetch(`http://localhost:5000${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('✅ Added:', data);

    } catch (err) {
      console.error('❌ Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
      <h3 style={{ marginBottom: '12px' }}>Add New - {segmentName}</h3>

      <div style={{ marginBottom: '8px' }}>
        <label>Code:</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>Active:</label>
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Modules:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.keys(modules).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={modules[key]}
                onChange={() =>
                  setModules((prev) => ({ ...prev, [key]: !prev[key] }))
                }
              />
              {key.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <button type="submit">Save</button>
    </form>
  );
}
