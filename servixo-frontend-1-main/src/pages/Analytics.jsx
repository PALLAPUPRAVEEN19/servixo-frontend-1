import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Dashboard.css';

const Analytics = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const [barData, setBarData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [ticketStats, setTicketStats] = useState([]);
  const [metrics, setMetrics] = useState({
    avgResponse: '14m',
    resolutionRate: '0%',
    escalationRate: '0%',
    csat: '4.8/5'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        if (data.length === 0) {
          setLoading(false);
          return;
        }

        // Daily ticket volume (group by weekday)
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];
        // Categories
        const categoryCounts = {};
        // Statuses
        let resolvedCount = 0;
        let escalatedCount = 0;

        data.forEach(ticket => {
          // Process Daily
          const dateStr = ticket.created_at || ticket.createdAt;
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              // getDay() is 0 (Sun) to 6 (Sat)
              // We map Mon->0, Tue->1, ..., Sun->6
              const dayIndex = (date.getDay() + 6) % 7; 
              dayCounts[dayIndex]++;
            }
          }

          // Process Categories
          const cat = ticket.category || 'General';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

          // Process Statuses
          const status = ticket.status ? ticket.status.toUpperCase() : 'OPEN';
          if (status === 'RESOLVED' || status === 'CLOSED') {
             resolvedCount++;
          }
          if (status === 'ESCALATED') {
             escalatedCount++;
          }
        });

        // Normalize barData (percentage height for the chart)
        const maxDayCount = Math.max(...dayCounts, 1);
        const normalizedBarData = dayCounts.map(count => Math.round((count / maxDayCount) * 100));
        setBarData(normalizedBarData);

        // Process Category Percentages
        const colors = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--error)', '#f59e0b', '#8b5cf6'];
        const totalTickets = data.length;
        const computedCategories = Object.keys(categoryCounts).map((key, i) => ({
          label: key,
          val: Math.round((categoryCounts[key] / totalTickets) * 100),
          color: colors[i % colors.length]
        })).sort((a, b) => b.val - a.val); // Sort largest to smallest

        setTicketStats(computedCategories);

        // Process Metrics
        const resolutionPercent = Math.round((resolvedCount / totalTickets) * 100);
        const escalationPercent = Math.round((escalatedCount / totalTickets) * 100);

        setMetrics({
          avgResponse: '14m', // Placeholder as precision timestamps aren't fully available
          resolutionRate: `${resolutionPercent}%`,
          escalationRate: `${escalationPercent}%`,
          csat: '4.8/5'
        });

      })
      .catch(err => console.error("Failed to fetch analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="search-container" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-dim)' }}>
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Platform Analytics</h2>
        <p>Visualizing support volume and user engagement metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {/* Ticket Volume Chart */}
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3>Daily Ticket Volume</h3>
          <div className="chart-container" style={{ marginTop: '20px', height: '250px' }}>
            {barData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  className="chart-bar" 
                  style={{ height: `${val}%`, width: '100%', background: i === 4 ? 'var(--accent)' : 'var(--primary)', minHeight: '5px', borderRadius: '4px' }}
                ></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3>Ticket Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {ticketStats.length > 0 ? ticketStats.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: '700' }}>{item.val}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            )) : <div style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No category data available</div>}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="glass" style={{ padding: '30px', borderRadius: '24px', gridColumn: 'span 2' }}>
          <h3>Efficiency Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Avg. Response</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.avgResponse}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Resolution Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>{metrics.resolutionRate}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Escalation Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--error)' }}>{metrics.escalationRate}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '5px' }}>CSAT Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{metrics.csat}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
