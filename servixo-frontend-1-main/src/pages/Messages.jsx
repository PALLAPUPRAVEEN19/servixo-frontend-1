import { useState } from 'react';
import '../styles/Dashboard.css';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [chats] = useState([
    { id: 1, name: 'John Doe', lastMsg: 'Wait, so can you come at 10 AM?', time: '2m ago', online: true },
    { id: 2, name: 'Jane Smith', lastMsg: 'Thanks for the quick cleaning!', time: '1h ago', online: false },
    { id: 3, name: 'Chris Evans', lastMsg: 'Is the price fixed?', time: '3h ago', online: true }
  ]);

  return (
    <div className="search-container" style={{ height: 'calc(100vh - 150px)' }}>
      <div className="glass" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', borderRadius: '24px', overflow: 'hidden' }}>
        {/* Chat List */}
        <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3>Messages</h3>
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
                  <span style={{ fontWeight: '700' }}>{chat.name}</span>
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
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)' }}></div>
            <div>
              <div style={{ fontWeight: '700' }}>{chats.find(c => c.id === activeChat)?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Online</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'var(--bg-card)', borderRadius: '0 15px 15px 15px', maxWidth: '70%' }}>
              Hi Sarah, are you available for a quick cleaning session tomorrow morning?
            </div>
            <div style={{ alignSelf: 'flex-end', padding: '12px 18px', background: 'var(--primary)', borderRadius: '15px 15px 0 15px', color: 'var(--text-main)', maxWidth: '70%' }}>
              Hi John! Yes, I have a slot at 10 AM. Would that work for you?
            </div>
            <div style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'var(--bg-card)', borderRadius: '0 15px 15px 15px', maxWidth: '70%' }}>
              Wait, so can you come at 10 AM?
            </div>
          </div>

          <div style={{ padding: '20px 30px', background: 'rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 20px', color: 'var(--text-main)' }}
              />
              <button className="btn btn-primary" style={{ padding: '0 25px' }}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Messages;
