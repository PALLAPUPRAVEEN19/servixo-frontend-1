import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, googleAuthLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await googleAuthLogin(credentialResponse.credential);
      
      // Re-use logic from handleSignup for redirection
      const role = typeof user.role === "string" ? user.role : user.role?.name;
      const normalizedRole = role?.toUpperCase();

      if (normalizedRole === "ADMIN") navigate("/admin/dashboard");
      else if (normalizedRole === "PROFESSIONAL") navigate("/professional/dashboard");
      else if (normalizedRole === "SUPPORT") navigate("/support/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const user = await signup(formData.name, formData.email, formData.password, formData.role);

      // Normalize role value
      const role = typeof user.role === "string"
        ? user.role
        : user.role?.name;

      const normalizedRole = role?.toUpperCase();

      console.log("LOGIN RESPONSE:", user);
      console.log("ROLE:", normalizedRole);

      if (normalizedRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (normalizedRole === "PROFESSIONAL") {
        navigate("/professional/dashboard");
      } else if (normalizedRole === "SUPPORT") {
        navigate("/support/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ['user', 'professional', 'admin', 'support'];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="logo-text">SERVIXO</h1>
          <p>Join the community and start matching today.</p>
        </div>

        {error && <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '15px', fontWeight: '600' }}>{error}</div>}

        {/* Google SSO */}
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            theme="outline"
            shape="rectangular"
            width="100%"
          />
        </div>

        <div className="sso-divider">
          <span>or create an account with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>I want to join as a...</label>
            <div className="role-switcher">
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${formData.role === r ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  {r === 'support' ? 'Support Portal' : r === 'admin' ? 'Admin Portal' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
