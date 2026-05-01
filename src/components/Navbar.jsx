import { Link } from 'react-router-dom';
import { Bell, User, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <Search size={20} />
        </button>
        <div className="nav-links-top">
          <Link to="/lessons" className="top-link">Lessons</Link>
          <Link to="/progress" className="top-link">Progress</Link>
          <Link to="/tutor" className="top-link">AI Tutor</Link>
          <Link to="/community" className="top-link">Community</Link>
        </div>
      </div>

      <div className="nav-right">
        <button className="btn-try-pro">Try Pro</button>
        <button className="nav-icon-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <div className="nav-user-profile">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
