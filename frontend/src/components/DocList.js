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

  // Click on photo -> Open clean printable view in new tab with auto-print
  const handlePrintDocument = (imageUrl) => {
    if (!imageUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to preview and print the document.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Document</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 95vw;
              max-height: 95vh;
              width: auto;
              height: auto;
              object-fit: contain;
              display: block;
            }
            @media print {
              body {
                display: block;
              }
              img {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="window.focus(); window.print();" alt="Document Print View" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Standard PDF summary download
  const handleDownloadPDF = (doc) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    pdf.setDrawColor(20, 60, 120);
    pdf.setLineWidth(0.8);
    pdf.rect(10, 10, 190, 277);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(20, 60, 120);
    pdf.text('SMART DIGITAL DOCUMENTATION PORTAL', 105, 20, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text('Govt. Digitized Registry Extract & Verified Copy', 105, 25, { align: 'center' });

    pdf.setDrawColor(210);
    pdf.line(15, 28, 195, 28);

    pdf.setFontSize(10);
    pdf.setTextColor(30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Subject / Title: ', 16, 35);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.title || ''}`, 50, 35);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Department: ', 16, 42);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.department || ''}`, 50, 42);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Category: ', 120, 42);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.category || ''}`, 145, 42);

    let nextY = 48;
    if (doc.fileData && doc.fileData.trim() !== '') {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Details:', 16, nextY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const splitText = pdf.splitTextToSize(doc.fileData, 170);
      pdf.text(splitText, 16, nextY + 5);
      nextY += 8 + splitText.length * 4.5;
    }

    if (doc.imageUrl) {
      const img = new Image();
      img.src = doc.imageUrl;
      img.onload = () => {
        const availableHeight = 265 - nextY;
        const availableWidth = 175;

        let imgWidth = img.width;
        let imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        let renderWidth = availableWidth;
        let renderHeight = renderWidth / ratio;

        if (renderHeight > availableHeight) {
          renderHeight = availableHeight;
          renderWidth = renderHeight * ratio;
        }

        const xPos = (pageWidth - renderWidth) / 2;
        const yPos = nextY + 3;

        pdf.addImage(doc.imageUrl, 'JPEG', xPos, yPos, renderWidth, renderHeight);

        pdf.setFontSize(8);
        pdf.setTextColor(130);
        pdf.text('Digitally archived in Citizen Vault. Verified Printable Record.', 105, 282, { align: 'center' });

        pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
      };

      img.onerror = () => {
        pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
      };
      return;
    }

    pdf.setFontSize(8);
    pdf.setTextColor(130);
    pdf.text('Digitally archived in Citizen Vault. Verified Printable Record.', 105, 282, { align: 'center' });
    pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
  };

  const renderDocumentFormat = (doc) => {
    const text = `${doc.title} ${doc.category} ${doc.department}`.toLowerCase();

    // Aadhaar Layout
    if (text.includes('aadhar') || text.includes('aadhaar') || text.includes('uidai')) {
      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          marginTop: '10px',
          width: '100%',
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
            <div
              onClick={() => doc.imageUrl && handlePrintDocument(doc.imageUrl)}
              title={doc.imageUrl ? 'Click to open and print document' : ''}
              style={{
                width: '60px',
                height: '75px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: doc.imageUrl ? 'pointer' : 'default'
              }}
            >
              {doc.imageUrl ? (
                <img src={doc.imageUrl} alt="Doc" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '👤'
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0, fontSize: '12px', color: '#1e293b', lineHeight: '1.5' }}>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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
            fontSize: '11px',
            color: '#b91c1c',
            padding: '6px',
            fontWeight: '700',
            backgroundColor: '#ffffff',
            borderTop: '1px dashed #cbd5e1'
          }}>
            मेरा आधार, मेरी पहचान
          </div>
        </div>
      );
    }

    // Default Layout (Educational Marksheet / Certificates)
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderLeft: '4px solid #1e40af',
        borderRadius: '6px',
        padding: '12px',
        marginTop: '8px',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', marginBottom: '6px' }}>
          🏛️ {doc.department} — {doc.title}
        </div>
        {doc.fileData && (
          <pre style={{ margin: '0 0 10px 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', color: '#334155' }}>
            {doc.fileData}
          </pre>
        )}

        {/* Clickable Image with hover indicator */}
        {doc.imageUrl && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <div
              onClick={() => handlePrintDocument(doc.imageUrl)}
              title="Click image to open full printable version"
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img
                src={doc.imageUrl}
                alt="Attached Document"
                style={{
                  maxWidth: '100%',
                  maxHeight: '260px',
                  borderRadius: '6px',
                  border: '2px solid #93c5fd',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
              <div style={{
                marginTop: '6px',
                fontSize: '11px',
                color: '#2563eb',
                fontWeight: '600'
              }}>
                🔍 Click image to preview & print full document
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
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
          padding: '9px 12px',
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
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{doc.title}</span>
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

                {doc.imageUrl && (
                  <button
                    type="button"
                    onClick={() => handlePrintDocument(doc.imageUrl)}
                    style={{
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🖨️ Direct Print
                  </button>
                )}

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
                  📥 Download Extract
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