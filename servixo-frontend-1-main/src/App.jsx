import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpLogin from './pages/OtpLogin';
import UserServices from './pages/UserServices';
import BookingForm from './pages/BookingForm';
import Bookings from './pages/Bookings';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import TicketPage from './pages/TicketPage';
import MyTicketDetail from './pages/MyTicketDetail';
import ManageUsers from './pages/ManageUsers';
import AdminPanel from './pages/AdminPanel';
import Revenue from './pages/Revenue';
import SystemSettings from './pages/SystemSettings';
import ProProfile from './pages/ProProfile';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProBookings from './pages/ProBookings';
import Messages from './pages/Messages';
import Earnings from './pages/Earnings';
import SupportPanel from './pages/SupportPanel';
import TicketDetails from './pages/TicketDetails';
import SupportChat from './pages/SupportChat';
import Analytics from './pages/Analytics';
import KnowledgeBase from './pages/KnowledgeBase';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import {
  UserDashboard,
  AdminDashboard,
  ProDashboard,
  SupportDashboard,
  Unauthorized
} from './pages/Dashboards';
import ConfirmBooking from './pages/ConfirmBooking';
import './styles/global.css';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Keep environment clean but don't blow away valid session
    const allowedKeys = ["user", "isLoggedIn", "token", "role", "userId"];
    Object.keys(localStorage).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const DashboardRedirect = () => {
    const token = sessionStorage.getItem('token');
    const role = (localStorage.getItem('role') || '').toUpperCase().replace(/^ROLE_/, '');
    
    if (!token || !role) return <Navigate to="/login" replace />;
    
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'PROFESSIONAL') return <Navigate to="/professional/dashboard" replace />;
    if (role === 'SUPPORT') return <Navigate to="/support/dashboard" replace />;
    if (role === 'USER') return <Navigate to="/user/dashboard" replace />;
    
    // If no valid role is found, block access safely
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<OtpLogin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Centralized Dashboard router */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* ========== USER Routes ========== */}
      <Route path="/user" element={<ProtectedRoute roles={["USER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="services" element={<UserServices />} />
          <Route path="booking/:serviceId" element={<BookingForm />} />
          <Route path="confirm-booking" element={<ConfirmBooking />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tickets" element={<TicketPage />} />
          <Route path="ticket-detail" element={<MyTicketDetail />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Route>

      {/* ========== ADMIN Routes ========== */}
      <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="manage-services" element={<AdminPanel />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="tickets" element={<SupportPanel />} />
          <Route path="ticket-details" element={<TicketDetails />} />
        </Route>
      </Route>

      {/* ========== PROFESSIONAL Routes ========== */}
      <Route path="/professional" element={<ProtectedRoute roles={["PROFESSIONAL"]} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/professional/dashboard" replace />} />
          <Route path="dashboard" element={<ProDashboard />} />
          <Route path="profile" element={<ProProfile />} />
          <Route path="services" element={<ProfessionalDashboard />} />
          <Route path="bookings" element={<ProBookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="earnings" element={<Earnings />} />
        </Route>
      </Route>

      {/* ========== SUPPORT Routes ========== */}
      <Route path="/support" element={<ProtectedRoute roles={["SUPPORT"]} />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/support/dashboard" replace />} />
          <Route path="dashboard" element={<SupportDashboard />} />
          <Route path="tickets" element={<SupportPanel />} />
          <Route path="ticket-details" element={<TicketDetails />} />
          <Route path="chat" element={<SupportChat />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="kb" element={<KnowledgeBase />} />
        </Route>
      </Route>

      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
