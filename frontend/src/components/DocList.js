import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function DocList({ documents, search, setSearch, onStatusUpdate }) {
  const [editingDocId, setEditingDocId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    department: '',
    category: '',
    fileData: ''
  });

  const API_URL = 'https://smart-doc-system.onrender.com';

  const handleEditClick = (doc) => {
    setEditingDocId(doc._id);
    setEditFormData({
      title: doc.title || '',
      department: doc.department || '',
      category: doc.category || '',
      fileData: doc.fileData || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/documents/${id}`, editFormData);
      alert('Document updated successfully!');
      setEditingDocId(null);
      onStatusUpdate();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this document?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/documents/${id}`);
      alert('Document deleted successfully!');
      onStatusUpdate();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDownloadPDF = (doc) => {
    const pdf = new jsPDF();
    pdf.setDrawColor(20, 60, 120);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(20, 60, 120);
    pdf.text('SMART DIGITAL DOCUMENTATION PORTAL', 105, 25, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text('Official Digitized Registry Extract', 105, 32, { align: 'center' });

    pdf.setDrawColor(200);
    pdf.line(15, 36, 195, 36);

    pdf.setFontSize(11);
    pdf.setTextColor(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Title / Subject: ', 20, 48);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.title}`, 60, 48);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Department: ', 20, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.department}`, 60, 56);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Category: ', 20, 64);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.category}`, 60, 64);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date Digitized: ', 20, 72);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${new Date(doc.uploadedAt).toLocaleString()}`, 60, 72);

    pdf.setDrawColor(200);
    pdf.line(15, 80, 195, 80);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Digitized / Extracted Content:', 20, 90);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const splitText = pdf.splitTextToSize(doc.fileData || '', 170);
    pdf.text(splitText, 20, 98);

    pdf.setFontSize(9);
    pdf.setTextColor(130);
    pdf.text('Digitally generated & authenticated via Smart Doc Registry.', 105, 280, { align: 'center' });

    pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_document.pdf`);
  };

  return (
    <div className="card">
      <div className="card-header-flex">
        <h3>🔍 Central Document Repository</h3>
        <span className="count-pill">{documents.length} Records</span>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search documents by Title or Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="doc-scroll-area">
        {documents.length === 0 ? (
          <div className="empty-state">No matching documents found.</div>
        ) : (
          documents.map((doc) => (
            <div key={doc._id} className="doc-card">
              {editingDocId === doc._id ? (
                <div>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Extracted Content</label>
                    <textarea
                      rows="3"
                      name="fileData"
                      value={editFormData.fileData}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="doc-actions" style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateSubmit(doc._id)}
                      className="btn"
                      style={{ backgroundColor: '#16a34a', color: '#fff' }}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDocId(null)}
                      className="btn"
                      style={{ backgroundColor: '#64748b', color: '#fff' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="doc-header">
                    <span className="doc-title">{doc.title}</span>
                    <span className="count-pill" style={{ background: '#f1f5f9', color: '#475569' }}>
                      {doc.category}
                    </span>
                  </div>

                  <div className="doc-meta">
                    <span>🏢 <strong>Dept:</strong> {doc.department}</span>
                    <span>🕒 {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="doc-body">
                    <p>{doc.fileData}</p>
                  </div>

                  <div className="doc-actions">
                    <button
                      type="button"
                      onClick={() => handleEditClick(doc)}
                      className="btn"
                      style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
                    >
                      ✏️ Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc._id)}
                      className="btn"
                      style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                    >
                      🗑️ Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(doc)}
                      className="btn"
                      style={{ backgroundColor: '#1d4ed8', color: '#ffffff' }}
                    >
                      📥 Download PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocList;