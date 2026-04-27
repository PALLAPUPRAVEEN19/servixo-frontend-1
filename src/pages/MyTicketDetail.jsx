import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import '../styles/Services.css';

const MyTicketDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, addMessage } = useTickets();
  const [newMessage, setNewMessage] = useState('');

  const ticketFromState = location.state?.ticket;
  const ticket = tickets.find(t => t.id === ticketFromState?.id) || ticketFromState;

  if (!ticket) {
    return (
      <div className="search-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Ticket not found</h2>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/my-tickets')}>Back to My Tickets</button>
      </div>
    );
  }

  const statusColors = {
    open: { bg: '#fee2e2', color: 'var(--error)' },
    'in-progress': { bg: 'var(--primary-glow)', color: 'var(--primary)' },
    resolved: { bg: 'var(--success)', color: 'var(--text-main)' },
    closed: { bg: 'var(--bg-card)', color: 'var(--text-dim)' }
  };

  const sc = statusColors[ticket.status] || statusColors.open;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    addMessage(ticket.id, {
      sender: user?.name || 'User',
      role: 'user',
      text: newMessage.trim()
    });
    setNewMessage('');
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="search-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <button className="btn" style={{ background: 'var(--bg-card)', padding: '6px 15px', fontSize: '0.8rem', marginBottom: '15px' }} onClick={() => navigate('/my-tickets')}>← Back to My Tickets</button>
          <h2>{ticket.subject}</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'monospace', fontWeight: '700' }}>{ticket.id}</span>
            <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: sc.bg, color: sc.color }}>
              {ticket.status.toUpperCase()}
            </span>
            <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: 'var(--bg-card)', color: 'var(--text-dim)' }}>
              {ticket.category}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
        {/* Conversation Thread */}
        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1rem' }}>Conversation</h3>
          </div>

          <div style={{ padding: '25px 30px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, maxHeight: '450px', overflowY: 'auto' }}>
            {(ticket.messages || []).map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{
                  padding: '14px 20px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-card)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px', opacity: 0.8 }}>
                    {msg.sender} {msg.role === 'support' && '(Support)'} {msg.role === 'admin' && '(Admin)'}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.text}</p>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '5px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          {ticket.status !== 'closed' && (
            <form onSubmit={handleSendMessage} style={{ padding: '20px 30px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Type a reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 18px', color: 'var(--text-main)' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 25px' }}>Send</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};



export default MyTicketDetail;
