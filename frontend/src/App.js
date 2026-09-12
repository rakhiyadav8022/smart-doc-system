import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import UploadDoc from './components/UploadDoc';
import DocList from './components/DocList';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('doc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchDocuments = async () => {
    const activeUser = user || JSON.parse(localStorage.getItem('doc_user') || '{}');
    const userId = activeUser?.id || activeUser?._id;
    if (!userId) return;

    try {
      const response = await axios.get(
        `https://smart-doc-system.onrender.com/api/documents?userId=${userId}&search=${search}`
      );
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, search]);

  const handleLogout = () => {
    localStorage.removeItem('doc_user');
    localStorage.removeItem('doc_token');
    setUser(null);
    setDocuments([]);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{
        maxWidth: '1320px',
        width: '100%',
        margin: '24px auto',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        {/* Strict CSS Grid - Har column ki boundary locked hai */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
          width: '100%'
        }}>
          {/* Left Column: Form */}
          <div style={{ width: '100%', position: 'relative', margin: 0 }}>
            <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
          </div>

          {/* Right Column: Repository */}
          <div style={{ width: '100%', minWidth: 0, position: 'relative', margin: 0 }}>
            <DocList
              documents={documents}
              search={search}
              setSearch={setSearch}
              onStatusUpdate={fetchDocuments}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;