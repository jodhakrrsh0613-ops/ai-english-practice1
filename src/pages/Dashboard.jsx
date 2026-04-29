import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Target, Clock, Award, TrendingUp } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    streak: 5,
    accuracy: 85,
    practiceTime: 120,
    lessonsCompleted: 12
  });

  const data = [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 25 },
    { day: 'Sat', minutes: 40 },
    { day: 'Sun', minutes: 50 },
  ];

  const statCards = [
    { title: "Current Streak", value: `${stats.streak} Days`, icon: <Flame size={24} />, color: "orange" },
    { title: "Accuracy", value: `${stats.accuracy}%`, icon: <Target size={24} />, color: "green" },
    { title: "Practice Time", value: `${stats.practiceTime} min`, icon: <Clock size={24} />, color: "indigo" },
    { title: "Badges", value: stats.lessonsCompleted, icon: <Award size={24} />, color: "amber" }
  ];

  return (
    <div className="dashboard-page-container animate-fade">
      <div className="section-container">
        <header className="page-header-simple">
          <h1 className="text-gradient">Your Learning Progress</h1>
          <p>Keep the momentum going! You're doing great this week.</p>
        </header>

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
          <div className="chart-section glass">
            <div className="chart-header">
              <TrendingUp size={20} />
              <h3>Weekly Activity</h3>
            </div>
            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'var(--bg-main)'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)'}}
                  />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--primary)' : 'var(--primary-light)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="goals-section glass">
            <h3>Daily Goals</h3>
            <div className="goal-item">
              <div className="goal-info">
                <span>Speaking Practice</span>
                <span>20/30 min</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '66%', background: 'var(--primary)' }}></div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-info">
                <span>Grammar Quiz</span>
                <span>5/5</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%', background: 'var(--secondary)' }}></div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-info">
                <span>New Vocabulary</span>
                <span>3/5 words</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%', background: 'var(--accent)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
