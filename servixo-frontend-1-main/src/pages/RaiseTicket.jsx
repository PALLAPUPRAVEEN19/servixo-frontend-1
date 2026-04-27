import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/Profile.css';

const categories = ['Payment Issue', 'Technical Problem', 'Account Issue', 'Service Complaint', 'Booking Problem', 'Other'];

const RaiseTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const isFormValid = formData.subject.trim() !== '' && 
                      formData.category !== '' && 
                      formData.description.trim() !== '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID missing");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.subject,
        description: formData.description,
        category: formData.category
      };
      
      // 1. API Integration & Mapping
      await api.post(`/tickets?userId=${userId}`, payload);
      
      // 5. Success handling
      setToast({ message: "Ticket submitted successfully", type: "success" });
      setFormData({ subject: '', category: '', description: '' });
      setTimeout(() => {
        navigate('/my-tickets');
      }, 1500);

    } catch (error) {
      console.error('Failed to submit ticket:', error);
      // 6. Error handling
      setToast({ message: "Failed to submit ticket. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-section-header" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}></div>
        <h2>Raise a Support Ticket</h2>
        <p>Having an issue? Let us know and our support team will get back to you shortly.</p>
      </div>

      <div className="profile-card" style={{ maxWidth: '650px', width: '100%', margin: '0 auto', borderTop: '4px solid var(--primary)', boxSizing: 'border-box' }}>
        <form className="profile-form" onSubmit={handleSubmit} style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="form-group">
            <label>Issue Category <span style={{color: 'red'}}>*</span></label>
            <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', boxSizing: 'border-box' }}>
              <option value="" disabled>Select a category...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subject <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              name="subject"
              placeholder="Brief summary of your issue"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div className="form-group">
            <label>Describe Your Issue <span style={{color: 'red'}}>*</span></label>
            <textarea
              name="description"
              placeholder="Please provide as much detail as possible so we can help you quickly..."
              value={formData.description}
              onChange={handleChange}
              style={{ minHeight: '180px', width: '100%', boxSizing: 'border-box', overflowY: 'auto' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                flex: 2, 
                opacity: (!isFormValid || isSubmitting) ? 0.6 : 1,
                cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer'
              }}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
            <button 
              type="button" 
              className="btn" 
              style={{ flex: 1, background: 'var(--bg-card)' }} 
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};



export default RaiseTicket;
