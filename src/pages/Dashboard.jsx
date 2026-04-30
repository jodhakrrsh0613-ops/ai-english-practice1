import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Target, Clock, Award, TrendingUp, CheckCircle, Star, Zap } from 'lucide-react';
import './Dashboard.css';

// ─── Streak & Challenge helpers ───
const STREAK_KEY = 'speakpro_streak';
const CHALLENGE_KEY = 'speakpro_challenges';

const todayStr = () => new Date().toISOString().split('T')[0];

const loadStreak = () => {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: null, history: [] }; }
  catch { return { count: 0, lastDate: null, history: [] }; }
};

const updateStreak = () => {
  const streak = loadStreak();
  const today = todayStr();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  const newCount = streak.lastDate === yStr ? streak.count + 1 : 1;
  const history = [...(streak.history || []).slice(-6), today];
  const updated = { count: newCount, lastDate: today, history };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
};

const loadChallenges = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CHALLENGE_KEY));
    if (stored?.date === todayStr()) return stored;
    // Reset for new day
    const fresh = {
      date: todayStr(),
      tasks: [
        { id: 'vocab', label: '📚 Learn 5 New Words', page: '/vocabulary', done: false },
        { id: 'grammar', label: '✅ Check Your Grammar', page: '/grammar', done: false },
        { id: 'quiz', label: '🧪 Complete a Quiz', page: '/writing', done: false },
        { id: 'chat', label: '💬 Chat with AI Tutor', page: '/chat', done: false },
        { id: 'translate', label: '🌐 Try the Translator', page: '/translator', done: false },
      ]
    };
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return { date: todayStr(), tasks: [] };
  }
};

const getLast7Days = (history) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const str = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push({ date: str, label, active: (history || []).includes(str) });
  }
  return days;
};

function Dashboard() {
  const [streak, setStreak] = useState({ count: 0, lastDate: null, history: [] });
  const [challenges, setChallenges] = useState({ tasks: [] });

  useEffect(() => {
    setStreak(updateStreak());
    setChallenges(loadChallenges());
  }, []);

  const markDone = (taskId) => {
    const updated = { ...challenges, tasks: challenges.tasks.map(t => t.id === taskId ? { ...t, done: true } : t) };
    setChallenges(updated);
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(updated));
  };

  const completedCount = challenges.tasks.filter(t => t.done).length;
  const totalTasks = challenges.tasks.length;
  const progressPct = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;
  const last7 = getLast7Days(streak.history);

  const data = [
    { day: 'Mon', minutes: 20 }, { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 30 }, { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 25 }, { day: 'Sat', minutes: 40 }, { day: 'Sun', minutes: 50 },
  ];

  const statCards = [
    { title: "Current Streak", value: `${streak.count} Days`, icon: <Flame size={24} />, color: "orange" },
    { title: "Today's Progress", value: `${completedCount}/${totalTasks}`, icon: <Target size={24} />, color: "green" },
    { title: "Challenges Done", value: `${progressPct}%`, icon: <Star size={24} />, color: "indigo" },
    { title: "Best Streak", value: `${Math.max(streak.count, 1)} Days`, icon: <Award size={24} />, color: "amber" }
  ];

  return (
    <div className="dashboard-page-container animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Your Learning Progress</h1>
          <p>Keep the momentum going! You're doing great.</p>
        </header>

        {/* Stat Cards */}
        <div className="stats-grid">
          {statCards.map((stat, idx) => (
            <div key={idx} className={`stat-card ${stat.color} animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="stat-icon-box">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-label">{stat.title}</span>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-grid">
          {/* Weekly Activity Chart */}
          <div className="chart-section glass">
            <div className="chart-header"><TrendingUp size={20} /><h3>Weekly Activity</h3></div>
            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--primary)' : 'var(--primary-light)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="streak-section glass">
            <div className="chart-header"><Flame size={20} /><h3>Streak Calendar</h3></div>
            <div className="streak-count-big">{streak.count} <span>day streak 🔥</span></div>
            <div className="streak-dots">
              {last7.map(d => (
                <div key={d.date} className="streak-day">
                  <div className={`streak-dot ${d.active ? 'active' : ''}`} title={d.date} />
                  <span className="streak-day-label">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="streak-msg">
              {streak.count >= 7 ? '🏆 Amazing streak! Keep it up!' : streak.count >= 3 ? '🔥 Great momentum!' : '💪 Start your streak today!'}
            </p>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="daily-challenge-section glass">
          <div className="challenge-header">
            <div className="challenge-title-row">
              <Zap size={22} className="zap-icon" />
              <div>
                <h3>Daily Challenge</h3>
                <p className="challenge-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <div className="challenge-progress-badge">
              <span>{completedCount}/{totalTasks}</span>
              <div className="challenge-ring" style={{ '--pct': progressPct }} />
            </div>
          </div>

          <div className="challenge-progress-bar">
            <div className="challenge-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="challenge-tasks">
            {challenges.tasks.map(task => (
              <div key={task.id} className={`challenge-task ${task.done ? 'done' : ''}`}>
                <button className={`task-check ${task.done ? 'checked' : ''}`} onClick={() => !task.done && markDone(task.id)}>
                  {task.done ? <CheckCircle size={20} /> : <div className="empty-circle" />}
                </button>
                <span className="task-label">{task.label}</span>
                {!task.done && (
                  <a href={task.page} className="task-go-btn">Go →</a>
                )}
                {task.done && <span className="task-done-badge">Done ✓</span>}
              </div>
            ))}
          </div>

          {completedCount === totalTasks && (
            <div className="all-done-banner animate-fade">
              🎉 All challenges completed for today! Amazing work!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
