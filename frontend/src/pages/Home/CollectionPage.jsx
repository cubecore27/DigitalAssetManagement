import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import AssetGrid from '../../components/AssetGrid';
import RetractableSearchBar from '../../components/RetractableSearchBar';

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [assets, setAssets] = useState([]);

  // Fetch collections list on load
  useEffect(() => {
    fetch('http://192.168.100.6:2000/collections/')
      .then(res => res.json())
      .then(data => setCollections(data));
  }, []);

  // Fetch assets when a collection is selected
  useEffect(() => {
    if (selectedCollectionId !== null) {
      fetch(`http://192.168.100.6:2000/collections/assets/${selectedCollectionId}/`)
        .then(res => res.json())
        .then(data => setAssets(data));
    }
  }, [selectedCollectionId]);

  return (
    <div style={{ width: '100%' }}>
      <RetractableSearchBar />

      {/* Collection List */}
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {collections.map(col => (
          <div
            key={col.id}
            onClick={() => setSelectedCollectionId(col.id)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              backgroundColor: col.color_hex || '#eee'
            }}
          >
            <strong>{col.name}</strong>
            <p style={{ fontSize: '0.85rem' }}>{col.description}</p>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>{col.asset_count} assets</span>
          </div>
        ))}
      </div>

      {/* Asset Grid for selected collection */}
      {selectedCollectionId !== null && (
        <div style={{ width: '100%' }}>
          <AssetGrid assets={assets} />
        </div>
      )}
    </div>
  );
}
