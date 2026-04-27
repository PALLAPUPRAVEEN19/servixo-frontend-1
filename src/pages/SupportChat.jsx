import { useState } from 'react';
import '../styles/Dashboard.css';

const SupportChat = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [chats] = useState([
    { id: 1, name: 'John Doe', lastMsg: 'I have an issue with payment', time: '2m ago', online: true, type: 'User' },
    { id: 2, name: 'Sarah Miller', lastMsg: 'Can I add a portfolio?', time: '1h ago', online: false, type: 'Professional' },
    { id: 3, name: 'Michael Chen', lastMsg: 'Service not appearing in search', time: '3h ago', online: true, type: 'Professional' }
  ]);

  return (
    <div className="search-container" style={{ height: 'calc(100vh - 150px)' }}>
      <div className="glass" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', borderRadius: '24px', overflow: 'hidden' }}>
        {/* Chat List */}
        <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3>Customer Chat</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                style={{ 
                  padding: '15px 20px', 
                  cursor: 'pointer', 
                  background: activeChat === chat.id ? 'var(--primary-glow)' : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700' }}>{chat.name}</span>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-dim)' }}>{chat.type}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{chat.time}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {chat.lastMsg}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%', border: '2px solid var(--bg-card)' }}></div>
            </div>
            <div>
              <div style={{ fontWeight: '700' }}>{chats.find(c => c.id === activeChat)?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Support ID: #SUPP-102-44</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ alignSelf: 'center', padding: '5px 15px', background: 'var(--bg-card)', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              Connected with Support Agent #44
            </div>
            <div style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'var(--bg-card)', borderRadius: '0 15px 15px 15px', maxWidth: '70%' }}>
              Hi, I'm having trouble with my recent payment. It failed but the money was deducted.
            </div>
            <div style={{ alignSelf: 'flex-end', padding: '12px 18px', background: 'var(--primary)', borderRadius: '15px 15px 0 15px', color: 'var(--text-main)', maxWidth: '70%' }}>
              Hello John! I'm sorry to hear that. Could you please provide the transaction ID from your bank statement?
            </div>
            <div style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'var(--bg-card)', borderRadius: '0 15px 15px 15px', maxWidth: '70%' }}>
              It's TXN-12345678. I have the screenshot ready.
            </div>
          </div>

          <div style={{ padding: '20px 30px', background: 'rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn" style={{ padding: '0 15px', background: 'var(--bg-card)' }}></button>
              <input 
                type="text" 
                placeholder="Type your reply to the customer..." 
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 20px', color: 'var(--text-main)' }}
              />
              <button className="btn btn-primary" style={{ padding: '0 25px' }}>Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default SupportChat;
