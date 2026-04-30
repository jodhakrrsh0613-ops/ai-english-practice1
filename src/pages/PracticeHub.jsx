import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, CheckCircle, XCircle, AlertCircle, Send, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './PracticeHub.css';

// ─────── PRONUNCIATION TAB ───────
const PRACTICE_SENTENCES = [
  "The weather is beautiful today.",
  "I would like to schedule a meeting.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck?",
  "Please speak slowly and clearly.",
  "I am working hard to improve my English.",
  "Can you help me find the nearest hospital?",
  "I enjoy reading books in my free time.",
];

function PronunciationTab() {
  const [targetSentence, setTargetSentence] = useState(PRACTICE_SENTENCES[0]);
  const [spokenText, setSpokenText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const recognitionRef = useRef(null);

  const randomSentence = () => {
    const s = PRACTICE_SENTENCES[Math.floor(Math.random() * PRACTICE_SENTENCES.length)];
    setTargetSentence(s); setSpokenText(''); setResult(null);
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US'; utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => { setSpokenText(e.results[0][0].transcript); setResult(null); };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const evaluate = async () => {
    if (!spokenText) return;
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/pronunciation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spokenText, targetText: targetSentence })
      });
      const data = await res.json();
      setResult(data);
    } catch { setResult({ score: 0, overall_feedback: 'Evaluation failed. Please try again.', words: [] }); }
    finally { setIsEvaluating(false); }
  };

  const scoreColor = result ? (result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#f59e0b' : '#ef4444') : '#4f46e5';

  return (
    <div className="tab-content animate-fade">
      <div className="practice-sentence-card glass">
        <div className="sentence-header">
          <span className="section-badge indigo">Target Sentence</span>
          <div className="sentence-actions">
            <button className="btn-icon-sm" onClick={() => speak(targetSentence)} title="Listen"><Volume2 size={16} /></button>
            <button className="btn-icon-sm" onClick={randomSentence} title="New sentence"><RefreshCw size={16} /></button>
          </div>
        </div>
        <p className="target-sentence">{targetSentence}</p>
      </div>

      <div className="mic-zone">
        <button
          className={`btn-big-mic ${isListening ? 'listening' : ''}`}
          onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : startListening}
        >
          {isListening ? <MicOff size={36} /> : <Mic size={36} />}
        </button>
        <p className="mic-label">{isListening ? '🔴 Listening... speak now' : 'Tap to speak'}</p>
      </div>

      {spokenText && (
        <div className="spoken-box animate-fade">
          <span className="section-badge green">You said</span>
          <p className="spoken-text">"{spokenText}"</p>
          <button className="btn-primary btn-sm" onClick={evaluate} disabled={isEvaluating}>
            {isEvaluating ? <><RefreshCw size={16} className="spin" /> Evaluating...</> : 'Evaluate Pronunciation'}
          </button>
        </div>
      )}

      {result && (
        <div className="result-card glass animate-slide-up">
          <div className="score-circle" style={{ '--score-color': scoreColor }}>
            <span className="score-num">{result.score}</span>
            <span className="score-label">/ 100</span>
          </div>
          <p className="overall-feedback">{result.overall_feedback}</p>
          {result.words && result.words.length > 0 && (
            <div className="words-analysis">
              {result.words.map((w, i) => (
                <div key={i} className={`word-chip ${w.status}`}>
                  {w.status === 'correct' ? <CheckCircle size={14} /> : w.status === 'close' ? <AlertCircle size={14} /> : <XCircle size={14} />}
                  <span>{w.word}</span>
                  {w.tip && <div className="word-tip">{w.tip}</div>}
                </div>
              ))}
            </div>
          )}
          {result.practice_tip && (
            <div className="practice-tip-box">
              💡 <strong>Tip:</strong> {result.practice_tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────── ROLEPLAY TAB ───────
const ROLES = [
  { id: 'interviewer', label: '💼 Job Interviewer', desc: 'Practice for your next job interview', system: 'You are a professional job interviewer conducting a formal interview. Ask relevant interview questions one at a time, give brief feedback on answers, and keep the conversation flowing naturally. Respond as JSON: {"reply":"...","correction":null,"explanation":null}' },
  { id: 'friend', label: '😊 English Friend', desc: 'Casual conversation practice', system: 'You are a friendly English-speaking friend having a casual conversation. Use everyday language, ask follow-up questions, share opinions, and gently correct major English mistakes. Respond as JSON: {"reply":"...","correction":null,"explanation":null}' },
  { id: 'customer', label: '🛒 Customer Support', desc: 'Practice professional communication', system: 'You are a customer support representative. Handle queries professionally, ask for details, and resolve issues politely. Help the user practice formal customer interaction English. Respond as JSON: {"reply":"...","correction":null,"explanation":null}' },
  { id: 'teacher', label: '📚 English Teacher', desc: 'Structured English lessons', system: 'You are an encouraging English teacher giving a conversational lesson. Teach grammar points naturally through conversation, ask practice questions, and celebrate progress. Respond as JSON: {"reply":"...","correction":null,"explanation":null}' },
];

function RoleplayTab() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startRole = (role) => {
    setSelectedRole(role);
    setMessages([{ role: 'model', content: JSON.stringify({ reply: `Great! I'm your ${role.label}. Let's begin! How can I help you today?`, correction: null, explanation: null }) }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[ROLEPLAY SYSTEM: ${selectedRole.system}]\n\nUser: ${input}`, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify(data) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: JSON.stringify({ reply: 'Connection error. Please try again.', correction: null, explanation: null }) }]);
    }
    setIsTyping(false);
  };

  if (!selectedRole) {
    return (
      <div className="tab-content animate-fade">
        <p className="tab-intro">Choose a roleplay scenario to practice real-life English conversations:</p>
        <div className="roles-grid">
          {ROLES.map(role => (
            <button key={role.id} className="role-card glass" onClick={() => startRole(role)}>
              <span className="role-icon-label">{role.label}</span>
              <p className="role-desc">{role.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content roleplay-active animate-fade">
      <div className="roleplay-header">
        <span className="section-badge indigo">{selectedRole.label}</span>
        <button className="btn-change-role" onClick={() => setSelectedRole(null)}>Change Role</button>
      </div>
      <div className="roleplay-messages">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          let parsed = {};
          if (!isUser) { try { parsed = JSON.parse(msg.content); } catch { parsed = { reply: msg.content }; } }
          return (
            <div key={i} className={`rp-msg ${isUser ? 'rp-user' : 'rp-ai'}`}>
              <div className="rp-bubble">{isUser ? msg.content : parsed.reply}</div>
              {!isUser && parsed.correction && (
                <div className="rp-correction">✏️ <strong>Correction:</strong> {parsed.correction}</div>
              )}
            </div>
          );
        })}
        {isTyping && <div className="rp-msg rp-ai"><div className="rp-bubble typing-dots"><span /><span /><span /></div></div>}
      </div>
      <div className="roleplay-input-row">
        <input
          className="rp-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your response..."
        />
        <button className="btn-send-rp" onClick={sendMessage} disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ─────── READING TAB ───────
const READING_PASSAGES = [
  { title: "Morning Routine", text: "Every morning, Sarah wakes up at seven o'clock. She brushes her teeth, washes her face, and gets dressed for work. Before leaving the house, she makes a cup of coffee and reads the news on her phone. She believes that a good morning routine sets a positive tone for the rest of the day." },
  { title: "The Library", text: "The local library is a wonderful place to spend time. It has thousands of books on every subject imaginable. There are comfortable chairs near the windows where people can sit and read quietly. Children often come after school to study or borrow books. The library is free and open to everyone in the community." },
  { title: "Learning a New Skill", text: "Learning a new skill takes time and patience. When you first start, things may feel difficult and confusing. But with regular practice, you begin to improve. Many successful people say that making mistakes is an important part of learning. The key is to never give up and to keep trying every day." },
];

function ReadingTab() {
  const [passage, setPassage] = useState(READING_PASSAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [score, setScore] = useState(null);
  const recognitionRef = useRef(null);

  const nextPassage = () => {
    const next = READING_PASSAGES[Math.floor(Math.random() * READING_PASSAGES.length)];
    setPassage(next); setSpokenText(''); setScore(null);
  };

  const listenPassage = () => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(passage.text);
    utt.lang = 'en-US'; utt.rate = 0.8;
    window.speechSynthesis.speak(utt);
  };

  const startReading = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = false;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      setSpokenText(transcript);
    };
    rec.onend = () => { setIsListening(false); if (spokenText) calcScore(); };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopReading = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const calcScore = () => {
    if (!spokenText) return;
    const target = passage.text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const spoken = spokenText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const matched = spoken.filter(w => target.includes(w)).length;
    const sc = Math.min(100, Math.round((matched / target.length) * 130));
    setScore(sc);
  };

  return (
    <div className="tab-content animate-fade">
      <div className="reading-card glass">
        <div className="reading-header">
          <div>
            <span className="section-badge green">Reading Practice</span>
            <h3 className="passage-title">{passage.title}</h3>
          </div>
          <div className="reading-btns">
            <button className="btn-icon-sm" onClick={listenPassage} title="Listen to passage"><Volume2 size={16} /></button>
            <button className="btn-icon-sm" onClick={nextPassage} title="New passage"><RefreshCw size={16} /></button>
          </div>
        </div>
        <p className="passage-text">{passage.text}</p>
      </div>

      <div className="mic-zone">
        <button
          className={`btn-big-mic ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopReading : startReading}
        >
          {isListening ? <MicOff size={36} /> : <Mic size={36} />}
        </button>
        <p className="mic-label">{isListening ? '🔴 Recording... tap to stop' : 'Tap to start reading aloud'}</p>
      </div>

      {!isListening && spokenText && (
        <div className="spoken-box animate-fade">
          <span className="section-badge amber">You read</span>
          <p className="spoken-text">"{spokenText}"</p>
          <button className="btn-primary btn-sm" onClick={calcScore}>Get Fluency Score</button>
        </div>
      )}

      {score !== null && (
        <div className="fluency-result glass animate-slide-up">
          <div className="fluency-score-row">
            <span>Fluency Score</span>
            <span className="fluency-num" style={{ color: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444' }}>
              {score}/100
            </span>
          </div>
          <div className="fluency-bar"><div className="fluency-fill" style={{ width: `${score}%`, background: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444' }} /></div>
          <p className="fluency-msg">
            {score >= 85 ? '🎉 Excellent! Keep it up!' : score >= 65 ? '👍 Good effort! Practice more.' : '💪 Keep practicing — you\'ll improve!'}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────── MAIN HUB ───────
const TABS = [
  { id: 'pronunciation', label: '🗣️ Pronunciation' },
  { id: 'roleplay', label: '🎭 Roleplay' },
  { id: 'reading', label: '📖 Reading' },
];

function PracticeHub() {
  const [activeTab, setActiveTab] = useState('pronunciation');
  return (
    <div className="practice-hub-page animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Practice Lab</h1>
          <p>Speak, roleplay, and read your way to English fluency.</p>
        </header>
        <div className="hub-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`hub-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="hub-body">
          {activeTab === 'pronunciation' && <PronunciationTab />}
          {activeTab === 'roleplay' && <RoleplayTab />}
          {activeTab === 'reading' && <ReadingTab />}
        </div>
      </div>
    </div>
  );
}

export default PracticeHub;
