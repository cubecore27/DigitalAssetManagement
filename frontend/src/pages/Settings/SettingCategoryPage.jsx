import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar'
import SettingsNav from '../../components/SettingNav'


const API_URL = 'http://192.168.100.6:2000/categories/create/';

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: '',
    is_active: false,
    parent_category: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch categories for the parent dropdown
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, {
        ...formData,
        sort_order: formData.sort_order === '' ? null : Number(formData.sort_order),
        parent_category: formData.parent_category === '' ? null : formData.parent_category,
      });
      setMessage('Category created successfully.');
      setFormData({
        name: '',
        slug: '',
        description: '',
        sort_order: '',
        is_active: false,
        parent_category: '',
      });
    } catch (error) {
      console.error('Error creating category:', error);
      setMessage('Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>

      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Slug:</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Sort Order:</label>
        <input
          type="number"
          name="sort_order"
          value={formData.sort_order}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          Active
        </label>
      </div>

      <div>
        <label className="block">Parent Category:</label>
        <select
          name="parent_category"
          value={formData.parent_category}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">None</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Saving...' : 'Create Category'}
      </button>

      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
    </form>
  );
};

const API_URL2 = 'http://192.168.100.6:2000/tags/tags/';

const TagForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color_hex: '',
    description: '',
    usage_count: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL2, {
        ...formData,
        usage_count: formData.usage_count === '' ? null : Number(formData.usage_count),
      });
      setMessage('Tag created successfully.');
      setFormData({
        name: '',
        slug: '',
        color_hex: '',
        description: '',
        usage_count: '',
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      setMessage('Failed to create tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-xl font-bold mb-4">Create Tag</h2>

      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Slug:</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Color Hex:</label>
        <input
          type="text"
          name="color_hex"
          value={formData.color_hex}
          onChange={handleChange}
          placeholder="#FFFFFF"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Usage Count:</label>
        <input
          type="number"
          name="usage_count"
          value={formData.usage_count}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Saving...' : 'Create Tag'}
      </button>

      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
    </form>
  );
};


export default function SettingCategoryPage() {
  return (
    <>
    <div className="sidebar">
      <Sidebar/>
      <div
      style={{width: '100%'}}>
      <SettingsNav/>
      <div>
        <CategoryForm/>
        <TagForm/>
      </div>
      </div>
    </div>
    </>
    
  )
}
