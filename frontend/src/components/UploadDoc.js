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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://smart-doc-system.onrender.com/api/documents', {
        ...formData,
        userId: user.id
      });
      alert('Document saved successfully in your personal vault!');
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
      <p className="card-subtitle">Saved exclusively to {user.name}'s vault</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document Title / Subject</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Land Revenue Circular 2026"
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
            placeholder="e.g., Revenue, Transport, UIDAI"
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
            placeholder="e.g., Identity, Registry, Certificate"
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
            placeholder="Paste digitized text or certificate details..."
            value={formData.fileData}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving to Database...' : 'Save to Personal Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;