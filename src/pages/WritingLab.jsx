import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Award, TrendingUp, AlertCircle } from 'lucide-react';
import './WritingLab.css';

// ─────── WRITING EVALUATION TAB ───────
const SAMPLE_TEXTS = [
  "I goes to school every day. Yesterday I buyed a new bag and it was very costing. My teacher is very good and she learn us many things.",
  "The internet have changed our life in many way. People can now communicate with there friends who lives in different country.",
];

function WritingEvalTab() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluate = async () => {
    if (text.trim().length < 20) return;
    setIsLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message || 'Evaluation failed.'); }
    finally { setIsLoading(false); }
  };

  const getGradeColor = (score) => score >= 85 ? '#22c55e' : score >= 70 ? '#4f46e5' : score >= 55 ? '#f59e0b' : '#ef4444';
  const scoreRings = result ? [
    { label: 'Grammar', score: result.grammar_score, color: '#4f46e5' },
    { label: 'Vocabulary', score: result.vocabulary_score, color: '#22c55e' },
    { label: 'Clarity', score: result.clarity_score, color: '#f59e0b' },
  ] : [];

  return (
    <div className="tab-content animate-fade">
      <div className="writing-input-card glass">
        <div className="writing-card-header">
          <span>Write or paste your text below (minimum 20 characters)</span>
          <button className="btn-sample" onClick={() => setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)])}>
            Load Sample
          </button>
        </div>
        <textarea
          className="writing-textarea"
          placeholder="Write a paragraph, email, or any English text here and get AI feedback..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
        />
        <div className="writing-card-footer">
          <span className="char-count-label">{text.length} characters · {text.trim().split(/\s+/).filter(Boolean).length} words</span>
          <button className="btn-primary" onClick={evaluate} disabled={isLoading || text.trim().length < 20}>
            {isLoading ? <><RefreshCw size={16} className="spin" /> Evaluating...</> : '✨ Evaluate Writing'}
          </button>
        </div>
      </div>

      {error && <div className="eval-error glass"><AlertCircle size={20} /> {error}</div>}

      {result && (
        <div className="eval-results animate-slide-up">
          {/* Overall Score */}
          <div className="eval-score-card glass">
            <div className="overall-score-block">
              <div className="big-score" style={{ color: getGradeColor(result.score) }}>
                {result.score}<span className="big-score-max">/100</span>
              </div>
              <div className="grade-badge" style={{ background: getGradeColor(result.score) }}>{result.grade}</div>
            </div>
            <p className="eval-summary">{result.summary}</p>
            <div className="mini-scores">
              {scoreRings.map(s => (
                <div key={s.label} className="mini-score-item">
                  <div className="mini-score-bar">
                    <div className="mini-score-fill" style={{ width: `${s.score}%`, background: s.color }} />
                  </div>
                  <div className="mini-score-info">
                    <span className="mini-label">{s.label}</span>
                    <span className="mini-num" style={{ color: s.color }}>{s.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="eval-two-col">
            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="eval-section-card strength-card">
                <h3><CheckCircle size={18} /> Strengths</h3>
                <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="eval-section-card improve-card">
                <h3><TrendingUp size={18} /> Areas to Improve</h3>
                {result.improvements.map((imp, i) => (
                  <div key={i} className="improvement-item">
                    <p className="issue-text">❌ {imp.issue}</p>
                    <p className="suggestion-text">✅ {imp.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corrected text */}
          {result.corrected && (
            <div className="corrected-card glass">
              <h3>✏️ Corrected Version</h3>
              <p className="corrected-body">{result.corrected}</p>
              <button className="btn-copy-sm" onClick={() => navigator.clipboard.writeText(result.corrected)}>Copy</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────── SMART QUIZ TAB ───────
const QUIZ_TOPICS = ['Grammar Basics', 'Tenses', 'Articles (a/an/the)', 'Prepositions', 'Vocabulary', 'Idioms', 'Punctuation', 'Sentence Structure', 'Formal Writing', 'Common Mistakes'];

function SmartQuizTab() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async () => {
    if (!topic) return;
    setIsLoading(true); setError(null); setQuiz(null); setAnswers({}); setSubmitted(false);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.questions?.length) throw new Error('No questions returned.');
      setQuiz(data);
    } catch (err) { setError(err.message || 'Quiz generation failed.'); }
    finally { setIsLoading(false); }
  };

  const selectAnswer = (qIdx, opt) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: opt[0] }));
  };

  const submitQuiz = () => setSubmitted(true);

  const getScore = () => quiz?.questions.filter((q, i) => answers[i] === q.answer).length || 0;

  return (
    <div className="tab-content animate-fade">
      {!quiz ? (
        <div className="quiz-setup glass">
          <h3>Generate a Personalised Quiz</h3>
          <p className="quiz-setup-desc">Pick a topic and difficulty, and AI will create 5 unique questions for you.</p>
          <div className="quiz-topic-grid">
            {QUIZ_TOPICS.map(t => (
              <button key={t} className={`topic-btn ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>{t}</button>
            ))}
          </div>
          <div className="custom-topic-row">
            <input
              className="custom-topic-input"
              placeholder="Or type a custom topic..."
              value={QUIZ_TOPICS.includes(topic) ? '' : topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>
          <div className="difficulty-row">
            {['easy', 'medium', 'hard'].map(d => (
              <button key={d} className={`diff-btn ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          {error && <div className="eval-error"><AlertCircle size={16} /> {error}</div>}
          <button className="btn-primary" onClick={generateQuiz} disabled={isLoading || !topic.trim()}>
            {isLoading ? <><RefreshCw size={16} className="spin" /> Generating...</> : '🎯 Start Quiz'}
          </button>
        </div>
      ) : (
        <div className="quiz-active animate-fade">
          <div className="quiz-header-row">
            <div>
              <span className="section-badge indigo">{quiz.topic}</span>
              <p className="quiz-count">{quiz.questions.length} questions · {difficulty}</p>
            </div>
            <button className="btn-new-quiz" onClick={() => { setQuiz(null); setTopic(''); }}>New Quiz</button>
          </div>

          {submitted && (
            <div className="quiz-result-banner animate-fade" style={{ background: getScore() >= 4 ? '#f0fdf4' : getScore() >= 2 ? '#fffbeb' : '#fef2f2' }}>
              <Award size={28} />
              <div>
                <strong>Score: {getScore()}/{quiz.questions.length}</strong>
                <p>{getScore() >= 4 ? 'Excellent work! 🎉' : getScore() >= 2 ? 'Good effort! Keep practicing.' : 'Keep going — you\'ll improve! 💪'}</p>
              </div>
            </div>
          )}

          <div className="questions-list">
            {quiz.questions.map((q, qi) => (
              <div key={qi} className={`question-card ${submitted ? 'submitted' : ''}`}>
                <p className="q-text"><strong>Q{qi + 1}.</strong> {q.question}</p>
                <div className="options-list">
                  {q.options.map((opt, oi) => {
                    const letter = opt[0];
                    const isSelected = answers[qi] === letter;
                    const isCorrect = letter === q.answer;
                    let cls = 'option-btn';
                    if (submitted) {
                      if (isCorrect) cls += ' correct';
                      else if (isSelected && !isCorrect) cls += ' wrong';
                    } else if (isSelected) cls += ' selected';
                    return (
                      <button key={oi} className={cls} onClick={() => selectAnswer(qi, opt)}>
                        {submitted && isCorrect && <CheckCircle size={16} />}
                        {submitted && isSelected && !isCorrect && <XCircle size={16} />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className="explanation-pill animate-fade">
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted && (
            <button
              className="btn-primary"
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < quiz.questions.length}
            >
              Submit Answers ({Object.keys(answers).length}/{quiz.questions.length} answered)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────── MAIN PAGE ───────
const TABS = [
  { id: 'writing', label: '📝 Writing Evaluation' },
  { id: 'quiz', label: '🧪 Smart Quiz' },
];

function WritingLab() {
  const [activeTab, setActiveTab] = useState('writing');
  return (
    <div className="writing-lab-page animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Writing Lab</h1>
          <p>Evaluate your English writing and test your knowledge with AI-powered quizzes.</p>
        </header>
        <div className="hub-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`hub-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="hub-body">
          {activeTab === 'writing' && <WritingEvalTab />}
          {activeTab === 'quiz' && <SmartQuizTab />}
        </div>
      </div>
    </div>
  );
}

export default WritingLab;
