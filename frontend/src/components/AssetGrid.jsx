import React from 'react';
import AssetCell from './assetcell';
import style from './AssetGrid.module.css';

export default function AssetGrid({ assets }) {
  return (
    <div className={style.assetGrid}>
      {assets.map(asset => (
        <AssetCell key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
