import { useState, useEffect } from 'react';
import api from '../api';
import Toast from '../components/Toast';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);



  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Ensure correct base URL is used from api configuration
        const response = await api.get('/services/all');
        setServices(response.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to fetch services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/services/approve/${id}`, null);
      // Update local state instantly to show APPROVED without refresh
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
      );
      setToast({ message: 'Service Approved', type: 'success' });
    } catch (err) {
      console.error('Failed to approve service:', err);
      setToast({ message: 'Failed to approve service', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      // Using DELETE from ServiceController for rejecting/deleting an unwanted service
      await api.delete(`/services/${id}`);
      // Update local state instantly without refresh
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s))
      );
      setToast({ message: 'Service Rejected', type: 'success' });
    } catch (err) {
      console.error('Failed to reject service:', err);
      setToast({ message: 'Failed to reject service', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto text-left flex flex-col h-full bg-transparent text-gray-200">
      
      {/* VERY IMPORTANT MESSAGE JUST IN CASE SERVER ISN'T RESTARTED */}
      {/* Normally you don't keep this in prod, but if layout is plain text, user needs to know */}
      <div className="md:hidden lg:hidden xl:hidden bg-red-900 border border-red-500 text-white p-4 rounded mb-6 italic" style={{ display: !window.tailwind ? 'none' : 'block' }}></div>
      <style>{`
        /* 
           Crucial Fallback styles to ensure it looks like a table 
           even if Vite hasn't been restarted and Tailwind isn't loaded! 
        */
        .fallback-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .fallback-th { text-align: left; padding: 16px; background: var(--bg-card); color: #9ca3af; text-transform: uppercase; font-size: 0.85rem; border-bottom: 1px solid var(--border); }
        .fallback-td { padding: 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .fallback-row:hover { background: var(--bg-card); }
        .fallback-container { overflow-x: auto; overflow-y: auto; max-height: 65vh; border: 1px solid var(--border); border-radius: 12px; background: rgba(0,0,0,0.2); }
      `}</style>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2" style={{ color: 'var(--text-h)' }}>Services Management</h1>
        <p className="text-sm font-medium text-gray-400" style={{ color: 'var(--text-dim)' }}>
          Review and approve professional service offerings to maintain platform quality.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border-l-4 border-red-500 rounded-md shadow-sm">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      )}

      {/* Table Card with both explicit styles and Tailwind styles for safety */}
      <div className="fallback-container rounded-xl shadow-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-md flex-1">
        
        <table className="fallback-table w-full whitespace-normal text-left border-collapse table-auto relative text-sm">
          <thead className="sticky top-0 bg-gray-900/90 backdrop-blur-lg z-10 shadow-sm border-b border-gray-800">
            <tr>
              <th className="fallback-th px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">ID</th>
              <th className="fallback-th px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Title</th>
              <th className="fallback-th px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs w-1/3">Description</th>
              <th className="fallback-th px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Price</th>
              <th className="fallback-th px-6 py-4 font-bold text-center text-gray-400 uppercase tracking-widest text-xs">Status</th>
              <th className="fallback-th px-6 py-4 font-bold text-right text-gray-400 uppercase tracking-widest text-xs w-32">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/60">
            {services.length > 0 ? (
              services.map((service) => {
                const statusStr = (service.status || '').toUpperCase();
                return (
                  <tr key={service.id} className="fallback-row hover:bg-gray-800/40 transition-colors duration-150">
                    <td className="fallback-td px-6 py-4 font-medium text-gray-400">
                      #{service.id}
                    </td>
                    
                    <td className="fallback-td px-6 py-4 font-bold text-gray-100">
                      {service.name || service.title || 'Untitled Service'}
                    </td>
                    
                    <td className="fallback-td px-6 py-4 text-gray-400 leading-relaxed max-w-sm truncate whitespace-normal break-words">
                      <div className="line-clamp-2">
                        {service.description || 'No description provided'}
                      </div>
                    </td>
                    
                    <td className="fallback-td px-6 py-4 font-bold text-emerald-400 text-base">
                      ${service.price?.toFixed(2) || '0.00'}
                    </td>
                    
                    <td className="fallback-td px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-sm ${
                          statusStr === 'APPROVED'
                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-900/40 text-amber-400 border border-amber-500/30'
                        }`}
                        style={{ border: statusStr === 'APPROVED' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)' }}
                      >
                        {statusStr || 'PENDING'}
                      </span>
                    </td>
                    
                    <td className="fallback-td px-6 py-4 text-right align-middle h-full">
                      {statusStr === 'PENDING' ? (
                        <div className="flex justify-end gap-2 w-full">
                          <button
                            onClick={() => handleApprove(service.id)}
                            style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}
                            className="inline-flex items-center justify-center px-4 py-2 border text-sm font-bold rounded-lg text-white hover:opacity-90 transition-all active:scale-95 shadow-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(service.id)}
                            style={{ background: '#fee2e2', color: 'var(--error)' }}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg hover:bg-red-900/40 transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : statusStr === 'REJECTED' ? (
                        <div className="flex justify-end w-full">
                          <span className="inline-flex items-center px-3 py-1 text-sm font-bold text-red-400">
                            Rejected
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-end w-full">
                          <span className="inline-flex items-center px-3 py-1 text-sm font-bold text-emerald-400">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Approved
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 mb-4 text-gray-700 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-xl font-bold text-gray-300 mb-2">No Services Found</p>
                    <p className="text-sm text-gray-500 font-medium">There are currently no services pending review or in the system.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};



export default ManageServices;
