import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/user/dashboard' },
    { name: 'Services', path: '/user/services' },
    { name: 'Bookings', path: '/user/bookings' },
    { name: 'Feedback', path: '/user/feedback' },
    { name: 'Raise Ticket', path: '/user/tickets' },
    { name: 'Settings', path: '/user/settings' }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Services', path: '/admin/manage-services' },
    { name: 'Revenue', path: '/admin/revenue' },
    { name: 'Tickets', path: '/admin/tickets' },
    { name: 'Settings', path: '/admin/settings' }
  ];

  const proLinks = [
    { name: 'Dashboard', path: '/professional' },
    { name: 'Services', path: '/professional/services' },
    { name: 'Bookings', path: '/professional/bookings' },
    { name: 'Messages', path: '/professional/messages' },
    { name: 'Earnings', path: '/professional/earnings' }
  ];

  const supportLinks = [
    { name: 'Dashboard', path: '/support' },
    { name: 'Tickets', path: '/support/tickets' },
    { name: 'Chat', path: '/support/chat' },
    { name: 'Analytics', path: '/support/analytics' },
    { name: 'Knowledge Base', path: '/support/kb' }
  ];

  const getLinks = () => {
    // Read directly from localStorage to guarantee absolute RBAC consistency without state desyncs
    const rawRole = localStorage.getItem('role') || '';
    const userRole = rawRole.toLowerCase();

    if (userRole === 'admin') return adminLinks;
    if (userRole === 'professional') return proLinks;
    if (userRole === 'support') return supportLinks;
    return userLinks;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">SERVIXO</div>
      <nav className="sidebar-nav">
        {getLinks().map(link => (
          <div
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {link.name}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
