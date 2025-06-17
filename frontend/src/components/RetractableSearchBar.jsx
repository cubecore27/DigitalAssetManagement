import React, { useState } from 'react';
import styles from './RetractableSearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const SearchNavbar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.navbar} ${hovered ? styles.expanded : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.topRow}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input type="text" className={styles.searchInput} placeholder="Search assets..." />
      </div>

      {hovered && (
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <FontAwesomeIcon icon={faFilter} className={styles.icon} />
            <label>Type:</label>
            <select>
              <option value="">All</option>
              <option value="images">Images</option>
              <option value="3d">3D Files</option>
            </select>
          </div>
          <div className={styles.filterRow}>
            <label>Size:</label>
            <select>
              <option value="">Any</option>
              <option value="small">Small (&lt;1MB)</option>
              <option value="medium">Medium (1–10MB)</option>
              <option value="large">Large (&gt;10MB)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;
