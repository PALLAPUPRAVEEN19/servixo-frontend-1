import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const { googleAuthLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await googleAuthLogin(credentialResponse.credential);
      processLoginSuccess(res);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Google Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/auth/login
      const res = await authAPI.login(email.trim().toLowerCase(), password);
      
      // Show OTP input after success
      if (res && res.status === 'OTP_REQUIRED') {
        setStep(2);
        setSuccessMsg('OTP has been sent to your email.');
        return;
      }
      
      // Fallback if no OTP required
      processLoginSuccess(res);
      
    } catch (error) {
      // Correct catch syntax and safe logging
      console.error(error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp || otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/auth/verify-login-otp
      const res = await authAPI.verifyLoginOtp(email.trim().toLowerCase(), otp.trim());
      processLoginSuccess(res);
    } catch (error) {
      // Correct catch syntax and safe logging
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

    // 2. Role-Based Navigation (RBAC)
    if (normalizedRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (normalizedRole === 'PROFESSIONAL') {
      navigate('/professional/dashboard');
    } else if (normalizedRole === 'SUPPORT') {
      navigate('/support/dashboard');
    } else if (normalizedRole === 'USER') {
      navigate('/user/dashboard');
    } else {
      setErrorMsg("Unauthorized role detected");
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await authAPI.login(email.trim().toLowerCase(), password);
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="logo-text">SERVIXO</h1>
          <p>{step === 1 ? 'Welcome back! Please login to your account.' : 'Two-Factor Authentication'}</p>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        {step === 1 ? (
          <>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="sso-divider">
                <span>or continue with</span>
              </div>

              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMsg('Google Login Failed')}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </form>

            <div className="auth-footer">
              <div style={{ marginBottom: '10px' }}>
                <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>Forgot Password / Login with OTP</Link>
              </div>
              <div>
                Don't have an account? <Link to="/signup">Create account</Link>
              </div>
            </div>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="input-group">
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
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" className="btn resend-btn" onClick={handleResendOtp} disabled={isLoading}>
              Resend OTP
            </button>
            <div className="auth-footer" style={{ marginTop: '10px' }}>
              <button type="button" className="back-link-btn" onClick={() => setStep(1)} disabled={isLoading}>
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
