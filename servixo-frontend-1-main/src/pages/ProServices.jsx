import { useState, useEffect } from 'react';
import api from '../api';
import { proAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Services.css';
import '../styles/Profile.css';

const ProServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        const userId = storedUser?.userId || storedUser?.id || user?.id;
        if (!userId) return;
        
        const response = await proAPI.getServices(userId);
        setServices(response || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [user]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', price: '' });

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ 
        title: service.title, 
        description: service.description,
        category: service.category, 
        price: service.price.toString().replace('$', '') 
      });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', category: '', price: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingService) {
        const response = await api.put(`/services/${editingService.id}`, formData);
        setServices(services.map(s => s.id === editingService.id ? response.data : s));
      } else {
        const payload = { ...formData };
        // Feature 1: POST /api/services/{professionalId}
        const response = await api.post(`/services/${user?.id}`, payload);
        const newService = response.data || payload;
        
        // Ensure "Pending Approval" is rendered by forcefully applying PENDING status
        setServices([...services, { ...newService, status: 'PENDING', id: newService.id || Date.now() }]);
        
        // Show success message and clear form by simply closing modal or clearing data
        setFormData({ title: '', description: '', category: '', price: '' });
      }
    } catch (err) {
      console.error('Failed to save service:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setError(null);
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
      setError('Failed to delete service.');
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>My Service Listings</h2>
          <p>Manage your offerings and set your service prices.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add New Service</button>
      </div>

      {error && <div style={{ color: 'var(--error)', background: '#fee2e2', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>Loading services...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {services.length > 0 ? services.map((service) => (
            <div key={service.id} className="profile-card glass" style={{ display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{service.title || service.name}</h3>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.7rem', 
                  fontWeight: '800',
                  background: service.status === 'approved' ? 'var(--success)' : 'var(--border)',
                  color: 'var(--text)'
                }}>
                  {(service.status || 'pending').toUpperCase()}
                </span>
              </div>
              
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>
                {service.description || 'No description listed'}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'block', marginBottom: '4px' }}>Category</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{service.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '4px' }}>Price</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.1rem' }}>${service.price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" style={{ flex: 1, padding: '8px 0', fontSize: '0.9rem', background: 'var(--border)', color: 'var(--text-main)' }} onClick={() => handleOpenModal(service)}>Edit</button>
                <button className="btn" style={{ flex: 1, padding: '8px 0', fontSize: '0.9rem', background: '#fee2e2', color: 'var(--error)' }} onClick={() => deleteService(service.id)}>Delete</button>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-dim)', background: 'var(--code-bg)', borderRadius: '16px' }}>
              No services listed yet. Click "+ Add New Service" to get started.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="profile-card" style={{ width: '100%', maxWidth: '500px', margin: '20px' }}>
            <h3 style={{ marginBottom: '25px' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Service Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Standard House Cleaning"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Describe what is included in this service"
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', minHeight: '80px' }}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  placeholder="e.g. Cleaning"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price ($ per hour)</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  placeholder="e.g. 25"
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingService ? 'Save Changes' : 'Create Service'}</button>
                <button type="button" className="btn" style={{ flex: 1, background: 'var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default ProServices;
