import React, { useState, useMemo } from 'react';
import AssetCell from './AssetCell';
import styles from './AssetGrid.module.css';

const VIEW_MODES = {
  MASONRY: 'masonry',
  GRID: 'grid'
};

const SORT_OPTIONS = {
  RECENT: 'recent',
  TITLE: 'title',
  TYPE: 'type'
};

const getAssetType = (asset) => {
  const path = asset.file_url || asset.file_path || '';
  if (/\.(glb|gltf|obj|fbx)$/i.test(path)) return '3D';
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path)) return 'Image';
  return 'File';
};

const sortAssets = (assets, sortBy) => {
  const assetsCopy = [...assets];
  
  switch (sortBy) {
    case SORT_OPTIONS.RECENT:
      // Most recent first (reverse the original order to show newest at top)
      return assetsCopy.reverse();
      
    case SORT_OPTIONS.TITLE:
      return assetsCopy.sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      );
      
    case SORT_OPTIONS.TYPE:
      return assetsCopy.sort((a, b) => 
        getAssetType(a).localeCompare(getAssetType(b))
      );
      
    default:
      return assetsCopy;
  }
};

const EmptyState = () => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>📦</div>
    <h3>No assets found</h3>
    <p>Try adjusting your search or browse categories</p>
  </div>
);

const GridControls = ({ 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  assetCount 
}) => (
  <div className={styles.gridControls}>
    <div className={styles.controlGroup}>
      <label className={styles.controlLabel}>View:</label>
      <div className={styles.toggleGroup}>
        <button
          className={`${styles.toggleButton} ${
            viewMode === VIEW_MODES.MASONRY ? styles.active : ''
          }`}
          onClick={() => setViewMode(VIEW_MODES.MASONRY)}
          aria-label="Masonry view"
        >
          <span className={styles.toggleIcon}>⋮⋮</span>
          Masonry
        </button>
        <button
          className={`${styles.toggleButton} ${
            viewMode === VIEW_MODES.GRID ? styles.active : ''
          }`}
          onClick={() => setViewMode(VIEW_MODES.GRID)}
          aria-label="Grid view"
        >
          <span className={styles.toggleIcon}>⊞</span>
          Grid
        </button>
      </div>
    </div>

    <div className={styles.controlGroup}>
      <label className={styles.controlLabel} htmlFor="sort-select">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className={styles.sortSelect}
      >
        <option value={SORT_OPTIONS.RECENT}>Most Recent</option>
        <option value={SORT_OPTIONS.TITLE}>Title</option>
        <option value={SORT_OPTIONS.TYPE}>Type</option>
      </select>
    </div>

    <div className={styles.assetCount}>
      {assetCount} asset{assetCount !== 1 ? 's' : ''}
    </div>
  </div>
);

export default function AssetGrid({ assets }) {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MASONRY);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);

  const sortedAssets = useMemo(() => {
    if (!assets || assets.length === 0) return [];
    return sortAssets(assets, sortBy);
  }, [assets, sortBy]);

  if (!assets || assets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.gridContainer}>
      <GridControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        assetCount={sortedAssets.length}
      />

      <div 
        className={`${styles.assetGrid} ${
          viewMode === VIEW_MODES.MASONRY 
            ? styles.masonryLayout 
            : styles.uniformGrid
        }`}
      >
        {sortedAssets.map((asset, index) => (
          <AssetCell 
            key={asset.id || `asset-${index}`} 
            asset={asset}
          />
        ))}
      </div>
    </div>
  );
}