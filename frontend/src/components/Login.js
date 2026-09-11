import React, { useState } from 'react';
import axios from 'axios';
import '../Login.css';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://smart-doc-system.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isRegister) {
        alert('Account created successfully! Please login with your password.');
        setIsRegister(false);
      } else {
        localStorage.setItem('doc_user', JSON.stringify(response.data.user));
        localStorage.setItem('doc_token', response.data.token);
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🏛️ Citizen Digital Vault</h2>
          <p>{isRegister ? 'Register your individual registry account' : 'Sign in to manage your secured records'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-form-group">
            <label>Official Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Master Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Validating...' : isRegister ? 'Create Account' : 'Authenticate & Login'}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
          <span
            className="auth-toggle-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Login Here' : 'Register Here'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;