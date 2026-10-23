import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="main-column">
        <Navbar onMenuClick={() => setSidebarOpen(open => !open)} />
        <main className="page-content"><Outlet /></main>
        <footer className="page-footer">StayManager <span>•</span> Property management, made simpler.</footer>
      </div>
    </div>
  );
}