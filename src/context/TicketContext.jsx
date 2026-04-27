import { createContext, useState, useContext, useCallback } from 'react';
import { ticketAPI, supportAPI, adminAPI } from '../services/api';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tickets for a specific user
  const fetchUserTickets = useCallback(async (userId) => {
    setLoading(true);
    try {
      const data = await ticketAPI.getByUser(userId);
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch user tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tickets (for support/admin)
  const fetchAllTickets = useCallback(async (role = 'support') => {
    setLoading(true);
    try {
      const data = role === 'admin'
        ? await adminAPI.getTickets()
        : await supportAPI.getTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch all tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new ticket
  const createTicket = async (ticketData) => {
    try {
      const newTicket = await ticketAPI.create(ticketData);
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      console.error('Failed to create ticket:', err);
      throw err;
    }
  };

  // Update ticket status
  const updateTicket = async (id, status, role = 'support') => {
    try {
      let updated;
      if (role === 'admin') {
        updated = await adminAPI.updateTicket(id, status);
      } else {
        updated = await supportAPI.updateTicket(id, status);
      }
      setTickets(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      console.error('Failed to update ticket:', err);
      throw err;
    }
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      loading,
      createTicket,
      updateTicket,
      fetchUserTickets,
      fetchAllTickets,
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
