import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CreateAssetpage.module.css';
import Sidebar from '../../components/Sidebar';

const API_BASE = 'http://192.168.100.6:2000';

export default function CreateAssetpage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState(null);
  const [categoryIds, setCategoryIds] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/categories/create/`).then(res => setCategories(res.data));
    axios.get(`${API_BASE}/tags/tags/`).then(res => setTags(res.data));
  }, []);

  const detectAssetType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(ext)) return 'images';
    if (['glb', 'gltf', 'obj', 'fbx'].includes(ext)) return '3d_files';
    return 'unknown';
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setAssetType(detectAssetType(selected.name));
      if (!title) setTitle(selected.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('asset_type', assetType); // keep as plain string, no stringify
  
    // Convert IDs to integers
    categoryIds.forEach((id) => formData.append('category_ids', parseInt(id)));
    tagIds.forEach((id) => formData.append('tag_ids', parseInt(id)));
  
    try {
      await axios.post(`${API_BASE}/asset/assets/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Asset created successfully!');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Error creating asset.');
    }
  };
  
  return (
    <div className='sidebar'>
      <Sidebar/>
      <form onSubmit={handleSubmit} className={styles.assetForm}>
      <h2>Upload New Asset</h2>

      <label className={styles.label}>
        File:
        <input type="file" onChange={handleFileChange} required className={styles.input} />
      </label>

      <label className={styles.label}>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        ></textarea>
      </label>

      <label className={styles.label}>
        Categories:
        <select
          multiple
          value={categoryIds}
          onChange={(e) =>
            setCategoryIds([...e.target.selectedOptions].map((opt) => opt.value))
          }
          className={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Tags:
        <select
          multiple
          value={tagIds}
          onChange={(e) =>
            setTagIds([...e.target.selectedOptions].map((opt) => opt.value))
          }
          className={styles.select}
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </label>

      <p className={styles.assetType}>Detected asset type: <strong>{assetType || 'N/A'}</strong></p>

      <button type="submit" className={styles.button}>Submit</button>
    </form>
    </div>
   
  );
}
