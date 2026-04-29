import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from '../components/ChatInterface';
import InputArea from '../components/InputArea';
import FeedbackModal from '../components/FeedbackModal';

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
      { role: 'model', content: JSON.stringify({ reply: "Hi! How are you today?" }) }
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
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text, history: messages })
      });
      const data = await response.json();
      
      // Handle Rate Limits (Quota Exceeded)
      if (data.reply && data.reply.toString().includes("exceeded your current quota")) {
        const quotaMsg = {
          role: 'model',
          content: JSON.stringify({
            reply: "I'm taking a short break! 😅 Please wait about 30-60 seconds and then try sending your message again. The free version has a small limit per minute.",
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
          'Content-Type': 'application/json'
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
    <div className="page-container chat-page">
      <header className="page-header">
        <div className="header-title">
          <h1>AI English Tutor</h1>
          <p>Practice speaking & grammar</p>
        </div>
        <div className="header-actions">
          <button onClick={startNewSession}>New Chat</button>
          <button className="btn-end" onClick={handleEndChat}>End Chat</button>
        </div>
      </header>

      <ChatInterface messages={messages} isTyping={isTyping} />
      <InputArea onSend={handleSendMessage} disabled={isTyping} />
      
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
