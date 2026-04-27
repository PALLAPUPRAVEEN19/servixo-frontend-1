import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceAPI, proAPI } from '../services/api';
import Toast from '../components/Toast';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const storedUserId = localStorage.getItem("userId");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const professionalId = storedUserId || storedUser?.id || user?.id;

  const fetchServices = async () => {
    if (!professionalId) return;
    try {
      setLoading(true);
      const data = await proAPI.getServices(professionalId);
      setServices(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!professionalId) return;
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price)
      };

      await serviceAPI.createForPro(professionalId, payload);
      
      setToast({ message: 'Service created successfully!', type: 'success' });
      setFormData({ name: '', title: '', description: '', price: '' });
      fetchServices();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to create service.', type: 'error' });
    }
  };

  const getBadgeStyle = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'PENDING') return { backgroundColor: '#eab308', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    if (s === 'APPROVED') return { backgroundColor: '#22c55e', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
    return { backgroundColor: '#6b7280', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
      <h2>Professional Dashboard</h2>
      <p>Create and manage your professional services.</p>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <h3>Create New Service</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Service Title</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', minHeight: '80px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Price ($)</label>
            <input 
              type="number" 
              required
              min="0"
              step="0.01"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', background: 'var(--accent)', color: 'var(--text-main)', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Submit Service
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <h3>My Services</h3>
        {loading ? <p>Loading services...</p> : error ? <p style={{ color: '#ef4444' }}>{error}</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {services.length === 0 ? <p>No services found.</p> : services.map(service => (
              <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{service?.title || service?.name || 'Unknown Service'}</h4>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text)' }}>{service?.description || 'No description'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', color: 'var(--accent)' }}>${service?.price || '0.00'}</div>
                  <span style={getBadgeStyle(service?.status)}>{service?.status?.toUpperCase() || 'PENDING'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
