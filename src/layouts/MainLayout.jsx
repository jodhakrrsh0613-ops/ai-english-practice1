import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="main-layout">
      <Sidebar mobileOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="layout-wrapper" style={{ 
        marginLeft: 'var(--sidebar-width)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease'
      }}>
        <Navbar theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
        <main className="main-content" style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .layout-wrapper { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default MainLayout;
