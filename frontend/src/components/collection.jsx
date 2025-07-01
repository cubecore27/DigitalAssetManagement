import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CollectionForm from './CollectionForm';
import styles from './CollectionManager.module.css';

const API_URL = 'https://dams-production.up.railway.app//collection/collections/'; // adjust as needed

const CollectionManager = () => {
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(API_URL);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleEdit = (collection) => {
    setEditingCollection(collection);
  };

  const handleFormSubmit = async () => {
    setEditingCollection(null);
    fetchCollections();
  };

  return (
    <div className={styles.container}>
      <h2>Collection Manager</h2>

      <div className={styles.formSection}>
        <h3>{editingCollection ? 'Edit Collection' : 'Create New Collection'}</h3>
        <CollectionForm
          initialData={editingCollection}
          onSuccess={handleFormSubmit}
        />
      </div>

      <div className={styles.listSection}>
        <h3>All Collections</h3>
        <ul className={styles.list}>
          {collections.map((collection) => (
            <li key={collection.id} className={styles.item}>
              <div>
                <strong>{collection.name}</strong><br />
                <span>{collection.description}</span>
              </div>
              <button onClick={() => handleEdit(collection)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionManager;
