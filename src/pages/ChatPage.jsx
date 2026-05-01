import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, StopCircle, MessageSquare, Trash2, Clock } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import InputArea from '../components/InputArea';
import FeedbackModal from '../components/FeedbackModal';
import './Chat.css';

const STORAGE_KEY = 'speakpro_chat_sessions';
const MAX_SESSIONS = 20;

// LocalStorage helpers
const loadSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveSessions = (sessions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // storage full — remove oldest
    const trimmed = sessions.slice(-MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
};

// First user message se session title nikalna
const getSessionTitle = (messages) => {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'New Conversation';
  return first.content.length > 40
    ? first.content.slice(0, 40) + '…'
    : first.content;
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const WELCOME_MSG = { role: 'model', content: JSON.stringify({ reply: "Hi! I'm your AI tutor. How are you feeling today? Let's practice some English!" }) };

function ChatPage() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  // Load all saved sessions on mount
  useEffect(() => {
    const saved = loadSessions();
    setSessions(saved);
    // If sessions exist, load the most recent one instead of creating a new one
    if (saved.length > 0) {
      loadSession(saved[0]);
    } else {
      createNewSession(saved);
    }
  }, []);

  // Auto-save current session whenever messages change
  useEffect(() => {
    if (!sessionId || messages.length <= 1) return;
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === sessionId
          ? { ...s, messages, title: getSessionTitle(messages), updatedAt: new Date().toISOString() }
          : s
      );
      // If session doesn't exist yet, add it
      const exists = updated.some(s => s.id === sessionId);
      const final = exists ? updated : [
        { id: sessionId, messages, title: getSessionTitle(messages), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ...updated
      ];
      saveSessions(final);
      return final;
    });
  }, [messages, sessionId]);

  const createNewSession = (existingSessions = sessions) => {
    const newId = uuidv4();
    const newSession = {
      id: newId,
      messages: [WELCOME_MSG],
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newSession, ...existingSessions].slice(0, MAX_SESSIONS);
    setSessions(updated);
    saveSessions(updated);
    setSessionId(newId);
    setMessages([WELCOME_MSG]);
    setShowFeedback(false);
    setFeedbackData(null);
  };

  const loadSession = (session) => {
    setSessionId(session.id);
    setMessages(session.messages);
    setShowFeedback(false);
    setFeedbackData(null);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSessions(updated);
      return updated;
    });
    // If deleting active session, start a new one
    if (id === sessionId) {
      createNewSession(sessions.filter(s => s.id !== id));
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages })
      });
      const data = await response.json();

      if (data.reply && data.reply.toString().includes("exceeded your current quota")) {
        setMessages(prev => [...prev, {
          role: 'model',
          content: JSON.stringify({ reply: "I'm taking a short break! 😅 Please wait about 30-60 seconds and then try sending your message again.", correction: null, explanation: null })
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: JSON.stringify(data) }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify({ reply: "Connection error. Please try again.", correction: null, explanation: null }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndChat = async () => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages })
      });
      const data = await response.json();
      setFeedbackData(data);
      setShowFeedback(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page-container animate-fade">
      <div className="chat-layout">
        {/* Sidebar with history */}
        <aside className="chat-sidebar">
          <button className="btn-new-chat" onClick={() => createNewSession()}>
            <PlusCircle size={20} />
            <span>New Session</span>
          </button>

          {/* History List */}
          <div className="history-section">
            <p className="history-label">Recent Conversations</p>
            <div className="history-list">
              {sessions.length === 0 ? (
                <p className="history-empty">No sessions yet</p>
              ) : (
                sessions.map(session => (
                  <div
                    key={session.id}
                    className={`history-item ${session.id === sessionId ? 'history-item--active' : ''}`}
                    onClick={() => loadSession(session)}
                  >
                    <MessageSquare size={14} className="history-icon" />
                    <div className="history-item-content">
                      <span className="history-title">{session.title}</span>
                      <span className="history-time">
                        <Clock size={11} />
                        {formatTime(session.updatedAt)}
                      </span>
                    </div>
                    <button
                      className="history-delete"
                      onClick={(e) => deleteSession(e, session.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="btn-end-session" onClick={handleEndChat} disabled={messages.length < 3}>
            <StopCircle size={20} />
            <span>End &amp; Review</span>
          </button>
        </aside>

        {/* Main Chat */}
        <main className="chat-main">
          <header className="chat-header glass">
            <div className="chat-status">
              <div className="status-dot"></div>
              <span>Live Practice Session</span>
            </div>
          </header>

          <ChatInterface messages={messages} isTyping={isTyping} />

          <footer className="chat-input-footer">
            <InputArea onSend={handleSendMessage} disabled={isTyping} />
            <p className="chat-tip">Tip: Try to use full sentences for better practice!</p>
          </footer>
        </main>
      </div>

      {showFeedback && (
        <FeedbackModal
          data={feedbackData}
          onClose={() => setShowFeedback(false)}
          onRestart={() => createNewSession()}
        />
      )}
    </div>
  );
}

export default ChatPage;
