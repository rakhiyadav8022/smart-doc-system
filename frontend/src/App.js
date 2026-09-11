import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import UploadDoc from './components/UploadDoc';
import DocList from './components/DocList';
import Auth from './components/Auth';
import './App.css';

const BACKEND_URL = 'https://smart-doc-system.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');

  // Check saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('doc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents?userId=${user.id}&search=${search}`);
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
    setUser(null);
    setDocuments([]);
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {!user ? (
          <Auth onLoginSuccess={(userData) => setUser(userData)} />
        ) : (
          <div className="dashboard-grid">
            <div className="grid-col left-col">
              <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
            </div>
            <div className="grid-col right-col">
              <DocList
                documents={documents}
                search={search}
                setSearch={setSearch}
                onStatusUpdate={fetchDocuments}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;