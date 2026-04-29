import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Volume2, Plus, ArrowRight } from 'lucide-react';
import './Vocabulary.css';

function Vocabulary() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vocabulary');
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Error fetching vocab:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="vocab-page-container animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Vocabulary Builder</h1>
          <p>Expand your lexicon with 5 hand-picked words every day.</p>
          <button className="btn-refresh" onClick={fetchVocab} disabled={isLoading}>
            {isLoading ? <RefreshCw className="spin" size={20} /> : <RefreshCw size={20} />}
            <span>Get New Words</span>
          </button>
        </header>

        <div className="vocab-grid">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => <div key={i} className="skeleton-card"></div>)
          ) : (
            words.map((item, idx) => (
              <div key={idx} className="vocab-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="card-top">
                  <span className="word-type">{item.type}</span>
                  <button className="speak-btn" onClick={() => handleSpeak(item.word)}>
                    <Volume2 size={18} />
                  </button>
                </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="vocab-actions">
          <button className="btn-primary" onClick={fetchVocab} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get New Words'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;
