import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="page-container auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to continue your learning journey' : 'Join SpeakPro AI today'}</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button className="btn-primary auth-submit">
            {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
