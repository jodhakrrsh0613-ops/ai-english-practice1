import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const update = (key, val) => { setForm(prev => ({ ...prev, [key]: val })); setError(''); };

  const validate = () => {
    if (!form.email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.password) return 'Please enter your password.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin && !form.name.trim()) return 'Please enter your full name.';
    if (!isLogin && form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // small delay for UX
    const result = isLogin
      ? login(form.email, form.password)
      : signup(form.name, form.email, form.password);
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-page-container animate-fade">
      {/* Background blobs */}
      <div className="auth-bg-blob blob1" />
      <div className="auth-bg-blob blob2" />

      <div className="auth-wrapper">
        {/* Left panel — branding */}
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <Sparkles size={36} />
            <span>SpeakPro AI</span>
          </div>
          <h2 className="auth-brand-tagline">
            Your AI-Powered English Learning Platform
          </h2>
          <p className="auth-brand-desc">
            Practice speaking, fix grammar, build vocabulary, and master English — all in one place.
          </p>
          <div className="auth-brand-features">
            {['AI Conversation Practice', 'Grammar Checker', 'Smart Vocabulary', 'Daily Challenges', 'Writing Evaluator', 'Role-play Scenarios'].map(f => (
              <div key={f} className="auth-feature-item">
                <CheckCircle size={16} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-form-panel">
          <div className="auth-card glass animate-slide-up">
            <div className="auth-header">
              <div className="auth-mode-tabs">
                <button className={`mode-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); setForm({ name: '', email: '', password: '' }); }}>
                  Sign In
                </button>
                <button className={`mode-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); setForm({ name: '', email: '', password: '' }); }}>
                  Sign Up
                </button>
              </div>
              <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
              <p>{isLogin ? 'Sign in to continue your learning journey.' : 'Join and start mastering English with AI today.'}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Name field — signup only */}
              {!isLogin && (
                <div className="form-group animate-fade">
                  <label htmlFor="auth-name">Full Name</label>
                  <div className={`input-with-icon ${form.name ? 'has-value' : ''}`}>
                    <User size={18} />
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <div className={`input-with-icon ${form.email ? 'has-value' : ''}`}>
                  <Mail size={18} />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <div className={`input-with-icon ${form.password ? 'has-value' : ''}`}>
                  <Lock size={18} />
                  <input
                    id="auth-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button type="button" className="btn-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="password-hint">Use at least 6 characters with letters and numbers.</p>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="auth-error animate-fade">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <><span className="btn-loader" /> {isLogin ? 'Signing In...' : 'Creating Account...'}</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button className="btn-text" onClick={switchMode}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
