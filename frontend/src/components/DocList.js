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

    pdf.setFontSize(10);
    const splitText = pdf.splitTextToSize(doc.fileData || '', 170);
    pdf.text(splitText, 20, 98);

    pdf.setFontSize(9);
    pdf.setTextColor(130);
    pdf.text('Digitally generated & authenticated via Smart Doc Registry.', 105, 280, { align: 'center' });

    pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_document.pdf`);
  };

  // 12-digit number extraction prioritize karein
  const extractCardNumber = (text) => {
    if (!text) return 'Verified Citizen Identity';

    // Pehle specific 12 digit format dhundo (XXXX XXXX XXXX ya XXXXXXXXXXXX)
    const twelveDigitMatch = text.match(/(?:aadhar|adhaar|aadhaar|uid)?\s*(?:no\.?|number|num)?[:\s-]*(\d{4}\s?\d{4}\s?\d{4})/i);
    if (twelveDigitMatch && twelveDigitMatch[1]) {
      return twelveDigitMatch[1];
    }

    const simple12Digits = text.match(/\b\d{12}\b/);
    if (simple12Digits) {
      return simple12Digits[0].replace(/(\d{4})(?=\d)/g, '$1 ');
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
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          marginTop: '10px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #ff9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)',
            borderBottom: '1px solid #e2e8f0'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: '11px', fontWeight: '700' }}>
              भारत सरकार | Government of India
            </h4>
            <span style={{ fontSize: '10px', color: '#64748b' }}>UIDAI Secure Card</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '55px',
              height: '70px',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              👤
            </div>

            <div style={{ flex: 1, minWidth: 0, fontSize: '12px', color: '#1e293b', lineHeight: '1.5' }}>
              <pre style={{
                margin: 0,
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {doc.fileData}
              </pre>
            </div>

            <div style={{
              width: '45px',
              height: '45px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '7px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              flexShrink: 0
            }}>
              <span>SECURE</span>
              <span>QR</span>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: '#0f172a',
            backgroundColor: '#f8fafc',
            padding: '6px 0',
            borderTop: '1px dashed #cbd5e1'
          }}>
            {cardNumber}
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#b91c1c',
            padding: '4px',
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
        borderLeft: '4px solid #1e40af',
        borderRadius: '6px',
        padding: '10px 12px',
        marginTop: '8px',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
          🏛️ {doc.department} — {doc.title}
        </div>
        <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', color: '#334155' }}>
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
      padding: '16px 18px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
          🔍 Central Document Repository
        </h3>
        <span style={{
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          fontSize: '11px',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '12px'
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
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1.5px solid #cbd5e1',
          fontSize: '13px',
          outline: 'none',
          backgroundColor: '#f8fafc',
          marginBottom: '14px'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
            No matching records found.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{doc.title}</span>
                <span style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {doc.category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                <span>🏢 <strong>Dept:</strong> {doc.department}</span>
                <span>🕒 {new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>

              {renderDocumentFormat(doc)}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(doc._id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    fontSize: '11px',
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
                    padding: '6px 12px',
                    borderRadius: '5px',
                    fontSize: '11px',
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