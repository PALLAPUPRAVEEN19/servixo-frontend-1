import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine correct paths based on role directly from storage to avoid state desyncs
  const rawRole = localStorage.getItem('role') || '';
  const userRole = rawRole.toLowerCase();

  const getProfilePath = () => {
    if (userRole === 'professional') return '/professional/profile';
    if (userRole === 'admin') return '/admin/settings';
    if (userRole === 'support') return '/support/analytics';
    return '/user/profile';
  };

  const getSettingsPath = () => {
    if (userRole === 'admin') return '/admin/settings';
    if (userRole === 'professional') return '/professional/profile';
    if (userRole === 'support') return '/support/kb';
    return '/user/settings';
  };

  const getHelpPath = () => {
    if (userRole === 'support') return '/support/kb';
    if (userRole === 'admin') return '/admin/tickets';
    if (userRole === 'professional') return '/professional/messages';
    return '/user/tickets';
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <div className="profile-container" ref={dropdownRef}>
          <div
            className={`profile-icon ${isDropdownOpen ? 'active' : ''}`}
            onClick={toggleDropdown}
            title={user?.name || 'User Profile'}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-links">
                <Link
                  to={getProfilePath()}
                  className="dropdown-link"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="link-icon"></span> My Profile
                </Link>
                <Link
                  to={getSettingsPath()}
                  className="dropdown-link"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="link-icon"></span> Settings
                </Link>
                <Link
                  to={getHelpPath()}
                  className="dropdown-link"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="link-icon"></span> Help Center
                </Link>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-footer">
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
