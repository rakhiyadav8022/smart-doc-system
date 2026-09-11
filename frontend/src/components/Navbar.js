import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>🏛️ Smart Digital Documentation Portal</h2>
          <span className="badge-gov">Govt. of India / Digital Governance</span>
        </div>

        {user && (
          <div className="user-badge">
            <span className="user-tag">👤 {user.name}</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;