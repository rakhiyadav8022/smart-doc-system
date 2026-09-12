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

  // Helper to extract identifier numbers from the entered text
  const extractCardNumber = (text) => {
    if (!text) return 'Identity Number Not Specified';
    
    // Check for explicit "aadhar no : 1234..." or standard 12 digit sequence
    const explicitMatch = text.match(/(?:aadhar|adhaar|aadhaar|card|id)?\s*(?:no\.?|number|num)?[:\s-]*([0-9\s]{10,16})/i);
    if (explicitMatch && explicitMatch[1] && explicitMatch[1].replace(/\s/g, '').length >= 10) {
      return explicitMatch[1].trim();
    }

    // Fallback: Check for any sequence of 10 to 12 digits
    const digitsOnly = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/) || text.match(/\b\d{10,12}\b/);
    if (digitsOnly) {
      return digitsOnly[0];
    }

    return 'Verified Citizen Identity';
  };

  const renderDocumentFormat = (doc) => {
    const text = `${doc.title} ${doc.category} ${doc.department}`.toLowerCase();

    if (text.includes('aadhar') || text.includes('aadhaar') || text.includes('uidai')) {
      const cardNumber = extractCardNumber(doc.fileData);

      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          marginTop: '12px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            height: '6px',
            background: 'linear-gradient(90deg, #ff9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)',
            borderBottom: '1px solid #e2e8f0'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: '13px', fontWeight: '700' }}>
              भारत सरकार | Government of India
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>UIDAI Secure Card</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '16px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              width: '75px',
              height: '90px',
              backgroundColor: '#e2e8f0',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0
            }}>
              👤
            </div>

            <div style={{ flex: 1, fontSize: '13px', color: '#1e293b', lineHeight: '1.6' }}>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                {doc.fileData}
              </pre>
            </div>

            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1px',
              flexShrink: 0
            }}>
              <span>SECURE</span>
              <span>QR</span>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '3px',
            color: '#0f172a',
            backgroundColor: '#f8fafc',
            padding: '8px 0',
            borderTop: '1px dashed #cbd5e1'
          }}>
            {cardNumber}
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#b91c1c',
            padding: '6px',
            fontWeight: '700',
            backgroundColor: '#ffffff'
          }}>
            मेरा आधार, मेरी पहचान
          </div>
        </div>
      );
    }

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderLeft: '5px solid #1e40af',
        borderRadius: '8px',
        padding: '14px',
        marginTop: '10px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', marginBottom: '6px' }}>
          🏛️ {doc.department} — {doc.title}
        </div>
        <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', fontSize: '13px', color: '#334155' }}>
          {doc.fileData}
        </pre>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
          🔍 Central Document Repository
        </h3>
        <span style={{
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          fontSize: '12px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: '16px'
        }}>
          {documents.length} Records
        </span>
      </div>

      <input
        type="text"
        placeholder="Search documents by Title or Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1.5px solid #cbd5e1',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: '#f8fafc',
          marginBottom: '20px'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '14px' }}>
            No matching records found.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{doc.title}</span>
                <span style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {doc.category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                <span>🏢 <strong>Dept:</strong> {doc.department}</span>
                <span>🕒 {new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>

              {renderDocumentFormat(doc)}

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(doc._id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(doc)}
                  style={{
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
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