import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../styles/Dashboard.css';

const UserDashboardContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let role = localStorage.getItem("role");

    if (!userId && localStorage.getItem("user")) {
      const stored = JSON.parse(localStorage.getItem("user"));
      userId = stored?.id;
      role = typeof stored?.role === 'string' ? stored.role : stored?.role?.name;
    }

    if (userId && role) {
      api.get(`/dashboard/stats?userId=${userId}&role=${role.toUpperCase()}`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  const statsList = [
    { title: 'Total Bookings', value: stats.totalBookings || 0, color: 'var(--primary)' },
    { title: 'Active Services', value: stats.activeServices || 0, color: 'var(--accent)' },
    { title: 'Completed Jobs', value: stats.completedJobs || 0, color: 'var(--success)' }
  ];

  const featuredServices = [
    { name: 'Plumbing', icon: '', color: '#3b82f6' },
    { name: 'Cleaning', icon: '', color: '#10b981' },
    { name: 'Electrician', icon: '', color: '#f59e0b' },
    { name: 'Painting', icon: '', color: '#8b5cf6' }
  ];

  return (
    <div className="main-content-flow">
      <div className="profile-section-header" style={{ marginBottom: '30px' }}>
        <h2>User Dashboard</h2>
        <p>Welcome back, {user?.name}! Here's what's happening with your services.</p>
      </div>

      <div className="stats-grid">
        {statsList.map((statItem, index) => (
          <div 
            key={index} 
            className="stat-card" 
            style={{ borderLeft: `4px solid ${statItem.color}`, background: 'var(--bg-card)' }}
          >
            <h3>{statItem.title}</h3>
            <div className="value">{statItem.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div className="profile-card">
          <h3><span className="icon"></span> Quick Book Service</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
            {featuredServices.map((service, i) => (
              <div 
                key={i} 
                className="quick-service-card"
                style={{ 
                  padding: '20px', 
                  borderRadius: '16px', 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onClick={() => navigate('/user/services', { state: { category: service.name } })}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{service.icon}</div>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{service.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '5px' }}>Book Now </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.1) 100%)' }}>
          <h3><span className="icon"></span> Exclusive Offers</h3>
          <div style={{ marginTop: '20px', padding: '25px', borderRadius: '20px', background: 'var(--primary)', boxShadow: '0 10px 30px var(--primary-glow)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '5px', fontSize: '1.4rem' }}>20% OFF</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>On your next house cleaning service with code <strong>CLEAN20</strong>.</p>
            <button className="btn" style={{ background: 'white', color: 'var(--primary)', marginTop: '15px', width: '100%' }}>Claim Offer</button>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Recent Bookings</h3>
          <Link to="/user/bookings" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>View All History</Link>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>No recent bookings.</div>
      </div>
    </div>
  );
};

export const UserDashboard = () => (
  <UserDashboardContent />
);

const AdminDashboardContent = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let role = localStorage.getItem("role") || 'ADMIN';

    if (!userId && localStorage.getItem("user")) {
      const stored = JSON.parse(localStorage.getItem("user"));
      userId = stored?.id;
    }

    if (userId) {
      api.get(`/dashboard/stats?userId=${userId}&role=${role.toUpperCase()}`)
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ 
          width: '50px', height: '50px', 
          border: '4px solid rgba(255,255,255,0.1)', 
          borderTop: '4px solid var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Admin Overview</h2>
      
      {/* We use a specialized responsive grid just for these two heavy cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '30px', 
        marginBottom: '40px' 
      }}>
        
        {/* Card 1: Total Users */}
        <div className="stat-card glass" style={{ 
          borderBottom: '4px solid var(--primary)', 
          padding: '40px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '3rem' }}></div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Total Users</h3>
            <div className="value" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>
              {stats.totalUsers || 0}
            </div>
          </div>
        </div>

        {/* Card 2: Total Professionals */}
        <div className="stat-card glass" style={{ 
          borderBottom: '4px solid var(--accent)', 
          padding: '40px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '3rem' }}></div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Total Professionals</h3>
            <div className="value" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>
              {stats.totalProfessionals || 0}
            </div>
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="stat-card glass" style={{ 
          borderBottom: '4px solid var(--primary)', 
          padding: '40px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Total Bookings</h3>
            <div className="value" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>
              {stats.totalBookings || 0}
            </div>
          </div>
        </div>

        {/* Card 4: Active Services */}
        <div className="stat-card glass" style={{ 
          borderBottom: '4px solid var(--accent)', 
          padding: '40px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Active Services</h3>
            <div className="value" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>
              {stats.activeServices || 0}
            </div>
          </div>
        </div>

        {/* Card 5: Completed Jobs */}
        <div className="stat-card glass" style={{ 
          borderBottom: '4px solid var(--success)', 
          padding: '40px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Completed Jobs</h3>
            <div className="value" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>
              {stats.completedJobs || 0}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const AdminDashboard = () => (
  <AdminDashboardContent />
);

const ProDashboardContent = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let role = localStorage.getItem("role");

    if (!userId && localStorage.getItem("user")) {
      const stored = JSON.parse(localStorage.getItem("user"));
      userId = stored?.id;
      role = typeof stored?.role === 'string' ? stored.role : stored?.role?.name;
    }

    if (userId) {
      Promise.all([
        api.get(`/professional/services/${userId}`),
        api.get(`/professional/bookings/${userId}`)
      ])
      .then(([servicesRes, bookingsRes]) => {
        const services = servicesRes.data || servicesRes || [];
        const bookings = bookingsRes.data || bookingsRes || [];
        
        const completed = bookings.filter(b => b.status === "COMPLETED").length;
        const activeBookingsCount = bookings.filter(b => b.status === "ACCEPTED").length;
        const totalEarnings = bookings
          .filter(b => b.status === "COMPLETED")
          .reduce((sum, b) => sum + (b.price || b.service?.price || 0), 0);

        setStats({
          totalBookings: bookings.length,
          activeServices: services.length,
          activeBookings: activeBookingsCount,
          completedBookings: completed,
          completedJobs: completed,
          totalEarnings: totalEarnings
        });
      })
      .catch(err => console.error("Failed to fetch dashboard data:", err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const statsList = [
    { title: 'Total Bookings', value: stats.totalBookings || 0, color: 'var(--primary)' },
    { title: 'Active Bookings', value: stats.activeBookings || stats.activeServices || 0, color: 'var(--accent)' },
    { title: 'Completed Jobs', value: stats.completedBookings || stats.completedJobs || 0, color: 'var(--success)' },
    { title: 'Total Earnings', value: `$${stats.totalEarnings || 0}`, color: 'var(--success)' }
  ];

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--text-dim)', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="main-content-flow">
      <div className="profile-section-header" style={{ marginBottom: '30px' }}>
        <h2>Professional Dashboard</h2>
        <p>Welcome back, {user?.name}! Manage your daily appointments and track your service growth.</p>
      </div>

      <div className="stats-grid">
        {statsList.map((statItem, index) => (
          <div 
            key={index} 
            className="stat-card" 
            style={{ borderLeft: `4px solid ${statItem.color}`, background: 'var(--bg-card)' }}
          >
            <h3>{statItem.title}</h3>
            <div className="value">{statItem.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3>Upcoming Jobs & Appointments</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>0 Active Requests</span>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
            No upcoming bookings yet.
          </div>
        </div>

        <div className="profile-card">
          <h3>Growth Insights</h3>
          <div style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <p style={{ color: 'hsl(155, 100%, 75%)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Your rating has increased by <strong>0.2</strong> this month. Providing great service pays off!
            </p>
          </div>
          <div style={{ marginTop: '25px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '15px' }}>Weekly Performance</h4>
            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
               {[40, 70, 30, 90, 60, 80, 50].map((h, i) => (
                 <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.3 + (h/100) }}></div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProDashboard = () => (
  <ProDashboardContent />
);

const SupportDashboardContent = () => {
  const [counts, setCounts] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets')
      .then(res => {
        // Handle both possible structures safely (array vs wrapped object)
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        let openCount = 0;
        let inProgressCount = 0;
        let resolvedCount = 0;

        data.forEach(ticket => {
          const status = ticket.status ? ticket.status.toUpperCase() : 'OPEN';
          if (status === 'OPEN') openCount++;
          else if (status === 'IN_PROGRESS' || status === 'IN-PROGRESS') inProgressCount++;
          else if (status === 'RESOLVED') resolvedCount++;
        });

        setCounts({
          total: data.length,
          open: openCount,
          inProgress: inProgressCount,
          resolved: resolvedCount
        });
      })
      .catch(err => console.error("Failed to fetch support tickets:", err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: 'Total Tickets', value: counts.total, color: 'var(--primary)' },
    { title: 'Open', value: counts.open, color: 'var(--error)' },
    { title: 'In Progress', value: counts.inProgress, color: 'var(--accent)' },
    { title: 'Resolved', value: counts.resolved, color: 'var(--success)' }
  ];

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--text-dim)', textAlign: 'center' }}>Loading dashboard data...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Support Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card glass" 
            style={{ borderBottom: `4px solid ${stat.color}` }}
          >
            <h3>{stat.title}</h3>
            <div className="value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3>Recent Activity</h3>
          <div style={{ marginTop: '20px', textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>
            No recent activity.
          </div>
        </div>

        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3>Performance Insights</h3>
          <p style={{ color: 'var(--text-dim)', marginTop: '10px', fontSize: '0.9rem' }}>
            Average response time is currently <strong>14 minutes</strong>, which is 15% better than last week's average. Keep it up!
          </p>
          <div style={{ marginTop: '20px', height: '100px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
            {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary-glow)', borderRadius: '4px 4px 0 0' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupportDashboard = () => (
  <SupportDashboardContent />
);

export const Unauthorized = () => (
  <div style={{ padding: '40px', color: 'var(--text-main)', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <h1 style={{ color: 'var(--error)', fontSize: '3rem' }}>403</h1>
    <h2>Unauthorized</h2>
    <p style={{ margin: '20px 0' }}>You do not have permission to access this page.</p>
    <button className="btn btn-primary" onClick={() => window.history.back()} style={{ width: 'fit-content', margin: '0 auto' }}>Go Back</button>
  </div>
);
