import { Link } from 'react-router-dom';
import { MessageCircle, CheckCircle, BookOpen, Mic, TrendingUp } from 'lucide-react';
import './Home.css';

function Home() {
  const features = [
    {
      title: "AI Chat Practice",
      desc: "Converse naturally with a smart AI tutor that understands you.",
      icon: <MessageCircle className="feat-icon" />,
      link: "/chat"
    },
    {
      title: "Speaking Practice",
      desc: "Improve pronunciation and fluency with real-time feedback.",
      icon: <Mic className="feat-icon" />,
      link: "/speaking"
    },
    {
      title: "Grammar Checker",
      desc: "Instantly correct mistakes and learn the rules.",
      icon: <CheckCircle className="feat-icon" />,
      link: "/grammar"
    },
    {
      title: "Vocabulary Builder",
      desc: "Learn new words daily with meanings and examples.",
      icon: <BookOpen className="feat-icon" />,
      link: "/vocabulary"
    },
    {
      title: "Progress Dashboard",
      desc: "Track your daily streaks, accuracy, and learning time.",
      icon: <TrendingUp className="feat-icon" />,
      link: "/dashboard"
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Improve Your English with AI</h1>
          <p>Practice speaking, writing & grammar with a smart, 24/7 AI tutor designed to make learning engaging and effective.</p>
          <div className="hero-buttons">
            <Link to="/chat" className="btn-primary">Start Practice</Link>
            <Link to="/topics" className="btn-secondary">Explore Topics</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need to master English</h2>
        <div className="features-grid">
          {features.map((feat, idx) => (
            <Link to={feat.link} key={idx} className="feature-card">
              <div className="icon-wrapper">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
