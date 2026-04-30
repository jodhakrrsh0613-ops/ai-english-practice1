import { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, PenTool, ArrowRight } from 'lucide-react';
import './Grammar.css';

function Grammar() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setIsChecking(true);
    setError(null);
    
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.error) {
        throw new Error(data.error);
      }

      if (!data || !data.corrected) {
        throw new Error("Invalid response format from server");
      }

      setResult(data);
    } catch (error) {
      console.error("Grammar check error:", error);
      setError(error.message || "Failed to check grammar. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="grammar-page-container animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Grammar Checker</h1>
          <p>Instantly fix your English mistakes and learn how to improve.</p>
        </header>

        <div className="grammar-tool-layout">
          <div className="grammar-input-card glass">
            <textarea
              placeholder="Paste your text here (e.g., 'I has a apple')..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isChecking}
            />
            <div className="card-footer">
              <span className="count-badge">{text.length} characters</span>
              <button 
                className="btn-primary" 
                onClick={handleCheck}
                disabled={isChecking || !text.trim()}
              >
                {isChecking ? <><RefreshCw className="spin" size={18} /> Analyzing...</> : 'Check Writing'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-container animate-fade">
              <div className="error-box glass">
                <AlertCircle size={24} />
                <p>{error}</p>
                <button className="btn-retry" onClick={handleCheck}>Try Again</button>
              </div>
            </div>
          )}

          {result && !error && (
            <div className="grammar-results animate-slide-up">
              <div className="result-main-card">
                <div className="card-label">Perfected Version</div>
                <p className="corrected-text-large">{result.corrected || "No correction needed."}</p>
                {result.corrected && (
                  <button className="btn-copy" onClick={() => navigator.clipboard.writeText(result.corrected)}>Copy Text</button>
                )}
              </div>

              {result.corrections && Array.isArray(result.corrections) && result.corrections.length > 0 && (
                <div className="corrections-grid">
                  {result.corrections.map((item, idx) => (
                    <div key={idx} className="correction-detail-card">
                      <div className="detail-header">
                        <span className="badge error"><AlertCircle size={14}/> {item.wrong}</span>
                        <ArrowRight size={16} className="arrow-icon" />
                        <span className="badge success"><CheckCircle2 size={14}/> {item.correct}</span>
                      </div>
                      <p className="explanation-text">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Grammar;
