import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, Sun, Moon } from 'lucide-react';
import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Chat', path: '/chat' },
    { name: 'Grammar', path: '/grammar' },
    { name: 'Vocabulary', path: '/vocabulary' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Sparkles className="logo-icon" size={28} />
          <span>SpeakPro AI</span>
        </Link>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/auth" className="btn-profile">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
