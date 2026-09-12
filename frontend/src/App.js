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

  // Side-by-side Layout Styles
  const layoutStyles = {
    pageWrapper: {
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    },
    mainContainer: {
      maxWidth: '1350px',
      width: '100%',
      margin: '25px auto',
      padding: '0 20px',
      boxSizing: 'border-box'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '430px 1fr', // Left: Form, Right: Repository
      gap: '24px',
      alignItems: 'flex-start'
    },
    leftCol: {
      width: '100%'
    },
    rightCol: {
      width: '100%',
      minWidth: 0
    }
  };

  return (
    <div style={layoutStyles.pageWrapper}>
      {/* Top Navigation Bar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Side-by-Side 2-Column Grid */}
      <main style={layoutStyles.mainContainer}>
        <div style={layoutStyles.gridContainer}>
          {/* Left Side: Upload / Digitize Form */}
          <section style={layoutStyles.leftCol}>
            <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
          </section>

          {/* Right Side: Central Document Repository */}
          <section style={layoutStyles.rightCol}>
            <DocList
              documents={documents}
              search={search}
              setSearch={setSearch}
              onStatusUpdate={fetchDocuments}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;