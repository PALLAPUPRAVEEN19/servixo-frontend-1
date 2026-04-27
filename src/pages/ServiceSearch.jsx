import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { serviceAPI } from '../services/api';

const categories = ['All', 'Plumbing', 'Cleaning', 'Electrician', 'Painting', 'Outdoor', 'Education', 'Logistics'];

const ServiceSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const endpoint = searchTerm.trim() 
          ? `/services/search?keyword=${encodeURIComponent(searchTerm)}`
          : '/services';
        const response = await api.get(endpoint);
        const fetchedServices = response.data || [];
        
        // Defensively filter if search returns PENDING services
        const approvedOnly = searchTerm.trim() 
            ? fetchedServices.filter(s => s.status?.toUpperCase() === 'APPROVED') 
            : fetchedServices;
            
        setServices(approvedOnly);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Add simple debounce for searching
    const timerId = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const filteredServices = services.filter(service => {
    const cat = service.category || '';
    const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
    return matchesCategory;
  });

  const handleHire = (serviceId) => {
    console.log("Hire clicked", serviceId);
    navigate(`/booking/${serviceId}`);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Find Professional Services</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for skills or names..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {categories.map(cat => (
            <div 
              key={cat} 
              className={`filter-tag ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>Loading services...</div>
      ) : (
        <div className="professionals-grid">
          {filteredServices.map(service => (
            <div key={service.id} className="pro-card glass">
              <div className="pro-info">
                <div className="pro-name">{service.title || service.name}</div>
                <div className="pro-skills">
                  <span className="skill-tag">{service.category || 'General'}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  {service.description}
                </div>
              </div>
              <div className="pro-meta">
                <span>Verified </span>
                <span style={{ color: 'var(--success)' }}>{(service.status || 'APPROVED').toUpperCase()}</span>
              </div>
              <div className="pro-price">{service.price}</div>
              <button className="btn btn-primary hire-btn" onClick={() => handleHire(service.id)}>Hire Now</button>
            </div>
          ))}
          {filteredServices.length === 0 && (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px' }}>
              No services found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};



export default ServiceSearch;
