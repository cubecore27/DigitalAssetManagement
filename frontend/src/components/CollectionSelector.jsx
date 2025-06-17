import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RetractableSearchBar from '../components/RetractableSearchBar';

export default function CollectionSelector() {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://192.168.100.6:2000/collection/collections/')
      .then(res => res.json())
      .then(data => {
        // Normalize asset_count from assets[]
        const normalized = data.map(col => ({
          ...col,
          asset_count: Array.isArray(col.assets) ? col.assets.length : 0
        }));
        setCollections(normalized);
      })
      .catch(err => console.error('Failed to fetch collections:', err));
  }, []);

  return (
    <div style={{ width: '100%' }}>

      <div style={{
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}>
        {collections.map(col => (
          <div
            key={col.id}
            onClick={() => navigate(`/collections/${col.id}`)}
            style={{
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: col.color_hex || '#e0e0e0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              width: '200px'
            }}
          >
            <strong>{col.name}</strong>
            <p style={{ fontSize: '0.9rem' }}>{col.description}</p>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>
              {col.asset_count} asset{col.asset_count !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
