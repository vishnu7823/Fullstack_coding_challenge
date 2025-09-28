import React, { useEffect, useState } from 'react';
import api from '../api';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simple: fetch stores where current user is owner via admin listStores and filter
    api.get('/admin/stores')
      .then(r => {
        const user = JSON.parse(localStorage.getItem('user'));
        setStores(r.data.filter(s => s.owner_id === user.id));
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h1>Store Owner Dashboard</h1>
        <p>Manage your stores and track performance</p>
      </div>

      {stores.length > 0 && (
        <div className="performance-overview">
          <h2>Performance Overview</h2>
          <div className="overview-stats">
            <div className="overview-stat">
              <div className="overview-stat-value">{stores.length}</div>
              <div className="overview-stat-label">Total Stores</div>
            </div>
            <div className="overview-stat">
              <div className="overview-stat-value">
                {(stores.reduce((acc, store) => acc + (store.overall_rating || 0), 0) / stores.length).toFixed(1)}
              </div>
              <div className="overview-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      )}

      <div className="stores-section">
        <div className="section-header">
          <h2 className="section-title">Your Stores</h2>
          <button className="add-store-btn">Add New Store</button>
        </div>

        {stores.length > 0 ? (
          <div className="owner-stores-grid">
            {stores.map((store) => (
              <div key={store.id} className="owner-store-card">
                <div className="store-header">
                  <h3 className="store-name">{store.name}</h3>
                  <p className="store-address">{store.address}</p>
                </div>
                
                <div className="store-stats">
                  <div className="stat-item">
                    <div className="stat-value">{store.overall_rating || '0.0'}</div>
                    <div className="stat-label">Rating</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Reviews</div>
                  </div>
                </div>

                <div className="store-actions">
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn view">View</button>
                  <button className="action-btn delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon"></span>
            <h3>No stores yet</h3>
            <p>Start by adding your first store to get started</p>
            <button className="add-store-btn">Add Your First Store</button>
          </div>
        )}
      </div>
    </div>
  );
}
