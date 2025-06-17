import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AssetCell.module.css';

const API_BASE = 'http://192.168.100.6:2000/';

export default function AddToCollectionModal({ assetId, onClose }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null); // for success/error

  useEffect(() => {
    axios.get(`${API_BASE}collection/collections/`)
      .then((res) => setCollections(res.data))
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!selectedCollection) return;

    setAdding(true);
    setMessage(null);
    try {
      await axios.post(`${API_BASE}collection/collection-assets/`, {
        asset: assetId,
        collection: selectedCollection,
      });
      setMessage({ type: 'success', text: 'Added to collection!' });

      setTimeout(() => {
        onClose(); // close modal after short delay
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add. Try again.' });
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Select a Collection</h3>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="" disabled>
            Choose one...
          </option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        <div className={styles.modalActions}>
          <button onClick={handleAdd} disabled={!selectedCollection || adding}>
            {adding ? 'Adding...' : 'Add'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>

        {message && (
          <div
            className={`${styles.modalMessage} ${
              message.type === 'success' ? styles.success : styles.error
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
