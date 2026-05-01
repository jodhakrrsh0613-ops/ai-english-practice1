import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { NestedSquares } from '../components/ui/bloom';

function MainLayout() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="main-layout relative overflow-hidden">
      <NestedSquares className="fixed inset-0 m-auto pointer-events-none opacity-30 z-0" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
