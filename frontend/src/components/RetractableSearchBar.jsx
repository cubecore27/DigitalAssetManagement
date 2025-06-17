// components/RetractableSearchBar.jsx
import React, { useState, useEffect } from 'react';
import styles from './RetractableSearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

export default function RetractableSearchBar({ searchQuery, setSearchQuery, assetType, setAssetType }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.navbar} ${hovered ? styles.expanded : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.topRow}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {hovered && (
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <FontAwesomeIcon icon={faFilter} className={styles.icon} />
            <label>Type:</label>
            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
              <option value="">All</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
              <option value="text">Text</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
