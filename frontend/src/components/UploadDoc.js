import React, { useState } from 'react';
import axios from 'axios';

function UploadDoc({ user, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    category: '',
    fileData: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://smart-doc-system.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert uploaded image file into Base64 format
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter Document Title');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/documents`, {
        ...formData,
        userId: user?.id || user?._id
      });
      alert('Document saved successfully!');
      setFormData({ title: '', department: '', category: '', fileData: '', imageUrl: '' });
      onUploadSuccess();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
          📑 Digitize New Record
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          Saved exclusively to secure vault
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
            Document Title / Subject
          </label>
          <input
            type="text"
            name="title"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none'
            }}
            placeholder="e.g., 10th Marksheet, Aadhaar Card"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
            Department
          </label>
          <input
            type="text"
            name="department"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none'
            }}
            placeholder="e.g., CBSE, State Board, UIDAI"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
            Document Category
          </label>
          <input
            type="text"
            name="category"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none'
            }}
            placeholder="e.g., Education, Identity, Certificate"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        {/* Upload Marksheet/Document Photo Option */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
            Attach Document Photo / Scan (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              padding: '8px',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: '#f8fafc',
              cursor: 'pointer'
            }}
          />
          {formData.imageUrl && (
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <img
                src={formData.imageUrl}
                alt="Upload Preview"
                style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <p style={{ fontSize: '11px', color: '#16a34a', margin: '4px 0 0 0' }}>✓ Image ready to upload</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
            Extracted / Scanned Content (Optional or Details)
          </label>
          <textarea
            rows="4"
            name="fileData"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Marks, subjects, roll number, or extra text details..."
            value={formData.fileData}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '6px'
          }}
        >
          {loading ? 'Saving...' : '📥 Save to Personal Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;