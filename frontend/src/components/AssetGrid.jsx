import React, { useState, useEffect } from 'react';
import AssetCell from './AssetCell';
import styles from './AssetGrid.module.css';

export default function AssetGrid({ assets }) {
  const [viewMode, setViewMode] = useState('masonry'); // masonry or grid
  const [sortBy, setSortBy] = useState('default'); // default, title, type

  // Sort assets based on selected option
  const sortedAssets = React.useMemo(() => {
    if (!assets) return [];
    
    const assetsCopy = [...assets];
    
    switch (sortBy) {
      case 'title':
        return assetsCopy.sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        );
      case 'type':
        return assetsCopy.sort((a, b) => {
          const getType = (asset) => {
            const path = asset.file_url || asset.file_path || '';
            if (/\.(glb|gltf|obj|fbx)$/i.test(path)) return '3D';
            if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path)) return 'Image';
            return 'File';
          };
          return getType(a).localeCompare(getType(b));
        });
      default:
        return assetsCopy;
    }
  }, [assets, sortBy]);

  if (!assets || assets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <h3>No assets found</h3>
        <p>Try adjusting your search or browse categories</p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {/* Grid Controls */}
      <div className={styles.gridControls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>View:</label>
          <div className={styles.toggleGroup}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'masonry' ? styles.active : ''}`}
              onClick={() => setViewMode('masonry')}
            >
              <span className={styles.toggleIcon}>⋮⋮</span>
              Masonry
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span className={styles.toggleIcon}>⊞</span>
              Grid
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="default">Default</option>
            <option value="title">Title</option>
            <option value="type">Type</option>
          </select>
        </div>

        <div className={styles.assetCount}>
          {sortedAssets.length} asset{sortedAssets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Asset Grid */}
      <div 
        className={`${styles.assetGrid} ${
          viewMode === 'masonry' ? styles.masonryLayout : styles.uniformGrid
        }`}
      >
        {sortedAssets.map((asset, index) => (
          <AssetCell 
            key={`${asset.id}-${index}`} 
            asset={asset}
          />
        ))}
      </div>
    </div>
  );
}