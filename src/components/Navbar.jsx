import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, ChevronDown, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_GROUPS = [
  { name: 'Home', path: '/' },
  { name: 'AI Chat', path: '/chat' },
  {
    name: 'Practice',
    children: [
      { name: '🗣️ Practice Lab', path: '/practice' },
      { name: '✅ Grammar Checker', path: '/grammar' },
      { name: '📚 Vocabulary', path: '/vocabulary' },
    ]
  },
  {
    name: 'Tools',
    children: [
      { name: '🌐 Translator', path: '/translator' },
      { name: '🧠 Sentence Rewriter', path: '/tools' },
      { name: '📧 Email Generator', path: '/tools' },
      { name: '🧾 Resume Builder', path: '/tools' },
    ]
  },
  {
    name: 'Writing',
    children: [
      { name: '📝 Writing Evaluation', path: '/writing' },
      { name: '🧪 Smart Quiz', path: '/writing' },
    ]
  },
  { name: 'Dashboard', path: '/dashboard' },
];

function NavDropdown({ group, currentPath }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = group.children?.some(c => currentPath === c.path);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <li className="nav-dropdown-wrapper" ref={ref}>
      <button
        className={`nav-item nav-dropdown-trigger ${isActive ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {group.name} <ChevronDown size={14} className={`chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="nav-dropdown-menu glass animate-fade">
          {group.children.map(child => (
            <Link
              key={child.path + child.name}
              to={child.path}
              className={`nav-dropdown-item ${currentPath === child.path ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="navbar glass">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <Sparkles className="logo-icon" size={28} />
            <span>SpeakPro AI</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {NAV_GROUPS.map(group =>
              group.children ? (
                <NavDropdown key={group.name} group={group} currentPath={location.pathname} />
              ) : (
                <li key={group.path}>
                  <Link to={group.path} className={`nav-item ${location.pathname === group.path ? 'active' : ''}`}>
                    {group.name}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user && (
              <div className="nav-user-pill">
                <UserCircle size={20} />
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                <button className="btn-logout" onClick={handleLogout} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            )}
            <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu glass animate-fade" onClick={() => setMobileOpen(false)}>
          {NAV_GROUPS.map(group =>
            group.children ? (
              <div key={group.name} className="mobile-group">
                <span className="mobile-group-label">{group.name}</span>
                {group.children.map(child => (
                  <Link key={child.name} to={child.path} className={`mobile-link ${location.pathname === child.path ? 'active' : ''}`}>
                    {child.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={group.path} to={group.path} className={`mobile-link ${location.pathname === group.path ? 'active' : ''}`}>
                {group.name}
              </Link>
            )
          )}
          {user && (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out ({user.name.split(' ')[0]})
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
