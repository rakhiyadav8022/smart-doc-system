import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://smart-doc-system.onrender.com';

function UploadDoc({ user, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    category: '',
    fileData: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/documents`, {
        ...formData,
        userId: user.id
      });
      alert('Document saved successfully to your registry!');
      setFormData({ title: '', department: '', category: '', fileData: '' });
      onUploadSuccess();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>📄 Digitize New Record</h3>
      <p className="card-subtitle">Enter document details or paste extracted text</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document Title / Subject</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Land Revenue Deed 2026"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g., Revenue, Health, Transport"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Document Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Policy, Registry, Certificate"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Extracted / Scanned Content</label>
          <textarea
            name="fileData"
            rows="4"
            placeholder="Paste digitized text or summary here..."
            value={formData.fileData}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving to Registry...' : 'Save to Digital Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;