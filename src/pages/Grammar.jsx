import { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, PenTool } from 'lucide-react';
import './Grammar.css';

function Grammar() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Grammar check error:", error);
      alert("Failed to check grammar. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="page-container grammar-page">
      <header className="page-header">
        <div className="header-title">
          <h1>Grammar Checker <PenTool size={24} style={{ display: 'inline', marginLeft: 8, color: 'var(--primary)' }}/></h1>
          <p>Paste your text below and let AI find and fix your mistakes.</p>
        </div>
      </header>

      <div className="grammar-content">
        <div className="input-section">
          <textarea
            placeholder="Type or paste your English text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isChecking}
          />
          <div className="grammar-actions">
            <span className="char-count">{text.length} characters</span>
            <button 
              className="btn-primary" 
              onClick={handleCheck}
              disabled={isChecking || !text.trim()}
            >
              {isChecking ? <><RefreshCw className="spin" size={18} /> Checking...</> : 'Check Grammar'}
            </button>
          </div>
        </div>

        {result && (
          <div className="result-section">
            <div className="result-card">
              <h3>Corrected Text</h3>
              <p className="corrected-text">{result.corrected}</p>
            </div>

            <div className="corrections-list">
              <h3>Detailed Corrections</h3>
              {result.corrections.map((item, idx) => (
                <div key={idx} className="correction-item">
                  <div className="corr-header">
                    <span className="wrong-badge"><AlertCircle size={14}/> {item.wrong}</span>
                    <span className="arrow">→</span>
                    <span className="correct-badge"><CheckCircle2 size={14}/> {item.correct}</span>
                  </div>
                  <p className="corr-explanation">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Grammar;
