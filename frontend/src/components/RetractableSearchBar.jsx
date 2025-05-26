import React, { useState } from "react";
import styles from "./RetractableSearchBar.module.css";

export default function RetractableSearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.toggleButton} ${isOpen ? styles.open : ""}`}
        aria-expanded={isOpen}
        aria-controls="search-panel"
      >
        {isOpen ? "Hide Search & Filters ▲" : "Show Search & Filters ▼"}
      </button>

      {isOpen && (
        <div id="search-panel" className={styles.panel}>
          <div className={styles.searchGroup}>
            <label htmlFor="searchInput" className={styles.label}>
              Search
            </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Type to search..."
              className={styles.input}
            />
          </div>

          <fieldset className={styles.filters}>
            <legend className={styles.legend}>Filters</legend>

            <div className={styles.filterItem}>
              <label>
                <input type="checkbox" name="filter1" /> Filter Option 1
              </label>
            </div>
            <div className={styles.filterItem}>
              <label>
                <input type="checkbox" name="filter2" /> Filter Option 2
              </label>
            </div>
            <div className={styles.filterItem}>
              <label>
                <input type="checkbox" name="filter3" /> Filter Option 3
              </label>
            </div>
          </fieldset>

          <button
            type="button"
            className={styles.searchButton}
            onClick={() => alert("Search triggered (not implemented)")}
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
}
