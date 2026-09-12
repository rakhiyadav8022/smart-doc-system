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
        userId: user?.id || user?._id
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

  // Dedicated Inline Styles to bypass CSS cache/override issues
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      maxWidth: '420px',
      width: '100%',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    },
    header: {
      marginBottom: '18px',
      borderBottom: '1px solid #f1f5f9',
      paddingBottom: '10px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f172a',
      margin: '0 0 4px 0'
    },
    subtitle: {
      fontSize: '12px',
      color: '#64748b',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#334155',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1.5px solid #cbd5e1',
      fontSize: '13px',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1.5px solid #cbd5e1',
      fontSize: '13px',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    button: {
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📑 Digitize New Record</h3>
        <p style={styles.subtitle}>Saved exclusively to secure vault</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Document Title / Subject</label>
          <input
            type="text"
            name="title"
            style={styles.input}
            placeholder="e.g., Aadhaar Card, Land Revenue Deed"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Department</label>
          <input
            type="text"
            name="department"
            style={styles.input}
            placeholder="e.g., UIDAI, Transport, Revenue"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Document Category</label>
          <input
            type="text"
            name="category"
            style={styles.input}
            placeholder="e.g., Identity, Certificate, Order"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Extracted / Scanned Content</label>
          <textarea
            rows="5"
            name="fileData"
            style={styles.textarea}
            placeholder="Paste digitized text, card details, or certificate details..."
            value={formData.fileData}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Digitizing...' : '📥 Save to Personal Registry'}
        </button>
      </form>
    </div>
  );
}

export default UploadDoc;