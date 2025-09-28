import React, { useEffect, useState } from 'react';
import api from '../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => {
        setCounts(r.data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform analytics and overview</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card users">
          <span className="stat-icon"></span>
          <span className="stat-number">{counts.totalUsers || 0}</span>
          <span className="stat-label">Total Users</span>
        </div>

        <div className="stat-card stores">
          <span className="stat-icon"></span>
          <span className="stat-number">{counts.totalStores || 0}</span>
          <span className="stat-label">Total Stores</span>
        </div>

        <div className="stat-card ratings">
          <span className="stat-icon"></span>
          <span className="stat-number">{counts.totalRatings || 0}</span>
          <span className="stat-label">Total Ratings</span>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="actions-header">
          <h2>Quick Actions</h2>
          <p>Manage your platform efficiently</p>
        </div>
        <div className="actions-grid">
          <button className="action-btn primary">Manage Users</button>
          <button className="action-btn secondary">Manage Stores</button>
          <button className="action-btn success">View Reports</button>
        </div>
      </div>
    </div>
  );
}
