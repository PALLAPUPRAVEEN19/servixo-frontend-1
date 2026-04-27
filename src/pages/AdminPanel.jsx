import { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';
import Toast from '../components/Toast';

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await serviceAPI.getAll();
        setServices(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleApprove = async (id) => {
    try {
      await serviceAPI.approve(id);
      setToast({ message: 'Service successfully approved.', type: 'success' });
      setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to approve service.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      await serviceAPI.reject(id);
      setToast({ message: 'Service successfully rejected.', type: 'success' });
      setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to reject service.', type: 'error' });
    }
  };

  const getBadgeClass = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'PENDING') return 'status-pending';
    if (s === 'APPROVED') return 'status-approved';
    if (s === 'REJECTED') return 'status-rejected';
    return 'status-default';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)' }}>
      <style>{`
        .admin-table { width: 100%; border-collapse: collapse; background: white; }
        .admin-table th { text-align: left; padding: 12px; color: #64748b; font-weight: 600; }
        .admin-table td { padding: 14px 12px; color: #1e293b; font-size: 15px; vertical-align: middle; }
        .admin-table tr { border-bottom: 1px solid #e2e8f0; }
        .title-text { color: #0f172a !important; font-weight: 600; font-size: 16px; }
        .actions { display: flex; gap: 10px; align-items: center; justify-content: flex-end; }
        .status-approved { background: #22c55e; color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
        .status-pending { background: #facc15; color: black; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
        .status-rejected { background: #ef4444; color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
        .status-default { background: #64748b; color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
      `}</style>
      <h2 style={{ color: '#0f172a' }}>Admin Panel - Service Approvals</h2>
      <p style={{ color: '#1e293b' }}>Review and verify all services added by professionals.</p>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        {loading ? <p style={{ color: '#1e293b' }}>Loading services...</p> : error ? <p style={{ color: '#ef4444' }}>{error}</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td className="title-text">{service.title || service.name}</td>
                  <td>{service.description}</td>
                  <td style={{ fontWeight: '600' }}>${service.price}</td>
                  <td>
                    <span className={getBadgeClass(service.status)}>
                      {service.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button 
                        onClick={() => handleApprove(service.id)}
                        disabled={service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED'}
                        style={{ 
                          padding: '8px 16px', 
                          background: (service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? '#94a3b8' : '#3b82f6', 
                          color: '#ffffff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: (service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? 'not-allowed' : 'pointer', 
                          fontWeight: '600' 
                        }}
                      >
                        {service.status?.toUpperCase() === 'APPROVED' ? 'Approved' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => handleReject(service.id)}
                        disabled={service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED'}
                        style={{ 
                          padding: '8px 16px', 
                          background: (service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? 'transparent' : 'rgba(239, 68, 68, 0.1)', 
                          color: (service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? '#94a3b8' : '#ef4444', 
                          border: '1px solid ' + ((service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? '#cbd5e1' : '#ef4444'), 
                          borderRadius: '6px', 
                          cursor: (service.status?.toUpperCase() === 'APPROVED' || service.status?.toUpperCase() === 'REJECTED') ? 'not-allowed' : 'pointer', 
                          fontWeight: '600' 
                        }}
                      >
                        {service.status?.toUpperCase() === 'REJECTED' ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No services available in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
