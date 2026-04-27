import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles, children }) => {
  const token = sessionStorage.getItem('token');
  const userRole = (localStorage.getItem('role') || '').toUpperCase().replace(/^ROLE_/, '');

  // If no token exists, immediately enforce authentication boundary redirecting to login portal
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a strict roles array is provided, securely verify inclusion
  if (roles && Array.isArray(roles)) {
    const isAllowed = roles.map(r => r.toUpperCase().replace(/^ROLE_/, '')).includes(userRole);
    if (!isAllowed) {
      // If no access, throw to login / unauthorized
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Pass execution boundary wrapping children properly or returning sub-outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
