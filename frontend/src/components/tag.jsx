import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import styles from './tag.module.css';

const API_URL = 'https://digitalassetmanagement-production.up.railway.app/tags/tags/';

export default function TagManager() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorHex, setColorHex] = useState('#808080');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const fetchTags = async () => {
    try {
      const res = await axios.get(API_URL);
      setTags(res.data);
    } catch (err) {
      console.error('Failed to load tags', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        slug: slugify(name),
        description,
        color_hex: colorHex,
      };
      await axios.post(API_URL, payload);

      // Reset form
      setName('');
      setDescription('');
      setColorHex('#808080');
      fetchTags();
    } catch (err) {
      console.error(err);
      setError('Failed to create tag');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.tagManager}>
      <h2>Tag Manager</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Description
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Tag Color
          <div className={styles.colorPicker}>
            <SketchPicker
              color={colorHex}
              onChangeComplete={(color) => setColorHex(color.hex)}
            />
            <div className={styles.colorPreview} style={{ backgroundColor: colorHex }}>
              {colorHex}
            </div>
          </div>
        </label>

        <button
          className={styles.button}
          type="submit"
          disabled={submitting || !name.trim()}
        >
          {submitting ? 'Creating...' : 'Create Tag'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      <h3>Existing Tags</h3>
      <div className={styles.tagList}>
        {tags.map((tag) => (
          <div key={tag.id} className={styles.tagCard}>
            <div className={styles.tagColor} style={{ backgroundColor: tag.color_hex }} />
            <div className={styles.tagInfo}>
              <strong>{tag.name}</strong>
              <span className={styles.tagSlug}>({tag.slug})</span>
              <p className={styles.tagDesc}>{tag.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
