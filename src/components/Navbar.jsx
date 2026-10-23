import { useLocation, useNavigate } from 'react-router-dom';
import { useStayManager } from '../context/StayManagerContext.jsx';

const titles = {
  '/dashboard': ['Dashboard', 'Here is what is happening at your property today.'],
  '/rooms': ['Rooms', 'Manage room availability, sharing type, and rent.'],
  '/guests': ['Guests', 'Keep track of residents and their stay details.'],
  '/payments': ['Payments', 'Track rent collection and pending payments.'],
  '/staff': ['Staff', 'Manage your property team.'],
  '/attendance': ['Attendance', 'Record daily staff attendance.'],
  '/maintenance': ['Maintenance', 'Track repair requests and their progress.'],
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useStayManager();
  const [title, subtitle] = titles[location.pathname] || ['StayManager', 'Property operations'];
  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button menu-button" onClick={onMenuClick} aria-label="Open navigation">☰</button>
        <div><h1>{title}</h1><p>{subtitle}</p></div>
      </div>
      <div className="topbar-actions">
        <span className="environment-pill"><span /> Demo workspace</span>
        <div className="profile-avatar">A</div>
        <div className="profile-text"><strong>Admin</strong><small>Property manager</small></div>
        <button className="logout-button" onClick={handleLogout}>Sign out</button>
      </div>
    </header>
  );
}