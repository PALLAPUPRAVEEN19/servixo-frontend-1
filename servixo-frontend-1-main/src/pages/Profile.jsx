import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
  };

  return (
    <div className="profile-page-container">
      <div className="profile-section-header">
        <h2>Your Profile</h2>
        <p>Manage your account settings and security.</p>
      </div>

      <div className="profile-grid">
        {/* Personal Info */}
        <div className="profile-card">
          <h3><span className="icon"></span> Personal Information</h3>
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your name"
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Save Changes</button>
          </form>
        </div>

        {/* Security */}
        <div className="profile-card">
          <h3><span className="icon"></span> Security Settings</h3>
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="oldPassword" placeholder="" onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" placeholder="" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="" onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Update Password</button>
          </form>
        </div>
      </div>

      {message.text && (
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          borderRadius: '12px', 
          background: message.type === 'success' ? 'var(--success)' : 'var(--error)', 
          textAlign: 'center',
          color: 'var(--text-main)',
          fontWeight: '700'
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
};



export default Profile;
