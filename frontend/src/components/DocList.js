import React from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function DocList({ documents, search, setSearch, onStatusUpdate }) {
  const API_URL = 'https://smart-doc-system.onrender.com';

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

  // Helper: Identify document type for rendering custom cards
  const renderDocumentFormat = (doc) => {
    const text = `${doc.title} ${doc.category} ${doc.department}`.toLowerCase();

    // 1. Aadhaar Card
    if (text.includes('aadhar') || text.includes('aadhaar') || text.includes('uidai')) {
      return (
        <div className="doc-preview-wrapper aadhar-card-view">
          <div className="aadhar-top-strip"></div>
          <div className="aadhar-header">
            <h4>भारत सरकार | Government of India</h4>
            <span style={{ fontSize: '10px', color: '#64748b' }}>UIDAI Secure Card</span>
          </div>
          <div className="aadhar-body-grid">
            <div className="aadhar-photo-box">👤</div>
            <div className="aadhar-details">
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                {doc.fileData}
              </pre>
            </div>
            <div className="aadhar-qr-box">SECURE<br />QR</div>
          </div>
          <div className="aadhar-number-bar">XXXX - XXXX - XXXX</div>
          <div className="aadhar-footer-text">मेरा आधार, मेरी पहचान</div>
        </div>
      );
    }

    // 2. PAN Card
    if (text.includes('pan') || text.includes('income tax')) {
      return (
        <div className="doc-preview-wrapper pan-card-view">
          <div className="pan-header">
            <h4>INCOME TAX DEPARTMENT | GOVT. OF INDIA</h4>
            <span style={{ fontSize: '11px' }}>PERMANENT ACCOUNT CARD</span>
          </div>
          <div className="pan-body">
            <div className="pan-photo-box">👤</div>
            <div className="pan-info">
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                {doc.fileData}
              </pre>
              <div className="pan-signature-bar">Digitally Signed Holder</div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Driving License / Vehicle RC
    if (text.includes('license') || text.includes('licence') || text.includes('driving') || text.includes('transport') || text.includes('rc')) {
      return (
        <div className="doc-preview-wrapper dl-card-view">
          <div className="dl-header">
            <h4>UNION OF INDIA | DRIVING LICENCE</h4>
            <span style={{ fontSize: '11px' }}>FORM 7 SMART CARD</span>
          </div>
          <div className="dl-body">
            <div className="aadhar-photo-box">👤</div>
            <div style={{ fontSize: '12px', color: '#0f172a' }}>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                {doc.fileData}
              </pre>
            </div>
            <div className="dl-chip" title="Smart Chip"></div>
          </div>
        </div>
      );
    }

    // 4. Certificates / Marks Sheet / Degrees
    if (text.includes('certificate') || text.includes('marksheet') || text.includes('degree') || text.includes('diploma') || text.includes('education')) {
      return (
        <div className="doc-preview-wrapper cert-card-view">
          <div className="cert-badge">🏅</div>
          <div className="cert-title">CERTIFICATE OF RECOGNITION</div>
          <div className="cert-content">
            <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
              {doc.fileData}
            </pre>
          </div>
        </div>
      );
    }

    // 5. Default Government Order / Land Record / Deeds
    return (
      <div className="doc-preview-wrapper order-card-view">
        <span className="order-stamp">OFFICIAL RECORD</span>
        <div className="order-heading">🏛️ {doc.department} - {doc.title}</div>
        <div className="order-body">
          <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
            {doc.fileData}
          </pre>
        </div>
      </div>
    );
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

              {/* Dynamic Design Output based on Document Type */}
              {renderDocumentFormat(doc)}

              <div className="doc-actions" style={{ marginTop: '14px' }}>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocList;