import React from 'react';
import axios from 'axios';

function DocList({ documents, search, setSearch, onStatusUpdate }) {
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/documents/${id}/status`, {
        status: newStatus
      });
      onStatusUpdate();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocList;