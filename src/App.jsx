import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Grammar from './pages/Grammar';
import Vocabulary from './pages/Vocabulary';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Translator from './pages/Translator';
import PracticeHub from './pages/PracticeHub';
import WritingLab from './pages/WritingLab';
import ToolsHub from './pages/ToolsHub';
import './App.css';

// Loading spinner while checking session
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'var(--bg-main)'
    }}>
      <div style={{
        width: 44, height: 44, border: '4px solid var(--primary-light)',
        borderTop: '4px solid var(--primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Loading SpeakPro AI...</p>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// Protected route — login nahi hai toh /auth pe redirect
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}

// Public route — already logged in hai toh / pe redirect
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public auth route */}
      <Route path="/auth" element={
        <PublicRoute><Auth /></PublicRoute>
      } />

      {/* Protected routes under MainLayout */}
      <Route path="/" element={
        <ProtectedRoute><MainLayout /></ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="grammar" element={<Grammar />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="translator" element={<Translator />} />
        <Route path="practice" element={<PracticeHub />} />
        <Route path="writing" element={<WritingLab />} />
        <Route path="tools" element={<ToolsHub />} />
      </Route>

      {/* Catch all — redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
