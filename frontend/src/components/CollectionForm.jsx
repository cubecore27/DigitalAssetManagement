import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CollectionManager.module.css';

const API_URL = 'http://localhost:8000/collections/'; // adjust if needed

const CollectionForm = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color_hex: '#808080',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        color_hex: initialData.color_hex || '#808080',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await axios.put(`${API_URL}${initialData.id}/`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', description: '', color_hex: '#808080' });
      setError('');
      onSuccess();
    } catch (err) {
      setError('Error saving collection.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Color:
        <input
          type="color"
          name="color_hex"
          value={formData.color_hex}
          onChange={handleChange}
        />
      </label>

      <button type="submit">{initialData ? 'Update' : 'Create'}</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default CollectionForm;
