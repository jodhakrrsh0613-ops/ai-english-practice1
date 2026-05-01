import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Sun, Moon, ChevronDown, Menu, X, LogOut, UserCircle, 
  MessageSquare, Book, CheckSquare, Languages, Zap, FileText, Activity, Layout, 
  Search, Palette, BookOpen, Shield, Rocket, Cpu 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MegaMenu from './ui/mega-menu';
import './Navbar.css';

const MEGA_MENU_ITEMS = [
  { id: 1, label: "Home", link: "/" },
  { id: 2, label: "AI Chat", link: "/chat" },
  {
    id: 3,
    label: "Practice",
    subMenus: [
      {
        title: "Learning Hub",
        items: [
          {
            label: "Practice Lab",
            description: "Real-time conversation practice",
            icon: Activity,
            path: "/practice"
          },
          {
            label: "Grammar Checker",
            description: "Fix writing errors instantly",
            icon: CheckSquare,
            path: "/grammar"
          },
          {
            label: "Vocabulary",
            description: "Learn high-impact words",
            icon: Book,
            path: "/vocabulary"
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Tools",
    subMenus: [
      {
        title: "Utility Tools",
        items: [
          {
            label: "Translator",
            description: "Speak across languages",
            icon: Languages,
            path: "/translator"
          },
          {
            label: "AI Rewriter",
            description: "Refine your sentences",
            icon: Zap,
            path: "/tools"
          },
          {
            label: "Resume Builder",
            description: "Create professional CVs",
            icon: FileText,
            path: "/tools"
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Writing",
    subMenus: [
      {
        title: "Evaluation",
        items: [
          {
            label: "Writing Test",
            description: "Get detailed feedback",
            icon: Layout,
            path: "/writing"
          },
          {
            label: "Smart Quiz",
            description: "Test your knowledge",
            icon: Palette,
            path: "/writing"
          },
        ],
      },
    ],
  },
  { id: 6, label: "Dashboard", link: "/dashboard" },
];

const MOBILE_GROUPS = [
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
      { name: '🧠 AI Rewriter', path: '/tools' },
      { name: '🧾 Resume Builder', path: '/tools' },
    ]
  },
  {
    name: 'Writing',
    children: [
      { name: '📝 Writing Test', path: '/writing' },
      { name: '🧪 Smart Quiz', path: '/writing' },
    ]
  },
  { name: 'Dashboard', path: '/dashboard' },
];

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

          {/* Desktop Nav - Mega Menu */}
          <div className="desktop-nav">
            <MegaMenu items={MEGA_MENU_ITEMS} />
          </div>

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
          {MOBILE_GROUPS.map(group =>
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
