import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Grammar from './pages/Grammar';
import Vocabulary from './pages/Vocabulary';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import './App.css';

import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => (
  <div className="section-container animate-fade" style={{ padding: '80px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className="stat-icon-box orange" style={{ marginBottom: '24px', width: '80px', height: '80px' }}>
      <Construction size={40} />
    </div>
    <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>{title}</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
      We're working hard to bring you the best {title} experience. Stay tuned!
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="speaking" element={<Placeholder title="Speaking Practice" />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="topics" element={<Placeholder title="Topics & Categories" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
