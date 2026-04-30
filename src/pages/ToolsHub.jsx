import { useState } from 'react';
import { RefreshCw, Copy, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import './ToolsHub.css';

// ─────── SENTENCE REWRITER ───────
const REWRITE_MODES = [
  { id: 'formal', label: '👔 Informal → Formal', desc: 'Make it professional' },
  { id: 'advanced', label: '🚀 Simple → Advanced', desc: 'Elevate the language' },
  { id: 'simple', label: '✂️ Complex → Simple', desc: 'Make it easy to read' },
];

function SentenceRewriterTab() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('formal');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const rewrite = async () => {
    if (!text.trim()) return;
    setIsLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message || 'Rewrite failed.'); }
    finally { setIsLoading(false); }
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="tab-content animate-fade">
      <div className="mode-selector">
        {REWRITE_MODES.map(m => (
          <button key={m.id} className={`mode-card ${mode === m.id ? 'active' : ''}`} onClick={() => { setMode(m.id); setResult(null); }}>
            <span className="mode-title">{m.label}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </div>

      <div className="rewrite-input-card glass">
        <textarea
          className="rewrite-textarea"
          placeholder="Type or paste your sentence here..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
        />
        <div className="rewrite-footer">
          <span className="char-count-sm">{text.length} chars</span>
          <button className="btn-primary" onClick={rewrite} disabled={isLoading || !text.trim()}>
            {isLoading ? <><RefreshCw size={16} className="spin" /> Rewriting...</> : 'Rewrite ✨'}
          </button>
        </div>
      </div>

      {error && <div className="tools-error"><AlertCircle size={16} /> {error}</div>}

      {result?.suggestions?.length > 0 && (
        <div className="suggestions-list animate-slide-up">
          <p className="suggestions-title">3 Suggestions</p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="suggestion-card glass">
              <div className="suggestion-num">#{i + 1}</div>
              <div className="suggestion-body">
                <p className="suggestion-text">{s.text}</p>
                <p className="suggestion-note">💡 {s.note}</p>
              </div>
              <button className="btn-copy-icon" onClick={() => copyText(s.text, i)} title="Copy">
                {copied === i ? <CheckCircle size={16} color="#22c55e" /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────── EMAIL GENERATOR ───────
const EMAIL_TYPES = [
  { id: 'formal', label: '📧 Formal Email', fields: ['To', 'From', 'Subject', 'Purpose of email', 'Additional details'] },
  { id: 'leave', label: '🏖️ Leave Application', fields: ['Your name', 'Manager name', 'Reason for leave', 'Leave dates', 'Department'] },
  { id: 'job', label: '💼 Job Application', fields: ['Your name', 'Job title applying for', 'Company name', 'Your experience (years)', 'Key skills'] },
  { id: 'apology', label: '🙏 Apology Email', fields: ['Your name', 'Recipient name', 'What happened', 'How you will fix it'] },
  { id: 'complaint', label: '😤 Complaint Email', fields: ['Your name', 'Company/person complained to', 'Issue description', 'What resolution you want'] },
];

function EmailGeneratorTab() {
  const [emailType, setEmailType] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectType = (type) => { setEmailType(type); setFieldValues({}); setResult(null); setError(null); };

  const generateEmail = async () => {
    if (!emailType) return;
    const details = fieldValues;
    setIsLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: emailType.id, details })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message || 'Email generation failed.'); }
    finally { setIsLoading(false); }
  };

  if (!emailType) return (
    <div className="tab-content animate-fade">
      <p className="tab-intro-text">Choose the type of email you want to generate:</p>
      <div className="email-type-grid">
        {EMAIL_TYPES.map(t => (
          <button key={t.id} className="email-type-card glass" onClick={() => selectType(t)}>
            <span className="email-type-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tab-content animate-fade">
      <div className="email-type-header">
        <span className="section-badge-plain">{emailType.label}</span>
        <button className="btn-back-sm" onClick={() => { setEmailType(null); setResult(null); }}>← Change Type</button>
      </div>

      {!result ? (
        <div className="email-form glass">
          {emailType.fields.map(field => (
            <div key={field} className="email-field">
              <label className="email-label">{field}</label>
              <input
                className="email-input"
                placeholder={`Enter ${field.toLowerCase()}...`}
                value={fieldValues[field] || ''}
                onChange={e => setFieldValues(prev => ({ ...prev, [field]: e.target.value }))}
              />
            </div>
          ))}
          {error && <div className="tools-error"><AlertCircle size={16} /> {error}</div>}
          <button className="btn-primary" onClick={generateEmail} disabled={isLoading}>
            {isLoading ? <><RefreshCw size={16} className="spin" /> Generating...</> : '✉️ Generate Email'}
          </button>
        </div>
      ) : (
        <div className="email-result animate-slide-up">
          <div className="email-preview glass">
            <div className="email-preview-header">
              <div className="email-field-row"><span className="field-name">Subject:</span><span>{result.subject}</span></div>
            </div>
            <div className="email-body-preview">
              {result.body.split('\n').map((line, i) => <p key={i}>{line || <br />}</p>)}
            </div>
            <div className="email-preview-footer">
              <button className="btn-copy-sm" onClick={() => navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`)}>
                <Copy size={14} /> Copy Email
              </button>
              <button className="btn-regen" onClick={() => setResult(null)}>Regenerate</button>
            </div>
          </div>
          {result.tips?.length > 0 && (
            <div className="email-tips">
              <h4>💡 Writing Tips</h4>
              {result.tips.map((tip, i) => <div key={i} className="tip-row"><CheckCircle size={14} />{tip}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────── RESUME BUILDER ───────
const RESUME_STEPS = ['Personal Info', 'Experience', 'Education', 'Skills'];

function ResumeBuilderTab() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', email: '', phone: '', location: '',
    experience: '', jobTitle: '', company: '',
    education: '', university: '', year: '',
    skills: '', languages: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const generateResume = async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: data })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      setResult(resData);
    } catch (err) { setError(err.message || 'Resume generation failed.'); }
    finally { setIsLoading(false); }
  };

  const stepForms = [
    <div key="personal" className="resume-step">
      {[['Full Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Location/City', 'location']].map(([label, key]) => (
        <div key={key} className="resume-field">
          <label>{label}</label>
          <input value={data[key]} onChange={e => update(key, e.target.value)} placeholder={`Enter your ${label.toLowerCase()}...`} className="resume-input" />
        </div>
      ))}
    </div>,
    <div key="exp" className="resume-step">
      {[['Job Title', 'jobTitle'], ['Company', 'company'], ['Experience Summary', 'experience']].map(([label, key]) => (
        <div key={key} className="resume-field">
          <label>{label}</label>
          {key === 'experience'
            ? <textarea value={data[key]} onChange={e => update(key, e.target.value)} placeholder="Describe your work experience, responsibilities, achievements..." className="resume-textarea" rows={5} />
            : <input value={data[key]} onChange={e => update(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} className="resume-input" />
          }
        </div>
      ))}
    </div>,
    <div key="edu" className="resume-step">
      {[['Degree / Qualification', 'education'], ['University / School', 'university'], ['Graduation Year', 'year']].map(([label, key]) => (
        <div key={key} className="resume-field">
          <label>{label}</label>
          <input value={data[key]} onChange={e => update(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} className="resume-input" />
        </div>
      ))}
    </div>,
    <div key="skills" className="resume-step">
      {[['Technical Skills', 'skills'], ['Languages Known', 'languages']].map(([label, key]) => (
        <div key={key} className="resume-field">
          <label>{label}</label>
          <input value={data[key]} onChange={e => update(key, e.target.value)} placeholder="e.g. JavaScript, Python, MS Office..." className="resume-input" />
        </div>
      ))}
    </div>
  ];

  if (result) return (
    <div className="tab-content animate-fade">
      <div className="resume-result glass">
        {Object.entries(result.sections).map(([sec, content]) => (
          <div key={sec} className="resume-section">
            <h4 className="resume-sec-title">{sec.charAt(0).toUpperCase() + sec.slice(1)}</h4>
            <div className="resume-sec-body">
              {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        ))}
        <div className="resume-result-footer">
          <button className="btn-primary" onClick={() => navigator.clipboard.writeText(Object.values(result.sections).join('\n\n'))}>
            <Copy size={16} /> Copy Resume
          </button>
          <button className="btn-back-sm" onClick={() => { setResult(null); setStep(0); }}>Edit</button>
        </div>
        {result.tips?.length > 0 && (
          <div className="email-tips" style={{ marginTop: 16 }}>
            <h4>💡 Resume Tips</h4>
            {result.tips.map((tip, i) => <div key={i} className="tip-row"><CheckCircle size={14} />{tip}</div>)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="tab-content animate-fade">
      <div className="resume-steps-bar">
        {RESUME_STEPS.map((s, i) => (
          <div key={s} className={`resume-step-dot ${i <= step ? 'active' : ''}`}>
            <div className="dot-circle">{i < step ? '✓' : i + 1}</div>
            <span className="dot-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="resume-form-card glass">
        <h3 className="step-title">{RESUME_STEPS[step]}</h3>
        {stepForms[step]}
        {error && <div className="tools-error"><AlertCircle size={16} /> {error}</div>}
        <div className="step-nav">
          {step > 0 && <button className="btn-back-sm" onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < RESUME_STEPS.length - 1
            ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="btn-primary" onClick={generateResume} disabled={isLoading}>
                {isLoading ? <><RefreshCw size={16} className="spin" /> Building...</> : '📄 Generate Resume'}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ─────── MAIN PAGE ───────
const TABS = [
  { id: 'rewriter', label: '🧠 Sentence Rewriter' },
  { id: 'email', label: '📧 Email Generator' },
  { id: 'resume', label: '🧾 Resume Builder' },
];

function ToolsHub() {
  const [activeTab, setActiveTab] = useState('rewriter');
  return (
    <div className="tools-hub-page animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Tools Hub</h1>
          <p>Powerful AI tools to help you write better English in every situation.</p>
        </header>
        <div className="hub-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`hub-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="hub-body">
          {activeTab === 'rewriter' && <SentenceRewriterTab />}
          {activeTab === 'email' && <EmailGeneratorTab />}
          {activeTab === 'resume' && <ResumeBuilderTab />}
        </div>
      </div>
    </div>
  );
}

export default ToolsHub;
