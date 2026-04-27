import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UserServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

  const fetchServices = async (searchKeyword = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = searchKeyword.trim() 
        ? `/services/search?keyword=${encodeURIComponent(searchKeyword)}` 
        : '/services';

      const response = await api.get(endpoint);
      
      // Log response for debugging per requirements
      console.log('Services API Response:', response.data);

      // Extract array safely
      const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      
      const mappedServices = rawData
        // Filter only APPROVED services
        .filter(s => {
          const status = (s.status || '').toUpperCase();
          return status === 'APPROVED';
        })
        // Safely map backend fields
        .map(s => ({
          id: s.id || Math.random().toString(36).substr(2, 9), // Fallback ID mapping
          title: s.title || s.name || s.serviceName || 'Untitled Service',
          description: s.description || 'No description provided.',
          price: s.price || 0,
          status: s.status?.toUpperCase() || 'APPROVED'
        }));

      // Ensure absolutely no duplicates by ID
      const uniqueServices = Array.from(new Map(mappedServices.map(s => [s.id, s])).values());
      
      setServices(uniqueServices);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to fetch services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices(keyword);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleHire = (service) => {
    navigate(`/user/booking/${service.id}`, { state: { service } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2>Available Services</h2>
          <p style={{ color: 'var(--text-dim)' }}>Find the best professional services for your needs.</p>
        </div>
        <div style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search services..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          />
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-dim)' }}>Loading services...</div>
      ) : error ? (
        <div style={{ color: 'var(--error)', textAlign: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {services.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
              <h3 style={{ marginBottom: '10px' }}>No services found</h3>
              <p style={{ color: 'var(--text-dim)' }}>Try adjusting your search criteria.</p>
            </div>
          ) : services.map(service => (
            <div key={service.id} className="glass" style={{ padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'default', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>{service.title}</h3>
                <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {service.status}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', flexGrow: 1, marginBottom: '25px', lineHeight: '1.5' }}>
                {service.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>
                  ${service.price}
                </span>
                <button 
                  onClick={() => handleHire(service)} 
                  style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', background: 'var(--primary)', color: 'white' }}
                >
                  Hire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserServices;
