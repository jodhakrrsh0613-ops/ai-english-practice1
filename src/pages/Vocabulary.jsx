import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Volume2, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import './Vocabulary.css';

function Vocabulary() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vocabulary');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      let data = await response.json();

      // Handle double-encoded strings
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) {}
      }
      
      // Handle wrapped responses from AI
      const wordsArray = Array.isArray(data) ? data : (data.words || data.vocabulary || data.data || null);
      
      if (Array.isArray(wordsArray)) {
        setWords(wordsArray);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Invalid response format: expected an array of words");
      }
    } catch (error) {
      console.error("Error fetching vocab:", error);
      setError(error.message || "Failed to fetch vocabulary. Please check your connection.");
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
          {error ? (
            <div className="error-container animate-fade">
              <div className="error-box glass">
                <AlertCircle size={32} />
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button className="btn-retry" onClick={fetchVocab}>
                  <RefreshCw size={18} />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          ) : isLoading ? (
            Array(5).fill(0).map((_, i) => <div key={i} className="skeleton-card"></div>)
          ) : words && Array.isArray(words) && words.length > 0 ? (
            words.map((item, idx) => (
              <div key={idx} className="vocab-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="card-top">
                  <span className="word-type">{item.type}</span>
                  <button className="speak-btn" onClick={() => handleSpeak(item.word)}>
                    <Volume2 size={18} />
                  </button>
                </div>
                <h2 className="word-title">{item.word}</h2>
                <p className="word-meaning">{item.meaning}</p>
                <div className="word-example">
                  <span className="label">Example:</span>
                  <p>"{item.example}"</p>
                </div>
                <button className="btn-add-list">
                  <Plus size={16} />
                  <span>Add to My List</span>
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state animate-fade">
              <p>No words found for today. Try refreshing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;
