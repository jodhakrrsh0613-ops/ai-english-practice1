import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function ChatInterface({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      
      {isTyping && (
        <div className="message-wrapper ai">
          <div className="message-bubble typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatInterface;
