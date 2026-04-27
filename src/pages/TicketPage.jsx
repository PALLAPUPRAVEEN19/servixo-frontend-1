import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketAPI } from '../services/api';
import Toast from '../components/Toast';

const TicketPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General' });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchTickets = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await ticketAPI.getByUser(userId);
      setTickets(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('User ID missing');
      return;
    }
    
    try {
      const payload = {
        title: formData.title,
        subject: formData.title, // providing both title and subject to be safe
        description: formData.description,
        category: formData.category
      };

      await ticketAPI.create(userId, payload);
      
      setToast({ message: 'Ticket created successfully!', type: 'success' });
      setFormData({ title: '', description: '', category: 'General' });
      fetchTickets();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to create ticket.', type: 'error' });
    }
  };

  const getBadgeStyle = (status) => {
    const s = status?.toUpperCase() || 'OPEN';
    if (s === 'OPEN') return { backgroundColor: '#3b82f6', color: 'var(--text-main)' };
    if (s === 'IN_PROGRESS' || s === 'IN-PROGRESS') return { backgroundColor: '#f97316', color: 'var(--text-main)' };
    if (s === 'RESOLVED') return { backgroundColor: '#22c55e', color: 'var(--text-main)' };
    if (s === 'CLOSED') return { backgroundColor: '#6b7280', color: 'var(--text-main)' };
    return { backgroundColor: '#6b7280', color: 'var(--text-main)' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box', color: 'var(--text-main)' }}>
      <h2>Support Center</h2>
      <p>Submit a request or verify the status of your existing tickets.</p>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', boxSizing: 'border-box', width: '100%' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>Raise New Ticket</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="General">General</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
            </select>
          </div>
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', minHeight: '120px', boxSizing: 'border-box', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <button type="submit" style={{ padding: '14px', background: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', marginTop: '10px', transition: 'background 0.2s', width: '100%', boxSizing: 'border-box' }}>
            Submit Ticket
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '10px' }}>
        <h3>My Tickets</h3>
        {loading ? <p>Loading tickets...</p> : error ? <p style={{ color: '#ef4444' }}>{error}</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {tickets.length === 0 ? <p>No tickets found.</p> : tickets.map(ticket => (
              <div key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '15px', borderLeft: `4px solid ${getBadgeStyle(ticket.status).backgroundColor}`, borderRadius: '0 8px 8px 0' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>#{ticket.id}</span>
                    <span style={{ ...getBadgeStyle(ticket.status), padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      {ticket.status?.toUpperCase() || 'OPEN'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#888', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{ticket.category}</span>
                  </div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{ticket.title || ticket.subject}</h4>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#aaa' }}>{ticket.description}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{formatDate(ticket.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
