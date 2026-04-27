import { useEffect } from 'react';
import '../styles/global.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '';
      case 'error': return '';
      case 'info': return '';
      default: return '';
    }
  };

  return (
    <div 
      className="glass" 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        padding: '12px 24px', 
        borderRadius: '12px', 
        zIndex: 1000, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        animation: 'slideIn 0.3s ease-out',
        borderLeft: `4px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'}`
      }}
    >
      <span>{getIcon()}</span>
      <span style={{ fontWeight: '600' }}>{message}</span>
    </div>
  );
};

export default Toast;
