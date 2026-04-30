import { useState, useRef } from 'react';
import { ArrowLeftRight, Mic, MicOff, Copy, Volume2, ChevronDown, ChevronUp, RefreshCw, Loader } from 'lucide-react';
import './Translator.css';

const LANGUAGES = { 'en-hi': { from: '🇬🇧 English', to: '🇮🇳 Hindi' }, 'hi-en': { from: '🇮🇳 Hindi', to: '🇬🇧 English' } };

function Translator() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [direction, setDirection] = useState('en-hi');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true); setError(null); setResult(null); setShowExplanation(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, direction })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message || 'Translation failed. Try again.'); }
    finally { setIsLoading(false); }
  };

  const toggleDirection = () => {
    setDirection(d => d === 'en-hi' ? 'hi-en' : 'en-hi');
    setResult(null); setInputText(''); setError(null);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported in this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = direction === 'en-hi' ? 'en-US' : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInputText(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const speak = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utt);
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  const { from, to } = LANGUAGES[direction];

  return (
    <div className="translator-page animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Translator</h1>
          <p>Instantly translate between English and Hindi with AI-powered explanations.</p>
        </header>

        <div className="translator-card glass">
          {/* Direction bar */}
          <div className="lang-bar">
            <span className="lang-label">{from}</span>
            <button className="btn-swap" onClick={toggleDirection} title="Swap languages">
              <ArrowLeftRight size={20} />
            </button>
            <span className="lang-label">{to}</span>
          </div>

          <div className="translator-panels">
            {/* Input panel */}
            <div className="trans-panel input-panel">
              <textarea
                className="trans-textarea"
                placeholder={`Type or speak in ${from}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={6}
              />
              <div className="panel-actions">
                <span className="char-count">{inputText.length} chars</span>
                <div className="panel-btns">
                  <button className={`btn-icon-tool ${isListening ? 'active-mic' : ''}`}
                    onClick={isListening ? stopListening : startListening}
                    title={isListening ? 'Stop' : 'Voice input'}>
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  {inputText && (
                    <button className="btn-icon-tool" onClick={() => speak(inputText, direction === 'en-hi' ? 'en' : 'hi')} title="Listen">
                      <Volume2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="panels-divider" />

            {/* Output panel */}
            <div className="trans-panel output-panel">
              {isLoading ? (
                <div className="trans-loading">
                  <Loader size={32} className="spin" />
                  <span>Translating...</span>
                </div>
              ) : error ? (
                <div className="trans-error">{error}</div>
              ) : result ? (
                <>
                  <p className="translation-text">{result.translation}</p>
                  <div className="panel-actions">
                    <button className="btn-explain" onClick={() => setShowExplanation(s => !s)}>
                      {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      Explain Translation
                    </button>
                    <div className="panel-btns">
                      <button className="btn-icon-tool" onClick={() => speak(result.translation, direction === 'en-hi' ? 'hi' : 'en')} title="Listen">
                        <Volume2 size={18} />
                      </button>
                      <button className="btn-icon-tool" onClick={() => copy(result.translation)} title="Copy">
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                  {showExplanation && result.explanation && (
                    <div className="explanation-box animate-fade">
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="trans-placeholder">
                  <ArrowLeftRight size={40} />
                  <p>Your translation will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className="translator-footer">
            <button
              className="btn-primary btn-translate"
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? <><RefreshCw size={18} className="spin" /> Translating...</> : 'Translate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Translator;
