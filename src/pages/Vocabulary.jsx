import { useState, useEffect } from 'react';
import { Volume2, BookOpen, RefreshCw } from 'lucide-react';
import './Vocabulary.css';

function Vocabulary() {
  const [dailyWords, setDailyWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vocabulary');
      const data = await response.json();
      setDailyWords(data);
    } catch (error) {
      console.error("Vocab fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="page-container vocab-page">
      <header className="page-header">
        <div className="header-title">
          <h1>Vocabulary Builder <BookOpen size={24} style={{ display: 'inline', marginLeft: 8, color: 'var(--primary)' }}/></h1>
          <p>Learn 5 new words today to enhance your vocabulary.</p>
        </div>
      </header>

      <div className="vocab-content">
        {isLoading ? (
          <div className="loading-box">
            <RefreshCw className="spin" size={40} />
            <p>Generating your daily words...</p>
          </div>
        ) : (
          <div className="words-grid">
            {dailyWords.map((item, idx) => (
              <div key={idx} className="word-card">
                <div className="word-header">
                  <div className="word-title-group">
                    <h2>{item.word}</h2>
                    <span className="word-type">{item.type}</span>
                  </div>
                  <button className="btn-icon" onClick={() => handleSpeak(item.word)} title="Listen">
                    <Volume2 size={20} />
                  </button>
                </div>
                <div className="word-body">
                  <p className="word-meaning"><strong>Meaning:</strong> {item.meaning}</p>
                  <div className="word-example-box">
                    <p><em>"{item.example}"</em></p>
                    <button className="btn-icon-small" onClick={() => handleSpeak(item.example)} title="Listen to example">
                      <Volume2 size={14} />
                    </button>
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
