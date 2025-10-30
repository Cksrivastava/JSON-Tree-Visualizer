import React, { useState, useRef } from 'react';
import JsonInput from './components/JsonInput';
import TreeVisualizer from './components/TreeVisualizer';
import './styles/index.css';

export default function App() {
  const [jsonData, setJsonData] = useState(null);
  const [search, setSearch] = useState('');
  const highlightedRef = useRef(null);

  const handleVisualize = (json) => {
    setJsonData(json);
  };

  const handleNodeClick = (node) => {
    const p = node?.data?.path;
    if (p) {
      navigator.clipboard?.writeText(p).then(()=>{
        alert('Copied path: ' + p);
      }).catch(()=>{});
    }
  };

  const handleSearch = () => {
    if (!search) return;
    highlightedRef.current = search.trim();
    setJsonData(js => js ? {...js} : js);
  };

  return (
    <div className="container">
      <JsonInput onVisualize={handleVisualize} />
      <div className="right">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0}}>JSON Tree Visualizer</h2>
          <div style={{display:'flex', gap:8}}>
            <input className="search-input" placeholder="Search path e.g. $.user.address.city" value={search} onChange={e=>setSearch(e.target.value)} />
            <button className="btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div style={{height:16}} />
        <TreeVisualizer jsonData={jsonData} highlightPath={highlightedRef.current} onNodeClick={handleNodeClick} />
      </div>
    </div>
  );
}
