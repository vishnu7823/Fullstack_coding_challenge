import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/auth/signup', form);
      setMsg('Signup success. Please login.');
      setTimeout(() => nav('/login'), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.error || err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <form className="signup-form" onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              placeholder="Enter your address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>
        {msg && <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>{msg}</div>}
        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
}
