import { Volume2, AlertCircle } from 'lucide-react';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  let content = message.content;
  let correction = null;
  let explanation = null;

  if (!isUser) {
    try {
      const parsed = JSON.parse(message.content);
      content = parsed.reply || "Error parsing message.";
      correction = parsed.correction;
      explanation = parsed.explanation;
    } catch (e) {
      // Fallback if not JSON
    }
  }

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'ai'}`}>
      <div className="message-bubble">
        <div className="msg-content">{content}</div>
        
        {!isUser && (
          <div className="msg-actions">
            <button className="btn-icon" onClick={handleSpeak} title="Listen">
              <Volume2 size={16} />
            </button>
          </div>
        )}

        {!isUser && correction && (
          <div className="correction-box">
            <div className="corr-title">
              <AlertCircle size={14} /> Correction
            </div>
            <div className="corr-text">{correction}</div>
            {explanation && <div className="corr-expl">{explanation}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
