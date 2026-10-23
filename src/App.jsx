import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useStayManager } from './context/StayManagerContext.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import Guests from './pages/Guests.jsx';
import Payments from './pages/Payments.jsx';
import Staff from './pages/Staff.jsx';
import Attendance from './pages/Attendance.jsx';
import Maintenance from './pages/Maintenance.jsx';

function ProtectedLayout() {
  const { authenticated } = useStayManager();
  return authenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { authenticated } = useStayManager();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>
        <Route path="*" element={<Navigate to={authenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}