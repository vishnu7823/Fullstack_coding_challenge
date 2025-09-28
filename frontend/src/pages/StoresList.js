import React, { useEffect, useState } from 'react';
import api from '../api';
import StoreCard from '../components/StoreCard';
import './StoresList.css'; // Changed from StoreList.css

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/stores', { params: { search: q } });
      setStores(r.data);
    } catch (err) {
      console.error(err);
      alert('Error loading stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="stores-container">
      <div className="stores-header">
        <h1>Discover Stores</h1>
        <p>Find and rate amazing stores in your area</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <label>Search Stores</label>
            <input
              type="text"
              className="search-input"
              placeholder="Search for stores..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button onClick={load} className="search-btn">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading stores...</p>
        </div>
      ) : stores.length > 0 ? (
        <div className="stores-grid">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} refresh={load} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No stores found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
