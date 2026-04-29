import { Volume2, Sparkles, User } from 'lucide-react';

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
    }
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user-msg' : 'ai-msg'} animate-fade`}>
      <div className="avatar-container">
        <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
          {isUser ? <User size={20} /> : <Sparkles size={20} />}
        </div>
      </div>
      
      <div className="message-container">
        <div className="message-header">
          <span className="sender-name">{isUser ? 'You' : 'SpeakPro AI'}</span>
        </div>
        
        <div className="message-bubble-content">
          <div className="msg-text">{content}</div>
          
          {!isUser && (
            <div className="msg-toolbar">
              <button className="btn-action-icon" onClick={handleSpeak} title="Listen">
                <Volume2 size={16} />
              </button>
            </div>
          )}

          {!isUser && (correction || explanation) && (
            <div className="tutor-feedback animate-slide-up">
              <div className="feedback-badge">Tutor Feedback</div>
              {correction && (
                <div className="feedback-item">
                  <span className="label">Correction:</span>
                  <p className="value highlight">{correction}</p>
                </div>
              )}
              {explanation && (
                <div className="feedback-item">
                  <span className="label">Why?</span>
                  <p className="value">{explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
