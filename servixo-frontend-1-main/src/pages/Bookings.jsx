import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import api from '../api';
import '../styles/Services.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safely grab user ID with fallback
  const storedUserId = localStorage.getItem("userId");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = storedUserId || storedUser?.id;

  const fetchBookings = async () => {
    try {
      if (!userId) return;
      const res = await api.get(`/bookings/user/${userId}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, []);

  if (!userId) {
    return <div style={{ padding: '40px', color: 'var(--text-dim)', textAlign: 'center' }}>Loading user data...</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCancel = async (bookingId) => {
    try {
      await bookingAPI.updateStatus(bookingId, 'CANCELLED');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert("Failed to cancel booking.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'COMPLETED') return { background: '#3b82f6', color: 'white' };
    if (s === 'ACCEPTED') return { background: '#22c55e', color: 'white' };
    if (s === 'REJECTED') return { background: '#ef4444', color: 'white' };
    return { background: '#eab308', color: 'white' };
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>My Bookings</h2>
        <p>Manage your upcoming and past service appointments.</p>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-card)', color: 'var(--text-dim)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '20px' }}>Service</th>
              <th style={{ padding: '20px' }}>Professional</th>
              <th style={{ padding: '20px' }}>Date</th>
              <th style={{ padding: '20px' }}>Status</th>
              <th style={{ padding: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading bookings...</td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px', fontWeight: '500' }}>{booking?.service?.title || 'Unknown Service'}</td>
                  <td style={{ padding: '20px' }}>{booking?.professional?.name || 'Professional'}</td>
                  <td style={{ padding: '20px' }}>{booking?.serviceDate || 'N/A'}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      ...getStatusBadge(booking.status)
                    }}>
                      {booking.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td style={{ padding: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {booking.status?.toUpperCase() === 'PENDING' || !booking.status ? (
                      <button 
                        className="btn" 
                        style={{ padding: '8px 12px', fontSize: '0.8rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #ef4444' }}
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    ) : booking.status?.toUpperCase() === 'ACCEPTED' ? (
                      <span style={{ fontWeight: '600', color: '#22c55e' }}>Accepted ✅</span>
                    ) : booking.status?.toUpperCase() === 'REJECTED' ? (
                      <span style={{ fontWeight: '600', color: '#ef4444' }}>Rejected ❌</span>
                    ) : booking.status?.toUpperCase() === 'COMPLETED' ? (
                      <span style={{ fontWeight: '600', color: '#3b82f6' }}>Completed 🎉</span>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No bookings found. <Link to="/user/services" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Book a service?</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
