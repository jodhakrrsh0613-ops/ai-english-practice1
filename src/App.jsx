import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Grammar from './pages/Grammar';
import Vocabulary from './pages/Vocabulary';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import './App.css';

// Placeholder Pages for remaining features
const Placeholder = ({ title }) => (
  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>This feature is coming soon!</p>
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
