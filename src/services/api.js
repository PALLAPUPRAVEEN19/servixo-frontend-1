import api from '../api';

// =================== AUTH ===================
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  register: (userData) =>
    api.post('/auth/register', userData).then(res => res.data),

  sendOtp: (email) =>
    api.post('/auth/send-otp', { email }).then(res => res.data),

  verifyOtpLogin: (email, otp) =>
    api.post('/auth/verify-otp-login', { email, otp }).then(res => res.data),

  verifyLoginOtp: (email, otp) =>
    api.post('/auth/verify-login-otp', { email, otp }).then(res => res.data),

  googleLogin: (token) =>
    api.post('/auth/google', { token }).then(res => res.data),
};

// =================== SERVICES ===================
export const serviceAPI = {
  getApproved: () => api.get('/services').then(res => res.data),
  getAll: () => api.get('/services/all').then(res => res.data),
  search: (keyword) => api.get(`/services/search?keyword=${encodeURIComponent(keyword)}`).then(res => res.data),
  getByProfessional: (proId) => api.get(`/services/professional/${proId}`).then(res => res.data),
  createForPro: (proId, service) => api.post(`/services/${proId}`, service).then(res => res.data),
  approve: (id) => api.put(`/services/approve/${id}`).then(res => res.data),
  reject: (id) => api.put(`/services/reject/${id}`).then(res => res.data),
  add: (service) => api.post('/services', service).then(res => res.data),
};

// =================== BOOKINGS ===================
export const bookingAPI = {
  create: (booking) => {
    const { userId, serviceId, ...payload } = booking;
    return api.post(`/bookings?userId=${userId}&serviceId=${serviceId}`, payload).then(res => res.data);
  },
  getByUser: (userId) => api.get(`/bookings/user/${userId}`).then(res => res.data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status?status=${status}`).then(res => res.data),
};

// =================== TICKETS ===================
export const ticketAPI = {
  create: (userId, ticket) => api.post(`/tickets/${userId}`, ticket).then(res => res.data),
  getAll: () => api.get('/tickets').then(res => res.data),
  getByUser: (userId) => api.get(`/tickets/user/${userId}`).then(res => res.data),
  updateStatus: (id, status) => api.put(`/tickets/${id}?status=${status}`).then(res => res.data),
};

// =================== DASHBOARD ===================
export const dashboardAPI = {
  getStats: (userId, role) => api.get(`/dashboard/stats?userId=${userId}&role=${role}`).then(res => res.data),
};

// =================== ADMIN ===================
export const adminAPI = {
  getUsers: () => api.get('/admin/users').then(res => res.data),
  getStats: () => api.get('/admin/stats').then(res => res.data),
  getServices: () => api.get('/admin/services').then(res => res.data),
  getTickets: () => api.get('/admin/tickets').then(res => res.data),
  getRevenue: () => api.get('/admin/revenue').then(res => res.data),
  approveService: (id) => api.put(`/admin/services/${id}/approve`).then(res => res.data),
  updateTicket: (id, status) => api.put(`/admin/tickets/${id}?status=${status}`).then(res => res.data),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData).then(res => res.data),
};

// =================== SUPPORT ===================
export const supportAPI = {
  getTickets: () => api.get('/support/tickets').then(res => res.data),
  getTicketsByStatus: (status) => api.get(`/support/tickets/status?status=${status}`).then(res => res.data),
  updateTicket: (id, status) => api.put(`/support/tickets/${id}?status=${status}`).then(res => res.data),
  deleteTicket: (id) => api.delete(`/support/tickets/${id}`).then(res => res.data),
};

// =================== PROFESSIONAL ===================
export const proAPI = {
  getProfile: (id) => api.get(`/professional/${id}`).then(res => res.data),
  getServices: (proId) => api.get(`/professional/services/${proId}`).then(res => res.data),
  addService: (service) => api.post('/professional/services', service).then(res => res.data),
  getBookings: (proId) => api.get(`/professional/bookings/${proId}`).then(res => res.data),
  getEarnings: () => api.get('/professional/earnings').then(res => res.data),
};

// =================== FEEDBACK ===================
export const feedbackAPI = {
  getAll: () => api.get('/feedback').then(res => res.data),
  getByPro: (proId) => api.get(`/feedback/professional/${proId}`).then(res => res.data),
  add: (feedback) => api.post('/feedback', feedback).then(res => res.data),
};

// =================== MESSAGES ===================
export const messageAPI = {
  send: (message) => api.post('/messages', message).then(res => res.data),
  getByUser: (userId) => api.get(`/messages/user/${userId}`).then(res => res.data),
};
