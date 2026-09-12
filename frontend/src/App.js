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
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '24px auto',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}>
        {/* Clean Flex Layout to prevent overlap */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          {/* Left Form: Fixed comfortable width */}
          <div style={{
            width: '380px',
            flexShrink: 0
          }}>
            <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
          </div>

          {/* Right Repository: Takes rest of the available width cleanly */}
          <div style={{
            flex: 1,
            minWidth: 0
          }}>
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