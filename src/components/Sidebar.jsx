import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Mic2, 
  BarChart3, 
  Settings, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const SIDEBAR_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'My Library', path: '/library', icon: <Library size={20} /> },
  { name: 'Live Practice', path: '/practice', icon: <Mic2 size={20} /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

import { X } from 'lucide-react';

function Sidebar({ mobileOpen, closeSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <Sparkles className="logo-icon" size={24} />
            <span>SpeakPro AI</span>
          </Link>
          <button className="sidebar-close" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <h3 className="user-name">{user?.name || 'Alex Mercer'}</h3>
            <p className="user-level">Fluent Level B2</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth <= 1024) closeSidebar(); }}
              >
                <span className="link-icon">{link.icon}</span>
                <span className="link-name">{link.name}</span>
                {isActive && <div className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-daily-goal">
            Start Daily Goal
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
