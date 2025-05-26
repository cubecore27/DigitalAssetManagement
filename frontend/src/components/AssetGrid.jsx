import React from 'react';
import AssetCell from './assetcell';
import './AssetGrid.css';

export default function AssetGrid({ assets }) {
  return (
    <div className="asset-grid">
      {assets.map(asset => (
        <AssetCell key={asset.id} asset={asset} />
      ))}
    </div>
  );
}