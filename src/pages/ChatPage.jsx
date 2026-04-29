import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, StopCircle, Info } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import InputArea from '../components/InputArea';
import FeedbackModal from '../components/FeedbackModal';
import './Chat.css';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = () => {
    setSessionId(uuidv4());
    setMessages([
      { role: 'model', content: JSON.stringify({ reply: "Hi! I'm your AI tutor. How are you feeling today? Let's practice some English!" }) }
    ]);
    setShowFeedback(false);
    setFeedbackData(null);
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
        const quotaMsg = {
          role: 'model',
          content: JSON.stringify({
            reply: "I'm taking a short break! 😅 Please wait about 30-60 seconds and then try sending your message again.",
            correction: null,
            explanation: null
          })
        };
        setMessages(prev => [...prev, quotaMsg]);
      } else {
        const assistantMsg = {
          role: 'model',
          content: JSON.stringify(data)
        };
        setMessages(prev => [...prev, assistantMsg]);
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
        <aside className="chat-sidebar">
          <button className="btn-new-chat" onClick={startNewSession}>
            <PlusCircle size={20} />
            <span>New Session</span>
          </button>
          
          <div className="sidebar-info">
            <div className="info-card">
              <Info size={16} />
              <p>Practice speaking freely. I will correct your grammar as we go!</p>
            </div>
          </div>

          <button className="btn-end-session" onClick={handleEndChat} disabled={messages.length < 3}>
            <StopCircle size={20} />
            <span>End & Review</span>
          </button>
        </aside>

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
          onRestart={startNewSession} 
        />
      )}
    </div>
  );
}

export default ChatPage;
