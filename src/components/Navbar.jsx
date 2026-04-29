import { Link, useLocation } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">SpeakPro AI</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/chat" className={isActive('/chat')}>AI Chat</Link>
          <Link to="/speaking" className={isActive('/speaking')}>Speaking</Link>
          <Link to="/grammar" className={isActive('/grammar')}>Grammar</Link>
          <Link to="/vocabulary" className={isActive('/vocabulary')}>Vocabulary</Link>
          <Link to="/topics" className={isActive('/topics')}>Topics</Link>
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        </div>

        <div className="nav-auth">
          <Link to="/auth" className="btn-login">
            <LogIn size={18} /> Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
