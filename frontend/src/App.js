import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import UploadDoc from './components/UploadDoc';
import DocList from './components/DocList';
import Login from './components/Login';
import './App.css';

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
    if (!user) return;
    try {
      const response = await axios.get(
        `https://smart-doc-system.onrender.com/api/documents?userId=${user.id}&search=${search}`
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
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-wrapper">
        <div className="content-grid">
          <div className="left-panel">
            <UploadDoc user={user} onUploadSuccess={fetchDocuments} />
          </div>
          <div className="right-panel">
            <DocList
              documents={documents}
              search={search}
              setSearch={setSearch}
              onStatusUpdate={fetchDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;