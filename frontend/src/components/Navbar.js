import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2>🏛️ Smart Digital Documentation Portal</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="badge-gov">Govt. of India / Digital Governance</span>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#fff', fontSize: '14px' }}>👤 {user.name}</span>
              <button 
                onClick={onLogout}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;