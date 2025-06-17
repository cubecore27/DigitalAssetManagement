import React, { useEffect, useState } from 'react';
import styles from './SystemStats.module.css';
import axios from 'axios'; // Uncomment this when you're ready to use real API calls

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API call when ready
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:2000/settings/system-stats/');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stats', error);
        setLoading(false);
      }
    };
    fetchStats();

    // Mock data for demonstration
    // const timer = setTimeout(() => {
    //   setStats({
    //     total_assets: 1247,
    //     total_storage: 52428800000,
    //     mime_type_breakdown: {
    //       'image/jpeg': { count: 432, total_size: 20971520000 },
    //       'image/png': { count: 298, total_size: 15728640000 },
    //       'video/mp4': { count: 87, total_size: 12884901888 },
    //       'application/pdf': { count: 156, total_size: 2147483648 },
    //       'text/plain': { count: 274, total_size: 1073741824 }
    //     },
    //     asset_type_breakdown: {
    //       'Images': { count: 730, total_size: 36700160000 },
    //       'Videos': { count: 87, total_size: 12884901888 },
    //       'Documents': { count: 430, total_size: 2621440000 }
    //     }
    //   });
    //   setLoading(false);
    // }, 800);

    // Cleanup function
    // return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>No statistics available</p>
        </div>
      </div>
    );
  }

  const maxSize = Math.max(
    ...Object.values(stats.mime_type_breakdown || {}).map(m => m.total_size || 0)
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>System Statistics</h1>
        <p className={styles.subtitle}>Storage and asset overview</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.storageCard}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>💾</div>
            <div className={styles.cardInfo}>
              <p className={styles.cardLabel}>Total Storage</p>
              <p className={styles.cardValue}>{formatBytes(stats.total_storage)}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.assetsCard}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardInfo}>
              <p className={styles.cardLabel}>Total Assets</p>
              <p className={styles.cardValue}>{stats.total_assets.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.typesCard}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>📁</div>
            <div className={styles.cardInfo}>
              <p className={styles.cardLabel}>File Types</p>
              <p className={styles.cardValue}>{Object.keys(stats.mime_type_breakdown).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={styles.contentGrid}>
        {/* MIME Type Breakdown */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Storage by File Type</h3>
          <div className={styles.mimeList}>
            {Object.entries(stats.mime_type_breakdown || {}).map(([mime, data]) => (
              <div key={mime} className={styles.mimeItem}>
                <div className={styles.mimeHeader}>
                  <span className={styles.mimeType}>{mime}</span>
                  <div className={styles.mimeStats}>
                    <span className={styles.mimeSize}>{formatBytes(data.total_size)}</span>
                    <span className={styles.mimeCount}>({data.count} files)</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(data.total_size / maxSize) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Type Breakdown */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Asset Categories</h3>
          <div className={styles.assetList}>
            {Object.entries(stats.asset_type_breakdown || {}).map(([type, data]) => (
              <div key={type} className={styles.assetItem}>
                <div className={styles.assetInfo}>
                  <h4 className={styles.assetType}>{type}</h4>
                  <p className={styles.assetCount}>{data.count} items</p>
                </div>
                <div className={styles.assetSize}>
                  <p className={styles.assetSizeValue}>{formatBytes(data.total_size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;