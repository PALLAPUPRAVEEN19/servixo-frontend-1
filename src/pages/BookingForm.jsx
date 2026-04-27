import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Toast from '../components/Toast';
import '../styles/Services.css';
import '../styles/Profile.css';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    description: '',
    paymentMethod: 'card'
  });

  const service = location.state?.service || { price: 0, name: 'Selected Service' };

  if (!serviceId) {
    return (
      <div className="profile-page-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>No service selected.</h2>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/user/services')}>Browse Services</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isFormFilled = bookingData.date.trim() && bookingData.time.trim() && bookingData.address.trim();

  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userData = user || storedUser;

  const handleContinueToPayment = async () => {
    const activeUserId = userData?.id || userData?.userId || localStorage.getItem("userId");
    
    if (!activeUserId) {
      setToast({ message: "Please log in to make a booking.", type: "error" });
      navigate('/login');
      return;
    }

    if (!serviceId) {
      setToast({ message: "Service information is missing. Please try again.", type: "error" });
      navigate('/user/services');
      return;
    }

    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    let formattedDate = bookingData.date;
    if (formattedDate && formattedDate.includes('-')) {
      const parts = formattedDate.split('-');
      if (parts[2] && parts[2].length === 4) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    let formattedTime = bookingData.time;
    if (formattedTime) {
      const timeParts = formattedTime.split(':');
      if (timeParts.length === 2) {
        formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
      }
    }

    if (!formattedDate || formattedDate < today) {
      newErrors.date = "Service Date is required and must be a future date.";
    }
    if (!formattedTime) {
      newErrors.time = "Arrival Time is required.";
    }
    if (!bookingData.address || bookingData.address.trim().length < 10) {
      newErrors.address = "Service Address is required and must be at least 10 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    try {
      const payload = {
        serviceDate: formattedDate,
        arrivalTime: formattedTime,
        address: bookingData.address,
        instructions: bookingData.description || ""
      };
      
      const activeUserId = userData?.id || userData?.userId || localStorage.getItem("userId");
      
      const response = await bookingAPI.create({
        userId: activeUserId,
        serviceId: serviceId,
        ...payload
      });
      
      setToast({ message: "Booking Successful", type: "success" });
      
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/user/bookings');
      }, 1500); 

    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage = err.response?.data?.message || err.message || "Unable to create booking.";
      setToast({ message: ` ${errorMessage}`, type: "error" });
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);

    let formattedDate = bookingData.date;
    if (formattedDate && formattedDate.includes('-')) {
      const parts = formattedDate.split('-');
      if (parts[2] && parts[2].length === 4) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    let formattedTime = bookingData.time;
    if (formattedTime) {
      const timeParts = formattedTime.split(':');
      if (timeParts.length === 2) {
        formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
      }
    }

    try {
      const payload = {
        serviceDate: formattedDate,
        arrivalTime: formattedTime,
        address: bookingData.address,
        instructions: bookingData.description || ""
      };
      
      const response = await bookingAPI.create({
        userId: user.id,
        serviceId: serviceId,
        ...payload
      });
      
      setBookingData(prev => ({ ...prev, bookingId: response?.id }));
      
      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
      }, 1500); 

    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage = err.message?.includes('Failed') 
        ? err.message 
        : "Unable to create booking. Please check your details and try again.";
      setToast({ message: ` ${errorMessage}`, type: "error" });
      setIsProcessing(false);
    }
  };

  return (
    <div className="profile-page-container pt-8 md:pt-16 pb-16">
      <div className="profile-section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>
          Step {step} of 3
        </div>
        <h2 style={{ fontSize: '2.2rem' }}>{step === 1 ? 'Booking Details' : step === 2 ? 'Secure Payment' : step === 3 ? 'Review & Confirm' : 'Confirmed!'}</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600', marginTop: '10px' }}>
          {service.name || service.title} <span style={{ color: 'var(--text-dim)', fontWeight: '400' }}> Provided by {service.proName || 'Professional'}</span>
        </p>
      </div>

      <div className="profile-card glass" style={{ maxWidth: '650px', margin: '0 auto', borderTop: `4px solid var(--primary)`, padding: '40px', borderRadius: '16px', overflow: 'visible', position: 'relative', zIndex: 10 }}>
        
        {step === 1 && (
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginBottom: '20px', overflow: 'visible' }}>
              <div className="form-group" style={{ marginBottom: '0', overflow: 'visible', position: 'relative', zIndex: 20 }}>
                <label style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Service Date <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="date" 
                  name="date" 
                  onChange={handleChange} 
                  value={bookingData.date} 
                  style={{ 
                    borderColor: errors.date ? '#ef4444' : 'var(--border-color, #cbd5e1)',
                    background: '#ffffff',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'var(--text-main)'
                  }} 
                />
                {errors.date && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', fontWeight: '500' }}>{errors.date}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: '0', overflow: 'visible', position: 'relative', zIndex: 20 }}>
                <label style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Arrival Time <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="time" 
                  name="time" 
                  onChange={handleChange} 
                  value={bookingData.time} 
                  style={{ 
                    borderColor: errors.time ? '#ef4444' : 'var(--border-color, #cbd5e1)',
                    background: '#ffffff',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                  }} 
                />
                {errors.time && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', fontWeight: '500' }}>{errors.time}</p>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-dim)', fontWeight: 'bold' }}>Service Address <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="address" 
                placeholder="e.g. 123 Modern Ave, Suite 400" 
                onChange={handleChange} 
                value={bookingData.address} 
                style={{ 
                  borderColor: errors.address ? '#ef4444' : 'var(--bg-card)',
                  background: 'var(--bg-card)',
                  width: '100%'
                }} 
              />
              {errors.address && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', fontWeight: '500' }}>{errors.address}</p>}
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ color: 'var(--text-dim)', fontWeight: 'bold' }}>Special Instructions <span style={{fontWeight: 'normal', opacity: 0.6}}>(Optional)</span></label>
              <textarea 
                name="description" 
                placeholder="Any specific tools needed, entry instructions, or gate codes?"
                onChange={handleChange}
                value={bookingData.description}
                style={{ minHeight: '120px', background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ 
                marginTop: '10px', 
                width: '100%', 
                padding: '16px',
                fontSize: '1.1rem',
                opacity: (!isFormFilled || isProcessing) ? 0.6 : 1,
                cursor: (!isFormFilled || isProcessing) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }} 
              onClick={handleContinueToPayment}
              disabled={!isFormFilled || isProcessing}
            >
              {isProcessing ? "Processing..." : "Book Now"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="profile-form">
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" onChange={handleChange} value={bookingData.paymentMethod}>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI / Instant Pay</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
            
            {bookingData.paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="***" />
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="button" className="btn" style={{ background: 'var(--bg-card)', flex: 1 }} onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={nextStep}>Review Summary</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="profile-form">
            <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: 'var(--text-dim)' }}>
                <span style={{ fontWeight: '500' }}>{service.name || service.title}</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>${typeof service.price === 'number' ? service.price.toFixed(2) : service.price.toString().replace('$','')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: 'var(--text-dim)' }}>
                <span style={{ fontWeight: '500' }}>Processing & Platform Fee</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>$5.00</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid var(--border)', marginTop: '20px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>Total Amount</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--success)' }}>
                  ${(parseFloat(service.price?.toString().replace('$', '') || 0) + 5).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="button" className="btn" style={{ background: 'var(--bg-card)', flex: 1 }} onClick={prevStep}>Edit Details</button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ flex: 2, opacity: isProcessing ? 0.7 : 1 }} 
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing Payment..." : "Pay & Book"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '6rem', marginBottom: '30px', animation: 'slideDown 0.5s ease-out' }}></div>
            <h3 style={{ fontSize: '2.2rem', marginBottom: '10px', color: 'var(--success)', fontWeight: '900' }}>Booking Confirmed!</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '30px', fontSize: '1rem' }}>Your service has been successfully booked.</p>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '25px', 
              borderRadius: '16px', 
              border: '2px solid rgba(76, 175, 80, 0.3)',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Service</p>
                  <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>{service.title || service.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Professional</p>
                  <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>{service.proName || 'Assigned Professional'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Service Date & Time</p>
                  <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{bookingData.date} at {bookingData.time}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Amount Paid</p>
                  <p style={{ fontWeight: '900', color: 'var(--success)', fontSize: '1.1rem' }}>
                    ${(parseFloat(service.price?.toString().replace('$', '') || 0) + 5).toFixed(2)}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Service Location</p>
                  <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{bookingData.address}</p>
                </div>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-dim)', marginBottom: '40px', lineHeight: '1.8', fontSize: '0.95rem' }}>
              A notification has been sent to the professional. You'll receive updates via email and SMS. Check your bookings page to track the status.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '15px', fontSize: '1rem', fontWeight: '700' }} 
                onClick={() => navigate('/user/bookings')}
              >
                 View My Bookings
              </button>
              <button 
                className="btn" 
                style={{ background: 'var(--bg-card)', padding: '15px', fontSize: '0.95rem' }} 
                onClick={() => navigate('/user/services')}
              >
                Browse More Services
              </button>
              <button 
                className="btn" 
                style={{ background: 'var(--bg-card)', padding: '15px', fontSize: '0.95rem' }} 
                onClick={() => navigate('/user/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
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

export default BookingForm;
