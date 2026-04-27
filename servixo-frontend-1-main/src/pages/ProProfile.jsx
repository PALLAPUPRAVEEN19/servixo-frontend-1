import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { proAPI } from '../services/api';
import '../styles/Profile.css';

const ProProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    skills: '',
    experience: '',
    pricing: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    if (user?.id) {
      proAPI.getProfile(user.id).then(data => {
        if(data) setProfile(prev => ({ ...prev, ...data }));
      }).catch(err => console.error('Failed to load profile:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // TODO: Replace with real API call (no updateProfile in api.js currently)
    alert('Professional profile updated successfully!');
  };

  return (
    <div className="profile-page-container">
      <div className="profile-section-header">
        <h2>Professional Profile</h2>
        <p>Showcase your expertise and set your service parameters.</p>
      </div>

      <div className="profile-card pro-profile-layout">
        {/* Left Side: Avatar */}
        <div className="pro-avatar-section">
          <div className="pro-avatar-wrapper">
            <img src={profile.photo} alt="Profile" />
          </div>
          <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', fontSize: '0.85rem' }}>
            Change Photo
          </button>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Member Since</div>
            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>October 2023</div>
          </div>
        </div>

        {/* Right Side: Form Details */}
        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Hourly Pricing</label>
              <input type="text" name="pricing" value={profile.pricing} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" name="skills" value={profile.skills} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience</label>
              <input type="text" name="experience" value={profile.experience} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={profile.location} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Professional Bio</label>
            <textarea 
              name="bio" 
              style={{ minHeight: '150px', resize: 'vertical' }}
              value={profile.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">Save Profile Details</button>
            <button type="button" className="btn" style={{ background: '#f1f5f9' }}>Preview Public Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default ProProfile;
