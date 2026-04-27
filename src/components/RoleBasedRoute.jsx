import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const UnauthorizedHandler = ({ userRole }) => {
  const navigate = useNavigate();
  useEffect(() => {
    alert("Unauthorized Access");
    // Fallback based on user role to their root path (which defaults to their dashboard)
    if (userRole) {
      if (userRole === 'user') {
          navigate('/user/dashboard', { replace: true });
      } else {
          navigate(`/${userRole}`, { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, userRole]);
  return null;
};

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Fallback securely only via user object, removing polluting standalone 'role' keys
  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const activeUser = user || storedUser;
  
  if (!activeUser || !isLoggedIn) {
    if (!isLoggedIn) localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  const userRole = (activeUser?.role && typeof activeUser.role === 'string' 
    ? activeUser.role 
    : activeUser?.role?.name || '').toLowerCase();

  const normalizedAllowedRoles = allowedRoles?.map(r => r.toLowerCase());

  if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    return <UnauthorizedHandler userRole={userRole} />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
