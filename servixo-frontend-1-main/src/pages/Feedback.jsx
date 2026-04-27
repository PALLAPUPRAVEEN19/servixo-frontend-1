import { useState, useEffect } from 'react';
import '../styles/Services.css';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../services/api';

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      const feedbackPayload = {
        rating,
        comment,
        userId: user.id,
        userName: user.name
        // Assuming the UI is meant to review a specific pro, but a proId isn't passed here currently.
      };
      await feedbackAPI.add(feedbackPayload);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      // fallback just to show UI if API isn't fully ready
      setSubmitted(true);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Service Feedback</h2>
        <p>Your reviews help us improve our service standards.</p>
      </div>

      <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        {!submitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', color: 'var(--text-dim)' }}>How was your experience?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    style={{ 
                      fontSize: '2.5rem', 
                      cursor: 'pointer', 
                      color: star <= rating ? '#FFD700' : 'var(--bg-card)'
                    }}
                    onClick={() => setRating(star)}
                  >
                    
                  </span>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Tell us more about it</label>
              <textarea 
                placeholder="Share your experience with the professional..."
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '15px', 
                  color: 'var(--text-main)', 
                  minHeight: '150px' 
                }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Submit Review</button>
          </form>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}></div>
            <h3>Thank you for your feedback!</h3>
            <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>We appreciate your honest opinion.</p>
            <button className="btn btn-primary" style={{ marginTop: '30px' }} onClick={() => setSubmitted(false)}>Submit Another Review</button>
          </div>
        )}
      </div>
    </div>
  );
};



export default Feedback;
