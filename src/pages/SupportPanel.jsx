import { useState, useEffect } from 'react';
import { ticketAPI } from '../services/api';
import Toast from '../components/Toast';

const SupportPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketAPI.getAll();
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
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ticketAPI.updateStatus(id, newStatus);
      setToast({ message: `Ticket status updated to ${newStatus}`, type: 'success' });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update ticket status.', type: 'error' });
    }
  };

  const getBadgeStyle = (status) => {
    const s = status?.toUpperCase() || 'OPEN';
    if (s === 'OPEN') return { backgroundColor: '#3b82f6', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    if (s === 'IN_PROGRESS' || s === 'IN-PROGRESS') return { backgroundColor: '#f97316', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    if (s === 'RESOLVED') return { backgroundColor: '#22c55e', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    if (s === 'CLOSED') return { backgroundColor: '#6b7280', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    return { backgroundColor: '#6b7280', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h2>Support Panel</h2>
      <p>Manage and resolve all customer support tickets.</p>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '10px' }}>
        {loading ? <p>Loading tickets...</p> : error ? <p style={{ color: '#ef4444' }}>{error}</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Title & Desc</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>#{ticket.id}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{ticket.title || ticket.subject}</div>
                    <div style={{ color: '#aaa', fontSize: '0.85rem' }}>{ticket.description}</div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: '#ccc' }}>{ticket.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={getBadgeStyle(ticket.status)}>
                      {ticket.status?.toUpperCase() || 'OPEN'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <select
                      value={ticket.status?.toUpperCase() || 'OPEN'}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      style={{ padding: '8px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '5px' }}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>No tickets available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupportPanel;
