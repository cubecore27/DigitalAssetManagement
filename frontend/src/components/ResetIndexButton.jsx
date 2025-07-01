import React, { useState } from 'react';
import axios from 'axios';

const ResetIndexButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetIndex = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://dams-production.up.railway.app//search/index/');
      setMessage(response.data.detail + ` (${response.data.image_count} images indexed)`);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'An error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button
        onClick={handleResetIndex}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Indexing...' : 'Reset Search Index'}
      </button>

      {loading && (
        <div style={{ marginTop: '10px' }}>
          <span className="spinner" />
          <p>Processing images. Please wait...</p>
        </div>
      )}

      {message && (
        <p style={{ marginTop: '10px', color: message.includes('error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetIndexButton;
