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
      {/* Top Header */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Centered Single-Column Main Container */}
      <main style={{
        maxWidth: '760px', // Screen ke beech mein balanced width
        width: '100%',
        margin: '28px auto',
        padding: '0 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px' // Form aur Repository ke beech neat spacing
      }}>
        {/* 1. Digitize New Record Form (Screen ke bilkul center mein) */}
        <section style={{ width: '100%' }}>
          <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
        </section>

        {/* 2. Central Document Repository (Form ke theek neeche) */}
        <section style={{ width: '100%' }}>
          <DocList
            documents={documents}
            search={search}
            setSearch={setSearch}
            onStatusUpdate={fetchDocuments}
          />
        </section>
      </main>
    </div>
  );
}

export default App;