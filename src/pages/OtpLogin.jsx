import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/OtpLogin.css';

const OtpLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear stale tokens automatically on mount to prevent session pollution
    sessionStorage.clear();
    localStorage.clear();
  }, []);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.sendOtp(email.trim().toLowerCase());
      setStep(2);
      setSuccessMsg('OTP has been sent to your email.');
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to send OTP. User might not exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp) {
      setErrorMsg('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setErrorMsg('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/auth/verify-login-otp
      const res = await authAPI.verifyLoginOtp(email.trim().toLowerCase(), otp.trim());
      processLoginSuccess(res);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const processLoginSuccess = (data) => {
    // Add debug logs strictly as requested
    console.log("LOGIN ROLE:", data.role);

    // 1. Properly Save Data
    const token = data.token || data.jwt || data.accessToken;
    if (token) sessionStorage.setItem("token", token);
    
    // Normalize role string securely
    const rawRole = typeof data.role === 'string' ? data.role : data.role?.name;
    const normalizedRole = rawRole?.toUpperCase().replace(/^ROLE_/, '');
    
    if (normalizedRole) localStorage.setItem("role", normalizedRole);
    
    const userId = data.userId || data.id;
    if (userId) localStorage.setItem("userId", userId);
    
    console.log("ROLE:", localStorage.getItem("role"));
    console.log("TOKEN:", sessionStorage.getItem("token"));
    
    // Preserve backwards compatibility for global App context
    localStorage.setItem('user', JSON.stringify({ ...data, role: normalizedRole, userId }));
    localStorage.setItem('isLoggedIn', 'true');

    // 2. Role-Based Navigation (RBAC) exactly as requested
    if (normalizedRole === 'USER') navigate('/user/dashboard');
    else if (normalizedRole === 'PROFESSIONAL') navigate('/professional/dashboard');
    else if (normalizedRole === 'ADMIN') navigate('/admin/dashboard');
    else if (normalizedRole === 'SUPPORT') navigate('/support/dashboard');
    else setErrorMsg("Unauthorized role detected");
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await authAPI.sendOtp(email.trim().toLowerCase());
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-auth-page">
      <div className="otp-auth-container">
        <div className="otp-auth-header">
          <h1 className="otp-logo-text">SERVIXO</h1>
          <p>{step === 1 ? 'Login with OTP' : 'Verify OTP'}</p>
        </div>

        {errorMsg && <div className="otp-error-message">{errorMsg}</div>}
        {successMsg && <div className="otp-success-message">{successMsg}</div>}

        {step === 1 ? (
          <form className="otp-auth-form" onSubmit={handleSendOtp}>
            <div className="otp-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="otp-btn-primary" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="otp-auth-form" onSubmit={handleVerifyOtp}>
            <div className="otp-input-group">
              <label>Enter 6-digit OTP</label>
              <input 
                type="text" 
                placeholder="••••••" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="otp-btn-primary" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" className="otp-resend-btn" onClick={handleResendOtp} disabled={isLoading}>
              Resend OTP
            </button>
          </form>
        )}

        <div className="otp-auth-footer">
          Back to <Link to="/login">Password Login</Link>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;
