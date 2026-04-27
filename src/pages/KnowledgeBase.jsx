import '../styles/Services.css';

const KnowledgeBase = () => {
  const articles = [
    { title: 'Getting Started with SERVIXO', category: 'General', views: '1.2k' },
    { title: 'Updating Your Professional Skills', category: 'Professional', views: '850' },
    { title: 'Service Fees & Commissions', category: 'Payment', views: '2.1k' },
    { title: 'Managing Client Bookings', category: 'Professional', views: '1.5k' },
    { title: 'Customer Support Best Practices', category: 'Support', views: '320' },
    { title: 'User Account Privacy Settings', category: 'Account', views: '940' }
  ];

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Knowledge Base</h2>
        <p>A library of platform documentation and help guides for everyone.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {articles.map((art, i) => (
          <div key={i} className="glass" style={{ padding: '30px', borderRadius: '24px', cursor: 'pointer', transition: 'var(--transition)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '6px', fontWeight: '800' }}>{art.category.toUpperCase()}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}> {art.views} views</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{art.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Learn everything you need to know about this topic and how to maximize your platform experience...
            </p>
            <div style={{ marginTop: '20px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '700' }}>Read Article </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginTop: '40px', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
        <h3>Need more help?</h3>
        <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Cant find what you are looking for? Contact our customer support team.</p>
        <button className="btn btn-primary" style={{ marginTop: '20px' }}>Contact Support</button>
      </div>
    </div>
  );
};



export default KnowledgeBase;
