import { useState, useEffect } from 'react';
import '../styles/Services.css';
import { useAuth } from '../context/AuthContext';
import { proAPI, bookingAPI } from '../services/api';

const ProBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in professional ID directly from localStorage as requested
  const storedUserId = localStorage.getItem("userId");
  
  // Safe fallback if 'userId' isn't explicitly set yet (grabs from existing user object)
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const professionalId = storedUserId || storedUser?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!professionalId) return;
        const data = await proAPI.getBookings(professionalId);
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [professionalId]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      // Instantly reflect UI changes without reload
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Job Requests</h2>
        <p>Accept or manage incoming bookings from your clients.</p>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--code-bg)', color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '20px' }}>User</th>
              <th style={{ padding: '20px' }}>Service</th>
              <th style={{ padding: '20px' }}>Date & Time</th>
              <th style={{ padding: '20px' }}>Status</th>
              <th style={{ padding: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-main)' }}>Loading bookings...</td>
              </tr>
            ) : bookings.length > 0 ? bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '20px', fontWeight: '600' }}>{booking?.user?.name || 'Unknown User'}</td>
                <td style={{ padding: '20px' }}>{booking?.service?.title || 'Unknown Service'}</td>
                <td style={{ padding: '20px' }}>{booking?.serviceDate || booking?.date} at {booking?.arrivalTime || booking?.time}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: booking.status === 'COMPLETED' ? '#3b82f6' : booking.status === 'ACCEPTED' ? '#22c55e' : booking.status === 'REJECTED' ? '#ef4444' : '#eab308',
                    color: 'white'
                  }}>
                    {(booking.status || 'PENDING').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px', display: 'flex', gap: '8px' }}>
                  {(booking.status?.toUpperCase() === 'PENDING' || !booking.status) && (
                    <>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto' }} onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}>Accept</button>
                      <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fee2e2', color: '#ef4444', height: 'auto' }} onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}>Reject</button>
                    </>
                  )}
                  {booking.status?.toUpperCase() === 'ACCEPTED' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto' }} onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}>Mark Completed</button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No job requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProBookings;
