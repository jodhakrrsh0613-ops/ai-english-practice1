import { Link } from 'react-router-dom';
import { MessageSquare, Mic, BookOpen, Search, BarChart3, ArrowRight } from 'lucide-react';
import ShaderBackground from '../components/ui/shader-background';
import './Home.css';

function Home() {
  const features = [
    {
      title: "AI Chat Tutor",
      desc: "Practice natural conversations with real-time feedback and corrections.",
      icon: <MessageSquare size={32} />,
      link: "/chat",
      color: "indigo"
    },
    {
      title: "Grammar Checker",
      desc: "Deep-dive into your writing and fix subtle mistakes with AI analysis.",
      icon: <Search size={32} />,
      link: "/grammar",
      color: "green"
    },
    {
      title: "Vocabulary Builder",
      desc: "Learn high-impact words daily with pronunciation and usage examples.",
      icon: <BookOpen size={32} />,
      link: "/vocabulary",
      color: "amber"
    },
    {
      title: "Performance Dashboard",
      desc: "Track your progress, streaks, and accuracy over time.",
      icon: <BarChart3 size={32} />,
      link: "/dashboard",
      color: "indigo"
    }
  ];

  return (
    <div className="home-page animate-fade relative overflow-hidden">
      <ShaderBackground />

      <div className="relative z-10">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title animate-slide-up">
              Master English with <span className="text-gradient">SpeakPro AI</span>
            </h1>
            <p className="hero-subtitle animate-slide-up">
              Your personalized AI language tutor. Practice speaking, writing, and grammar with the power of advanced intelligence.
            </p>
            <div className="hero-actions animate-slide-up">
              <Link to="/chat" className="btn-primary lg">Start Learning Now</Link>
              <Link to="/grammar" className="btn-secondary lg">Try Grammar Tool</Link>
            </div>
          </div>
          <div className="hero-visual-scene animate-fade">
            <img src="/images/ai-agent-v2.png" alt="AI Agent Professional" className="hero-main-image" />
          </div>
        </section>

        <section className="features-section section-container">
          <div className="section-header">
            <h2 className="section-title">Everything you need to be fluent</h2>
            <p className="section-subtitle">Powerful tools designed to accelerate your English learning journey.</p>
          </div>
          
          <div className="features-grid">
            {features.map((f, idx) => (
              <Link to={f.link} key={idx} className={`feature-card ${f.color}`}>
                <div className="feature-icon-wrapper">
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-link">
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
