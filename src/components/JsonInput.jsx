import React, { useState } from 'react';

export default function JsonInput({ onVisualize }) {
  const [text, setText] = useState(`{
  "user": {
    "id": 1,
    "name": "John",
    "address": { "city": "New York", "country": "USA" },
    "items": [
      { "name": "Book" },
      { "name": "Pen" }
    ]
  }
}`);
  const [error, setError] = useState(null);

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onVisualize(parsed);
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      onVisualize(null);
    }
  };

  const handleClear = () => {
    setText('');
    setError(null);
    onVisualize(null);
  };

  return (
    <div className="left">
      <div className="header">
        <h2 style={{margin:0}}>JSON Input</h2>
      </div>
      <textarea className="json-input" value={text} onChange={e=>setText(e.target.value)} />
      {error && <div style={{color:'#ef4444',marginTop:8}}>{error}</div>}
      <div className="footer-actions">
        <button className="btn" onClick={handleVisualize}>Generate Tree</button>
        <button className="btn" onClick={handleClear} style={{background:'#ef4444'}}>Clear</button>
      </div>
      </div>
  );
}
