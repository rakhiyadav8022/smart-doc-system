import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import UploadDoc from './components/UploadDoc';
import DocList from './components/DocList';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/documents?search=${search}`);
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [search]);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="dashboard-grid">
          <div className="grid-col left-col">
            <UploadDoc onUploadSuccess={fetchDocuments} />
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
      </main>
    </div>
  );
}

export default App;