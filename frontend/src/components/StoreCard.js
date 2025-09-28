import React, { useState } from 'react';
import api from '../api';
import './StoreCard.css';

export default function StoreCard({ store, refresh }) {
  const [rate, setRate] = useState(store.user_rating || 0);

  const submit = async () => {
    try {
      await api.post(`/rating/${store.id}/rate`, { rating: Number(rate) });
      if (refresh) refresh();
    } catch (err) {
      alert('Rate failed');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  return (
    <div className="store-card">
      <div className="store-header">
        <h3 className="store-name">{store.name}</h3>
        <p className="store-address">{store.address}</p>
      </div>

      <div className="store-rating-section">
        <div className="overall-rating">
          <span className="rating-label">Overall Rating</span>
          <div className="rating-value">
            <span className="rating-stars">{renderStars(store.overall_rating)}</span>
            <span className="rating-number">{store.overall_rating || 'No ratings'}</span>
          </div>
        </div>

        <div className="rating-bar">
          <div 
            className="rating-fill" 
            style={{ width: `${(store.overall_rating / 5) * 100}%` }}
          ></div>
        </div>

        <div className="user-rating-section">
          <div className="rating-form">
            <div className="rating-input-group">
              <label>Your Rating</label>
              <select 
                className="rating-select"
                value={rate} 
                onChange={(e) => setRate(e.target.value)}
              >
                <option value="0">Select Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <button onClick={submit} className="rate-btn">
              Rate Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
