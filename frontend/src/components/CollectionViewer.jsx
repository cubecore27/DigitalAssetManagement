import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AssetGrid from '../components/AssetGrid';
import RetractableSearchBar from '../components/RetractableSearchBar';

export default function CollectionViewer() {
  const { id } = useParams();
  const [assets, setAssets] = useState([]);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    // Get assets in the collection
    fetch(`http://192.168.100.6:2000/collection/collections/assets/${id}/`)
      .then(res => res.json())
      .then(data => setAssets(data));

    // Optional: fetch collection metadata
    // fetch(`http://192.168.100.6:2000/assets/${id}/`)
    //   .then(res => res.json())
    //   .then(data => setCollection(data));
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <RetractableSearchBar />

      {collection && (
        <div style={{ padding: '1rem' }}>
          <h2>{collection.name}</h2>
          <p>{collection.description}</p>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            {collection.asset_count} assets
          </p>
        </div>
      )}

      <AssetGrid assets={assets} />
    </div>
  );
}
