import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import '../styles/Services.css';

const Tickets = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (t.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Support Tickets</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search tickets by ID, user or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
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

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-card)', color: 'var(--text-dim)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '20px' }}>Ticket ID</th>
              <th style={{ padding: '20px' }}>User</th>
              <th style={{ padding: '20px' }}>Subject</th>
              <th style={{ padding: '20px' }}>Category</th>
              <th style={{ padding: '20px' }}>Status</th>
              <th style={{ padding: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '20px', color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace' }}>{ticket.id}</td>
                <td style={{ padding: '20px' }}>{ticket.userName}</td>
                <td style={{ padding: '20px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</td>
                <td style={{ padding: '20px' }}>{ticket.category}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    background: ticket.status === 'open' ? '#fee2e2' : ticket.status === 'in-progress' ? 'var(--primary-glow)' : ticket.status === 'resolved' ? 'var(--success)' : 'var(--bg-card)',
                    color: ticket.status === 'resolved' ? 'white' : ticket.status === 'open' ? 'var(--error)' : ticket.status === 'closed' ? 'var(--text-dim)' : 'var(--primary)'
                  }}>
                    {ticket.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => navigate('/ticket-details', { state: { ticket } })}>View</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default Tickets;
