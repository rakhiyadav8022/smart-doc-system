import React from 'react';

function Navbar({ user, onLogout }) {
  const styles = {
    navbar: {
      backgroundColor: '#0f172a', // Deep official navy
      borderBottom: '2px solid #1e3a8a',
      padding: '12px 24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    },
    navContainer: {
      maxWidth: '1250px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0,
      letterSpacing: '0.3px'
    },
    subtitleTag: {
      fontSize: '11px',
      color: '#38bdf8',
      fontWeight: '600',
      letterSpacing: '0.4px'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    userBadge: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      color: '#f8fafc',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    logoutBtn: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      padding: '7px 16px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    }
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Left Side: Official Title */}
        <div style={styles.brandSection}>
          <div style={styles.titleRow}>
            <span style={{ fontSize: '20px' }}>🏛️</span>
            <h2 style={styles.title}>Smart Digital Documentation Portal</h2>
          </div>
          <span style={styles.subtitleTag}>Govt. of India / Digital Governance</span>
        </div>

        {/* Right Side: Logged-in User Profile & Logout */}
        <div style={styles.userSection}>
          <div style={styles.userBadge}>
            <span>👤</span>
            <span>{user?.name || 'Citizen'}</span>
          </div>
          <button
            type="button"
            style={styles.logoutBtn}
            onClick={onLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#dc2626')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;