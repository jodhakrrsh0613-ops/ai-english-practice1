import { X, Award, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';

function FeedbackModal({ data, onClose, onRestart }) {
  if (!data) return null;

  return (
    <div className="modal-overlay animate-fade">
      <div className="modal-card glass animate-slide-up">
        <button className="btn-modal-close" onClick={onClose}><X size={20} /></button>
        
        <header className="modal-header">
          <div className="award-icon"><Award size={48} /></div>
          <h2>Session Review</h2>
          <p>Here's how you did in your recent practice session.</p>
        </header>
        
        <div className="modal-body">
          <div className="feedback-card strength">
            <h3><Award size={18} /> <span>Your Strengths</span></h3>
            <ul>
              {data.strengths?.length > 0 
                ? data.strengths.map((item, i) => <li key={i}>{item}</li>)
                : <li>No specific strengths recorded this time.</li>}
            </ul>
          </div>

          <div className="feedback-card warning">
            <h3><AlertTriangle size={18} /> <span>Areas to Improve</span></h3>
            <ul>
              {data.mistakes?.length > 0 
                ? data.mistakes.map((item, i) => <li key={i}>{item}</li>)
                : <li>Great job! No major mistakes noted.</li>}
            </ul>
          </div>

          <div className="feedback-card info">
            <h3><Lightbulb size={18} /> <span>Suggestions</span></h3>
            <ul>
              {data.suggestions?.length > 0 
                ? data.suggestions.map((item, i) => <li key={i}>{item}</li>)
                : <li>Keep practicing regularly!</li>}
            </ul>
          </div>
        </div>

        <footer className="modal-footer">
          <button 
            className="btn-primary full-width"
            onClick={() => {
              onClose();
              onRestart();
            }}
          >
            <RefreshCw size={18} />
            <span>Start New Session</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

export default FeedbackModal;
