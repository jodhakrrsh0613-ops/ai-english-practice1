import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import ChatInterface from './components/ChatInterface';
import InputArea from './components/InputArea';
import FeedbackModal from './components/FeedbackModal';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(!localStorage.getItem('gemini_api_key'));
  const [tempApiKey, setTempApiKey] = useState('');
  
  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = () => {
    setSessionId(uuidv4());
    setMessages([
      { role: 'model', content: JSON.stringify({ reply: "Hi! How are you today?" }) }
    ]);
    setShowFeedback(false);
    setFeedbackData(null);
  };

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
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
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ message: text, history: messages })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify(data) }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify({ reply: "Sorry, I'm having trouble connecting to the server.", correction: null, explanation: null }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndChat = async () => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
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
    <div className="app-container">
      {showApiKeyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2>Welcome to AI English Tutor!</h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Please enter your Google Gemini API Key to start practicing.
            </p>
            <input 
              type="password" 
              placeholder="Paste your API key here..." 
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <button className="btn-close" onClick={saveApiKey}>
              Save and Start
            </button>
          </div>
        </div>
      )}

      <header>
        <div className="header-title">
          <h1>AI English Tutor</h1>
          <p>Practice speaking & grammar</p>
        </div>
        <div className="header-actions">
          <button onClick={() => {
            localStorage.removeItem('gemini_api_key');
            setApiKey('');
            setShowApiKeyModal(true);
          }}>Change API Key</button>
          <button onClick={startNewSession}>New Chat</button>
          <button className="btn-end" onClick={handleEndChat}>End Chat</button>
        </div>
      </header>

      <ChatInterface messages={messages} isTyping={isTyping} />
      <InputArea onSend={handleSendMessage} disabled={isTyping || showApiKeyModal} />
      
      {showFeedback && (
        <FeedbackModal 
          data={feedbackData} 
          onClose={() => setShowFeedback(false)} 
          onRestart={startNewSession} 
        />
      )}
    </div>
  );
}

export default App;
