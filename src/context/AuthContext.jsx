import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [loading, setLoading] = useState(false);

  const completeMfaLogin = (userResp) => {
    setUser(userResp);

    const token = userResp.token || userResp.jwt || userResp.accessToken;
    if (token) sessionStorage.setItem('token', token); // Store strictly in sessionStorage
    
    const userId = userResp.userId || userResp.id;
    if (userId) localStorage.setItem('userId', userId); // Store strictly in localStorage
    
    const role = typeof userResp.role === 'string' ? userResp.role : userResp.role?.name;
    const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, '');
    if (normalizedRole) localStorage.setItem('role', normalizedRole); // Store properly stripped role
    
    // Store user JSON for legacy code safely, but without token
    localStorage.setItem('user', JSON.stringify({ ...userResp, role: normalizedRole, userId }));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const login = async (email, password) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const userResp = await authAPI.login(cleanEmail, password);
    if (userResp && userResp.status === 'OTP_REQUIRED') {
      return userResp;
    }
    completeMfaLogin(userResp);
    return userResp;
  };

  const otpLogin = async (email, otp) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanOtp = otp ? otp.trim() : '';
    const userResp = await authAPI.verifyOtpLogin(cleanEmail, cleanOtp);
    completeMfaLogin(userResp);
    return userResp;
  };

  const completeMfaVerification = async (email, otp) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanOtp = otp ? otp.trim() : '';
    const userResp = await authAPI.verifyLoginOtp(cleanEmail, cleanOtp);
    completeMfaLogin(userResp);
    return userResp;
  };

  const signup = async (name, email, password, roleName) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const userData = {
      name: name ? name.trim() : '',
      email: cleanEmail,
      password,
      roleName: roleName.toUpperCase(),
    };

    const userResp = await authAPI.register(userData);
    completeMfaLogin(userResp);
    return userResp;
  };

  const googleAuthLogin = async (googleToken) => {
    const userResp = await authAPI.googleLogin(googleToken);
    completeMfaLogin(userResp);
    return userResp;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    localStorage.clear();
    
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, otpLogin, completeMfaVerification, completeMfaLogin, signup, googleAuthLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
