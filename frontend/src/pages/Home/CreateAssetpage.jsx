import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CreateAsset.module.css';
import SearchNavbar from '../../components/RetractableSearchBar';
import SettingsNav from '../../components/SettingNav';

const API_BASE = 'http://192.168.100.6:2000/';

export default function CreateAsset() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  // load categories + tags
  useEffect(() => {
    axios.get(API_BASE + 'categories/categories/')
      .then(res => setCategories(res.data))
      .catch(console.error);

    axios.get(API_BASE + 'tags/tags/')
      .then(res => setTags(res.data))
      .catch(console.error);
  }, []);

  // generate preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    setUploading(true);
    setMessage('');
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    selectedCats.forEach(catId => form.append('category_ids', catId));
    selectedTags.forEach(tagId => form.append('tag_ids', tagId));

    try {
      await axios.post(API_BASE + 'asset/assets/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: ({ loaded, total }) => {
          setProgress(Math.round((loaded / total) * 100));
        }
      });
      setMessage('Upload successful!');
      // reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setSelectedCats([]);
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <div className={styles.container}>
      <h2>Create Asset</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>File Upload</label>
          <input type="file" onChange={handleFileChange} />
        </div>

          {file && previewUrl && (
            <div className={styles.preview}>
              {file.type.startsWith('image/') ? (
              <img src={previewUrl} alt="preview" />
            ) : file.type.startsWith('video/') ? (
              <video src={previewUrl} controls />
            ) : file.type.startsWith('audio/') ? (
              <audio src={previewUrl} controls />
            ) : (
              <div className={styles.placeholder}>
                <span>{file.name}</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.field}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={255}
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Categories</label>
          <select
            multiple
            value={selectedCats}
            onChange={e =>
              setSelectedCats(Array.from(e.target.selectedOptions, o => o.value))
            }
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {' '.repeat(cat.depth * 2)}{cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Tags</label>
          <select
            multiple
            value={selectedTags}
            onChange={e =>
              setSelectedTags(Array.from(e.target.selectedOptions, o => o.value))
            }
            className={styles.tagSelect}
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {uploading && (
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload Asset'}
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
    </>
  );
}
