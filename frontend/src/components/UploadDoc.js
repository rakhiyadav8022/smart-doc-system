import React, { useState } from 'react';
import axios from 'axios';

function UploadDoc({ user, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    category: '',
    fileData: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://smart-doc-system.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileData) {
      alert('Please fill Title and Content');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/documents`, {
        ...formData,
        userId: user.id
      });
      alert('Document securely digitized and archived!');
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
      <h3>📑 Digitize New Record</h3>
      <p className="card-subtitle">Saved exclusively to {user.name}'s secure vault</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document Title / Subject</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Aadhaar Card, Land Deed 2026"
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
            placeholder="e.g., UIDAI, Revenue, Transport"
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
            placeholder="e.g., Identity, Certificate, Order"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Extracted / Scanned Content</label>
          <textarea
            rows="4"
            name="fileData"
            placeholder="Paste digitized text, card details, or certificate content..."
            value={formData.fileData}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Digitizing...' : 'Save to Personal Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;