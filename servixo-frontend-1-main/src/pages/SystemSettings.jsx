import { useState } from 'react';
import '../styles/Login.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    commission: 15,
    enableAllServices: true,
    enableNewRegistrations: true,
    enablePayments: true,
    maintenanceMode: false,
    supportEmail: 'admin@servixo.com'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Global System Settings</h2>
        <p>Configure platform-wide parameters and service toggles.</p>
      </div>

      <div className="glass" style={{ padding: '40px', maxWidth: '800px', borderRadius: '24px' }}>
        <form className="auth-form" onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* General Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3>General</h3>
              <div className="input-group">
                <label>Platform Commission (%)</label>
                <input 
                  type="number" 
                  name="commission" 
                  value={settings.commission} 
                  onChange={handleChange} 
                  min="0" 
                  max="100" 
                />
              </div>
              <div className="input-group">
                <label>Support Email</label>
                <input 
                  type="email" 
                  name="supportEmail" 
                  value={settings.supportEmail} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Platform Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3>Controls</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="enableAllServices" 
                  checked={settings.enableAllServices} 
                  onChange={handleChange} 
                  style={{ width: '20px', height: '20px' }}
                />
                <label>Enable/Disable All Services</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="enableNewRegistrations" 
                  checked={settings.enableNewRegistrations} 
                  onChange={handleChange} 
                  style={{ width: '20px', height: '20px' }}
                />
                <label>Enable New User Registrations</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="enablePayments" 
                  checked={settings.enablePayments} 
                  onChange={handleChange} 
                  style={{ width: '20px', height: '20px' }}
                />
                <label>Enable Platform Payments</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="maintenanceMode" 
                  checked={settings.maintenanceMode} 
                  onChange={handleChange} 
                  style={{ width: '20px', height: '20px' }}
                />
                <label style={{ color: 'var(--error)' }}>Maintenance Mode</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: '30px' }}>Save Global Settings</button>
        </form>
      </div>
    </div>
  );
};



export default SystemSettings;
