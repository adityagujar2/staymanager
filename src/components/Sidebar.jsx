import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/rooms', icon: '⌂', label: 'Rooms' },
  { to: '/guests', icon: '♙', label: 'Guests' },
  { to: '/payments', icon: '₹', label: 'Payments' },
  { to: '/staff', icon: '♧', label: 'Staff' },
  { to: '/attendance', icon: '✓', label: 'Attendance' },
  { to: '/maintenance', icon: '⚙', label: 'Maintenance' },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <>
      <div className={open ? 'sidebar-overlay visible' : 'sidebar-overlay'} onClick={onNavigate} />
      <aside className={open ? 'sidebar sidebar-open' : 'sidebar'}>
        <NavLink to="/dashboard" className="brand" onClick={onNavigate}>
          <span className="brand-mark">S</span>
          <span>StayManager<small>PROPERTY OPERATIONS</small></span>
        </NavLink>
        <p className="nav-caption">WORKSPACE</p>
        <nav className="sidebar-nav">
          {items.map(item => (
            <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-icon">✦</span><strong>Stay organized</strong><p>Keep your property operations in one place.</p></div>
          <span className="sidebar-version">StayManager · Demo v1.0</span>
        </div>
      </aside>
    </>
  );
}