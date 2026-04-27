import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import Toast from '../components/Toast';
import '../styles/Services.css';

const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, updateTicket, addMessage } = useTickets();
  const [newMessage, setNewMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const ticketFromState = location.state?.ticket;
  const ticket = tickets.find(t => t.id === ticketFromState?.id) || ticketFromState;

  if (!ticket) {
    return (
      <div className="search-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Ticket not found</h2>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/tickets')}>Back to Tickets</button>
      </div>
    );
  }

  const [status, setStatus] = useState(ticket?.status || 'open');
  const [priority, setPriority] = useState(ticket?.priority || 'medium');

  const handleUpdate = () => {
    updateTicket(ticket.id, { status, priority });
    setShowToast(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const role = user?.role === 'admin' ? 'admin' : 'support';
    addMessage(ticket.id, {
      sender: user?.name || 'Support Agent',
      role,
      text: newMessage.trim()
    });
    setNewMessage('');
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <button className="btn" style={{ background: 'var(--bg-card)', padding: '6px 15px', fontSize: '0.8rem', marginBottom: '15px' }} onClick={() => navigate('/tickets')}>← Back to Tickets</button>
            <h2>Ticket: {ticket.id}</h2>
            <p style={{ color: 'var(--text-dim)' }}>
              Raised by: <strong>{ticket.userName}</strong> ({ticket.userEmail}) | Category: {ticket.category}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleUpdate}>Update Ticket</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Conversation */}
        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1rem' }}>Conversation — {ticket.subject}</h3>
          </div>

          <div style={{ padding: '25px 30px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
            {(ticket.messages || []).map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                <div style={{
                  padding: '14px 20px',
                  borderRadius: msg.role === 'user' ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
                  background: msg.role === 'user' ? 'var(--bg-card)' : msg.role === 'admin' ? 'var(--accent)' : 'var(--primary)',
                  color: msg.role === 'user' ? 'var(--text-main)' : 'white'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px', opacity: 0.8 }}>
                    {msg.sender} {msg.role === 'user' && '(Customer)'} {msg.role === 'support' && '(Support)'} {msg.role === 'admin' && '(Admin)'}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.text}</p>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '5px', textAlign: msg.role === 'user' ? 'left' : 'right' }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <form onSubmit={handleSendMessage} style={{ padding: '20px 30px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Type your reply to the customer..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 18px', color: 'var(--text-main)' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 25px' }}>Reply</button>
            </div>
          </form>
        </div>

        {/* Controls */}
        <div className="glass" style={{ padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <h3>Ticket Controls</h3>
          <div className="input-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="input-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Created</span>
              <span style={{ fontSize: '0.85rem' }}>{formatDate(ticket.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Messages</span>
              <span style={{ fontSize: '0.85rem' }}>{(ticket.messages || []).length}</span>
            </div>
          </div>
        </div>
      </div>

      {showToast && <Toast message="Ticket updated successfully!" type="success" onClose={() => setShowToast(false)} />}
    </div>
  );
};



export default TicketDetails;
