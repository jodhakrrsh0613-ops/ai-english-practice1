function FeedbackModal({ data, onClose, onRestart }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Session Feedback</h2>
        
        <div className="feedback-section">
          <h3 className="strengths">🌟 Strengths</h3>
          <ul>
            {data.strengths?.length > 0 
              ? data.strengths.map((item, i) => <li key={i}>{item}</li>)
              : <li>No specific strengths recorded this time.</li>}
          </ul>
        </div>

        <div className="feedback-section">
          <h3 className="mistakes">⚠️ Areas to Improve</h3>
          <ul>
            {data.mistakes?.length > 0 
              ? data.mistakes.map((item, i) => <li key={i}>{item}</li>)
              : <li>Great job! No major mistakes noted.</li>}
          </ul>
        </div>

        <div className="feedback-section">
          <h3 className="suggestions">💡 Suggestions</h3>
          <ul>
            {data.suggestions?.length > 0 
              ? data.suggestions.map((item, i) => <li key={i}>{item}</li>)
              : <li>Keep practicing regularly!</li>}
          </ul>
        </div>

        <button 
          className="btn-close"
          onClick={() => {
            onClose();
            onRestart();
          }}
        >
          Start New Practice Session
        </button>
      </div>
    </div>
  );
}

export default FeedbackModal;
