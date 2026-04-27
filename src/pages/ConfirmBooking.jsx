import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { bookingAPI } from '../services/api';
import '../styles/Profile.css';

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Read booking data from localStorage
    const savedBookingData = localStorage.getItem('bookingData');
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    } else {
      navigate('/user/services'); // Redirect if no booking data
    }

    // Read user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!bookingData || !userData) {
    return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;
  }

  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    try {
      // POST /api/bookings?userId={userId}&serviceId={serviceId}
      const payload = {
        serviceDate: bookingData.serviceDate,
        arrivalTime: bookingData.arrivalTime,
        address: bookingData.address,
        instructions: bookingData.instructions || ""
      };
      
      const response = await bookingAPI.create({
        userId: userData.id,
        serviceId: bookingData.serviceId || bookingData.service?.id || bookingData.service?.serviceId,
        ...payload
      });
      
      setToast({ message: "Booking Successful", type: "success" });
      
      setTimeout(() => {
        setIsProcessing(false);
        localStorage.removeItem('bookingData');
        navigate('/user/bookings');
      }, 1500); 

    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage = err.response?.data?.message || err.message || "Unable to create booking.";
      setToast({ message: ` ${errorMessage}`, type: "error" });
      setIsProcessing(false);
    }
  };

  const { service } = bookingData;

  return (
    <div className="profile-page-container pt-8 md:pt-16 pb-16">
      <div className="profile-section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
        <h2 style={{ fontSize: '2.2rem' }}>Confirm Booking</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600', marginTop: '10px' }}>
          Please review your booking details before confirming.
        </p>
      </div>

      <div className="profile-card glass" style={{ maxWidth: '500px', margin: '0 auto', borderTop: `4px solid var(--primary)`, padding: '40px', borderRadius: '16px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Service</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{service?.title || service?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Professional</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{service?.proName || 'Assigned Professional'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Date</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{bookingData.serviceDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Time</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{bookingData.arrivalTime}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Address</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '700', textAlign: 'right', maxWidth: '60%' }}>{bookingData.address}</span>
          </div>
          {bookingData.instructions && (
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <span style={{ color: 'var(--text-dim)', fontWeight: '500' }}>Instructions</span>
               <span style={{ color: 'var(--text-main)', fontWeight: '700', textAlign: 'right', maxWidth: '60%' }}>{bookingData.instructions}</span>
             </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ background: 'var(--bg-card)', flex: 1 }} 
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ flex: 2, opacity: isProcessing ? 0.7 : 1 }} 
            onClick={handleConfirmBooking}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
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

export default ConfirmBooking;
