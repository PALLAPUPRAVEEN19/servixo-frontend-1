import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Services.css';

const Revenue = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all transactions from the payment endpoint
        const txnsResponse = await api.get('/payments');
        setTransactions(txnsResponse.data || []);

        // Fetch overall revenue stats (Bonus addition since it's the Revenue page)
        const revResponse = await api.get('/admin/revenue');
        setTotalRevenue(revResponse.data || 0);

      } catch (err) {
        console.error('Failed to fetch transactions or revenue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className="search-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2>Revenue & Transactions</h2>
          <p>A centralized transaction and revenue tracking table for financial oversight.</p>
        </div>
        
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px 30px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', minWidth: '200px' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Total Revenue</p>
          <p style={{ margin: 0, marginTop: '5px', fontSize: '2.2rem', fontWeight: '900', color: 'var(--success)' }}>
            ${totalRevenue?.toFixed ? totalRevenue.toFixed(2) : totalRevenue}
          </p>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflowX: 'auto', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead style={{ background: 'var(--bg-card)', color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '20px' }}>TXN ID</th>
              <th style={{ padding: '20px' }}>User</th>
              <th style={{ padding: '20px' }}>Professional</th>
              <th style={{ padding: '20px' }}>Amount</th>
              <th style={{ padding: '20px' }}>Date</th>
              <th style={{ padding: '20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((txn) => {
              // Safely extract deeply nested data as per standard backend objects
              const txnId = txn.id || 'N/A';
              const userName = txn.user?.name || 'Unknown User';
              const proName = txn.professional?.name || txn.pro?.name || 'Unknown Professional';
              
              const amountRaw = txn.amount !== undefined ? txn.amount : (txn.price || 0);
              const formattedAmount = typeof amountRaw === 'number' ? `$${amountRaw.toFixed(2)}` : `$${amountRaw}`;
              
              // Handle standardized Date format display
              let dateStr = txn.date || txn.createdAt || 'N/A';
              if (dateStr !== 'N/A' && dateStr.includes('T')) {
                // Extracts just the YYYY-MM-DD from a standard ISO timestamp
                dateStr = dateStr.split('T')[0];
              }

              const statusStr = (txn.status || 'pending').toLowerCase();
              
              return (
                <tr key={txn.id || Math.random()} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-card)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '20px', color: 'var(--primary)', fontWeight: '800' }}>#{txnId}</td>
                  <td style={{ padding: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{userName}</td>
                  <td style={{ padding: '20px', color: 'var(--text-dim)', fontWeight: '500' }}>{proName}</td>
                  <td style={{ padding: '20px', fontWeight: '900', color: 'var(--text-main)', fontSize: '1.1rem' }}>{formattedAmount}</td>
                  <td style={{ padding: '20px', fontSize: '0.9rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{dateStr}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: '800',
                      letterSpacing: '0.5px',
                      background: statusStr === 'completed' ? 'rgba(16, 185, 129, 0.15)' : statusStr === 'failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: statusStr === 'completed' ? 'var(--success)' : statusStr === 'failed' ? 'var(--error)' : '#f59e0b',
                      border: `1px solid ${statusStr === 'completed' ? 'rgba(16, 185, 129, 0.3)' : statusStr === 'failed' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}>
                      {statusStr.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.5 }}></div>
                  No transaction records found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default Revenue;
