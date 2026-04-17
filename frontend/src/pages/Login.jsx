import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'resident' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await axios.post('http://localhost:5000/api/auth/register', formData);
        setIsRegister(false); // Switch to login after register
      } else {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-cyan)' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <div style={{ color: 'var(--accent-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="resident">Resident</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            style={{ color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Login' : 'Register Here'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
