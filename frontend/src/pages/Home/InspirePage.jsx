// pages/InspirePage.jsx
import { useState, useEffect } from 'react';
import React from 'react';
import Sidebar from '../../components/Sidebar';
import AssetGrid from '../../components/AssetGrid';
import RetractableSearchBar from '../../components/RetractableSearchBar';

export default function InspirePage() {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetType, setAssetType] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const url = new URL('https://digitalassetmanagement-production.up.railway.app/asset/assets/');
      if (searchQuery) url.searchParams.append('search', searchQuery);
      if (assetType) url.searchParams.append('asset_type', assetType);

      fetch(url)
        .then(res => res.json())
        .then(data => setAssets(data));
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, assetType]);

  return (
    <div style={{ width: '100%' }}>
      <RetractableSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        assetType={assetType}
        setAssetType={setAssetType}
      />
      <div style={{ width: '100%' }}>
        <AssetGrid assets={assets} />
      </div>
    </div>
  );
}
