import React from 'react';
import Navbar from './components/Navbar';
import UploadDoc from './components/UploadDoc';
import DocList from './components/DocList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <div className="main-content">
        {/* Left Form Section */}
        <div className="left-panel">
          <UploadDoc />
        </div>

        {/* Right Repository Section */}
        <div className="right-panel">
          <DocList />
        </div>
      </div>
    </div>
  );
}

export default App;