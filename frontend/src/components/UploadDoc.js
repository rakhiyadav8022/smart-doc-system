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
      alert('Document saved successfully!');
      setFormData({ title: '', department: '', category: '', fileData: '' });
      onUploadSuccess();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card upload-card-box">
      <div className="upload-header">
        <h3 className="upload-title">📑 Digitize New Record</h3>
        <p className="upload-subtitle">Saved exclusively to {user?.name}'s secure vault</p>
      </div>

      <form onSubmit={handleSubmit} className="custom-gov-form">
        <div className="form-group-item">
          <label className="field-label">Document Title / Subject</label>
          <input
            type="text"
            name="title"
            className="field-input"
            placeholder="e.g., Aadhaar Card, Land Revenue Deed"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-item">
          <label className="field-label">Department</label>
          <input
            type="text"
            name="department"
            className="field-input"
            placeholder="e.g., UIDAI, Transport, Revenue"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-item">
          <label className="field-label">Document Category</label>
          <input
            type="text"
            name="category"
            className="field-input"
            placeholder="e.g., Identity, Certificate, Order"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-item">
          <label className="field-label">Extracted / Scanned Content</label>
          <textarea
            rows="5"
            name="fileData"
            className="field-textarea"
            placeholder="Paste digitized text, card details, or certificate details..."
            value={formData.fileData}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit-form" disabled={loading}>
          {loading ? 'Digitizing...' : '📥 Save to Personal Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;