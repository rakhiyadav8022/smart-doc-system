import React from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function DocList({ documents, search, setSearch, onStatusUpdate }) {
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://smart-doc-system.onrender.com/api/documents/${id}/status`, {
        status: newStatus
      });
      onStatusUpdate();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  // PDF Download Logic
  const handleDownloadPDF = (doc) => {
    const pdf = new jsPDF();

    // Header / Border Styling
    pdf.setDrawColor(20, 60, 120);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277);

    // Title & Header
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

    // Document Metadata
    pdf.setFontSize(11);
    pdf.setTextColor(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Title / Subject: `, 20, 48);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.title}`, 60, 48);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Department: `, 20, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.department}`, 60, 56);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Category: `, 20, 64);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.category}`, 60, 64);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Status: `, 20, 72);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.status}`, 60, 72);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Date Digitized: `, 20, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${new Date(doc.uploadedAt).toLocaleString()}`, 60, 80);

    pdf.setDrawColor(200);
    pdf.line(15, 86, 195, 86);

    // Content Section
    pdf.setFont('helvetica', 'bold');
    pdf.text('Digitized / Extracted Content:', 20, 96);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const splitText = pdf.splitTextToSize(doc.fileData, 170);
    pdf.text(splitText, 20, 105);

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(130);
    pdf.text('Digitally generated & authenticated via Smart Doc Registry.', 105, 280, { align: 'center' });

    // Download file
    pdf.save(`${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_document.pdf`);
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
                <span className={`status-badge ${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </div>

              <div className="doc-meta">
                <span>🏢 <strong>Dept:</strong> {doc.department}</span>
                <span>🏷️ <strong>Category:</strong> {doc.category}</span>
                <span>🕒 {new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>

              <div className="doc-body">
                <p>{doc.fileData}</p>
              </div>

              <div className="doc-actions">
                <button
                  onClick={() => handleStatusChange(doc._id, 'Verified')}
                  className="btn btn-verify"
                  disabled={doc.status === 'Verified'}
                >
                  ✓ Mark Verified
                </button>
                <button
                  onClick={() => handleStatusChange(doc._id, 'Archived')}
                  className="btn btn-archive"
                  disabled={doc.status === 'Archived'}
                >
                  📁 Archive
                </button>
                <button
                  onClick={() => handleDownloadPDF(doc)}
                  className="btn"
                  style={{ backgroundColor: '#2563eb', color: '#fff' }}
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