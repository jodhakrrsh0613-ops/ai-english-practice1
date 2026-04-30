import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Grammar from './pages/Grammar';
import Vocabulary from './pages/Vocabulary';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

// ── New Feature Pages ──
import Translator from './pages/Translator';
import PracticeHub from './pages/PracticeHub';
import WritingLab from './pages/WritingLab';
import ToolsHub from './pages/ToolsHub';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Existing routes — unchanged */}
          <Route index element={<Home />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="auth" element={<Auth />} />

          {/* New feature routes */}
          <Route path="translator" element={<Translator />} />
          <Route path="practice" element={<PracticeHub />} />
          <Route path="writing" element={<WritingLab />} />
          <Route path="tools" element={<ToolsHub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
