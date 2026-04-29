import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Target, Clock, Award } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  // Mock Data
  const weeklyData = [
    { name: 'Mon', score: 85 },
    { name: 'Tue', score: 90 },
    { name: 'Wed', score: 75 },
    { name: 'Thu', score: 95 },
    { name: 'Fri', score: 80 },
    { name: 'Sat', score: 100 },
    { name: 'Sun', score: 90 },
  ];

  return (
    <div className="page-container dashboard-page">
      <header className="page-header">
        <div className="header-title">
          <h1>Progress Dashboard</h1>
          <p>Track your learning journey and stay motivated.</p>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card streak">
            <div className="stat-icon"><Flame size={28} /></div>
            <div className="stat-info">
              <h3>7 Days</h3>
              <p>Current Streak</p>
            </div>
          </div>
          
          <div className="stat-card accuracy">
            <div className="stat-icon"><Target size={28} /></div>
            <div className="stat-info">
              <h3>88%</h3>
              <p>Avg. Accuracy</p>
            </div>
          </div>
          
          <div className="stat-card time">
            <div className="stat-icon"><Clock size={28} /></div>
            <div className="stat-info">
              <h3>12h 30m</h3>
              <p>Time Practiced</p>
            </div>
          </div>

          <div className="stat-card words">
            <div className="stat-icon"><Award size={28} /></div>
            <div className="stat-info">
              <h3>245</h3>
              <p>Words Learned</p>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h2>Weekly Performance</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
