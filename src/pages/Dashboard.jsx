import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Flame, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Mic, 
  Users, 
  Target,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const DATA = [
  { day: 'MON', minutes: 20 },
  { day: 'TUE', minutes: 45 },
  { day: 'WED', minutes: 30 },
  { day: 'THU', minutes: 65 },
  { day: 'FRI', minutes: 25 },
  { day: 'SAT', minutes: 40 },
  { day: 'SUN', minutes: 15 },
];

const RECOMMENDED = [
  {
    id: 1,
    title: 'Advanced Negotiations',
    desc: 'Master the art of high-stakes English negotiation and persuasion in...',
    tag: 'BUSINESS',
    time: '15m',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Networking Etiquette',
    desc: 'Learn subtle linguistic cues to navigate professional social circles...',
    tag: 'SOCIAL',
    time: '12m',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400',
    color: 'purple'
  },
  {
    id: 3,
    title: 'Technical Storytelling',
    desc: 'Translate complex data into compelling narratives for stakeholde...',
    tag: 'TECH',
    time: '20m',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=400',
    color: 'cyan'
  }
];

const ACTIVITY = [
  { id: 1, type: 'mic', label: "Completed 'Pronunciation Drill'", detail: 'Phonetics Masterclass • 2 hours ago', xp: '+250 XP', score: '98%' },
  { id: 2, type: 'feedback', label: 'AI Feedback Session', detail: 'Vocabulary Retention • Yesterday', xp: '+120 XP', score: '84%' },
  { id: 3, type: 'badge', label: "Unlocked 'Fluent Negotiator' Badge", detail: 'Milestone achieved • 2 days ago', xp: '+1,000 XP', level: 'LEVEL UP' },
];

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-v2 animate-fade">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Alex'}.</h1>
        <p>Your progress is at an all-time high. Ready to reach C1?</p>
      </header>

      <div className="dashboard-grid">
        <div className="main-stats-card glass">
          <div className="card-header">
            <h3>Daily Progress</h3>
            <span className="time-range">Last 7 Days</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={DATA}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#111229', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]} barSize={40}>
                  {DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#7c3aed' : 'rgba(124, 58, 237, 0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="side-stats">
          <div className="small-stat-card glass">
            <div className="stat-content">
              <span className="stat-label">STREAK</span>
              <h2 className="stat-value">12 Days</h2>
            </div>
            <div className="stat-icon circle purple">
              <Flame size={20} fill="currentColor" />
            </div>
          </div>

          <div className="small-stat-card glass">
            <div className="stat-content">
              <span className="stat-label">VOCABULARY</span>
              <h2 className="stat-value">1,402</h2>
            </div>
            <div className="stat-icon circle indigo">
              <BookOpen size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-title-row">
          <h2>Recommended Lessons</h2>
          <Link to="/lessons" className="view-all">View All Lessons</Link>
        </div>
        <div className="lessons-grid">
          {RECOMMENDED.map(lesson => (
            <div key={lesson.id} className="lesson-card glass">
              <div className="lesson-image" style={{ backgroundImage: `url(${lesson.image})` }}>
                <span className={`lesson-tag ${lesson.color}`}>{lesson.tag}</span>
              </div>
              <div className="lesson-info">
                <h3>{lesson.title}</h3>
                <p>{lesson.desc}</p>
                <div className="lesson-footer">
                  <div className="lesson-meta">
                    <Clock size={14} /> <span>{lesson.time}</span>
                    <span className="separator">•</span>
                    <span>⭐ {lesson.rating}</span>
                  </div>
                  <button className="lesson-arrow"><ArrowRight size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-list glass">
          {ACTIVITY.map(item => (
            <div key={item.id} className="activity-item">
              <div className="activity-icon-wrapper">
                {item.type === 'mic' && <Mic size={18} />}
                {item.type === 'feedback' && <Users size={18} />}
                {item.type === 'badge' && <Target size={18} />}
              </div>
              <div className="activity-main">
                <h4>{item.label}</h4>
                <p>{item.detail}</p>
              </div>
              <div className="activity-stats">
                <span className="xp-gain">{item.xp}</span>
                <span className="score-val">{item.score || item.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
