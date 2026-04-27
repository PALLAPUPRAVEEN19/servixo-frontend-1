import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import '../styles/Services.css';

const statusColors = {
  open: { bg: '#fee2e2', color: 'var(--error)' },
  'in-progress': { bg: 'var(--primary-glow)', color: 'var(--primary)' },
  resolved: { bg: 'var(--success)', color: 'var(--text-main)' },
  closed: { bg: 'var(--bg-card)', color: 'var(--text-dim)' }
};

const MyTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchTickets = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID missing");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/tickets/user/${userId}`);
        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);

  const statusMap = {
    all: null,
    open: "OPEN",
    "in-progress": "IN_PROGRESS",
    resolved: "RESOLVED",
    closed: "CLOSED"
  };

  const filteredTickets = tickets.filter(ticket => {
    const selectedTab = filterStatus.toLowerCase();
    if (!statusMap[selectedTab]) return true;
    return ticket.status?.toUpperCase() === statusMap[selectedTab];
  });

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2>My Tickets</h2>
            <p>Track the status of your support requests.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/raise-ticket')}>+ Raise New Ticket</button>
        </div>
        <div className="filter-group" style={{ marginTop: '15px' }}>
          {['All', 'Open', 'In-Progress', 'Resolved', 'Closed'].map(status => (
            <div
              key={status}
              className={`filter-tag ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
          Loading your tickets...
        </div>
      ) : filteredTickets.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredTickets.map(ticket => {
            const sc = statusColors[ticket.status?.toLowerCase()] || statusColors.open;
            return (
              <div
                key={ticket.id}
                className="glass"
                style={{
                  padding: '25px 30px',
                  borderRadius: '20px',
                  borderLeft: `4px solid ${sc.color}`,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onClick={() => navigate('/my-ticket-detail', { state: { ticket } })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', fontFamily: 'monospace' }}>{ticket.id}</span>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        background: sc.bg,
                        color: sc.color
                      }}>
                        {ticket.status?.toUpperCase()}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{ticket.title || ticket.subject}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                      {ticket.description?.length > 120 ? ticket.description.slice(0, 120) + '...' : ticket.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '5px' }}>{formatDate(ticket.createdAt)}</div>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      background: 'var(--bg-card)',
                      color: 'var(--text-dim)'
                    }}>
                      {ticket.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass" style={{ padding: '60px', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}></div>
          <h3 style={{ marginBottom: '10px' }}>No tickets found</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '25px' }}>
            {filterStatus === 'All' ? "You haven't raised any support tickets yet." : `No ${filterStatus.toLowerCase()} tickets.`}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/raise-ticket')}>Raise a Ticket</button>
        </div>
      )}
    </div>
  );
};



export default MyTickets;
