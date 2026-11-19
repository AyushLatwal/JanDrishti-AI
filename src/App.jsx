import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, BarChart, Bar,
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Home, Activity, BarChart2, MessageSquare, Lightbulb, Bell, Settings as SettingsIcon, 
  Search, Plus, X, Menu, AlertTriangle, ArrowUp, ArrowDown, CheckCircle
} from 'lucide-react';
import './App.css';

// --- MOCK DATA ---
const MOCK_KPI = {
  schemes: { value: '12', change: '+2', trend: 'up' },
  mentions: { value: '48,620', change: '+12.4%', trend: 'up' },
  engagements: { value: '1.28L', change: '+5.2%', trend: 'up' },
  positive: { value: '62.4%', change: '+3.1%', trend: 'up' },
  negative: { value: '21.7%', change: '-1.2%', trend: 'down' },
  neutral: { value: '15.9%', change: '-1.9%', trend: 'down' },
};

const SENTIMENT_TREND_DATA = [
  { date: 'Oct 01', positive: 4000, neutral: 2400, negative: 1000 },
  { date: 'Oct 05', positive: 4500, neutral: 2200, negative: 1200 },
  { date: 'Oct 10', positive: 4200, neutral: 2600, negative: 1100 },
  { date: 'Oct 15', positive: 5000, neutral: 2100, negative: 900 },
  { date: 'Oct 20', positive: 4800, neutral: 2300, negative: 1400 },
  { date: 'Oct 25', positive: 5500, neutral: 2000, negative: 1300 },
  { date: 'Oct 30', positive: 6200, neutral: 1590, negative: 2170 },
];

const SENTIMENT_PIE_DATA = [
  { name: 'Positive', value: 62.4, color: '#10b981' },
  { name: 'Negative', value: 21.7, color: '#ef4444' },
  { name: 'Neutral', value: 15.9, color: '#94a3b8' },
];

const PLATFORM_DATA = [
  { name: 'X (Twitter)', posts: '12.4k', engagement: '45k', color: '#000000' },
  { name: 'Facebook', posts: '8.2k', engagement: '35k', color: '#1877F2' },
  { name: 'Instagram', posts: '5.1k', engagement: '28k', color: '#E4405F' },
  { name: 'YouTube', posts: '1.2k', engagement: '20k', color: '#FF0000' },
];

const INITIAL_SCHEMES = [
  { id: 1, name: 'PM-KISAN', dept: 'Agriculture', status: 'Active', mentions: '12.4k', sentiment: 68 },
  { id: 2, name: 'Ayushman Bharat', dept: 'Health', status: 'Active', mentions: '18.2k', sentiment: 75 },
  { id: 3, name: 'PMAY', dept: 'Housing', status: 'Active', mentions: '9.1k', sentiment: 54 },
  { id: 4, name: 'National Youth Skill', dept: 'Skill Dev', status: 'Monitoring', mentions: '4.5k', sentiment: 42 },
];

// --- LAYOUT COMPONENTS ---
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Scheme Monitoring', path: '/schemes', icon: Activity },
    { name: 'Platform Analytics', path: '/platforms', icon: BarChart2 },
    { name: 'Public Sentiment', path: '/sentiment', icon: MessageSquare },
    { name: 'AI Recommendations', path: '/ai-insights', icon: Lightbulb },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="logo-text">JanDrishti AI</span>
        <button className="menu-toggle" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
          <X size={20} />
        </button>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="avatar">JD</div>
          <div style={{ marginLeft: '12px' }}>
            <p style={{ fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Nodal Officer</p>
            <p style={{ fontSize: '0.75rem', margin: 0, color: '#94a3b8' }}>Demo Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Topbar = ({ setIsOpen }) => (
  <header className="topbar">
    <div className="topbar-left">
      <button className="menu-toggle" onClick={() => setIsOpen(true)}>
        <Menu size={20} />
      </button>
      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search schemes, topics..." />
      </div>
    </div>
    <div className="topbar-right">
      <div className="demo-badge">
        <AlertTriangle size={14} /> Demo Data Mode
      </div>
      <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
    </div>
  </header>
);

// --- PAGES ---
const Overview = () => (
  <div>
    <div className="page-header">
      <h1>Public Sentiment Intelligence</h1>
      <p>Monitor government schemes. Understand public feedback. Make evidence-based decisions.</p>
    </div>
    <div className="kpi-grid">
      {Object.entries(MOCK_KPI).map(([key, data]) => (
        <div key={key} className="card">
          <p className="kpi-title">{key}</p>
          <div className="kpi-value">
            {data.value}
            <span className={`trend ${data.trend}`}>
              {data.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {data.change}
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="charts-grid">
      <div className="card">
        <h3>Sentiment Trend (30 Days)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SENTIMENT_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="neutral" stroke="#94a3b8" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3>Sentiment Distribution</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={SENTIMENT_PIE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {SENTIMENT_PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const SchemeMonitoring = () => (
  <div>
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1>Scheme Monitoring</h1>
        <p>Track performance and perception of individual initiatives.</p>
      </div>
      <button className="btn-primary">
        <Plus size={16} /> Add Scheme
      </button>
    </div>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Mentions</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {INITIAL_SCHEMES.map((scheme) => (
            <tr key={scheme.id}>
              <td style={{ fontWeight: 500 }}>{scheme.name}</td>
              <td style={{ color: '#64748b' }}>{scheme.dept}</td>
              <td><span className={`status-badge ${scheme.status.toLowerCase()}`}>{scheme.status}</span></td>
              <td>{scheme.mentions}</td>
              <td>{scheme.sentiment}/100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PlatformAnalytics = () => (
  <div>
    <div className="page-header">
      <h1>Platform Analytics</h1>
      <p>Engagement metrics across connected social networks (Simulated).</p>
    </div>
    <div className="platform-grid">
      {PLATFORM_DATA.map((platform) => (
        <div key={platform.name} className="platform-card card">
          <h3 style={{ color: platform.color, marginBottom: '12px' }}>{platform.name}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <div>
              <p className="kpi-title">Posts</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{platform.posts}</p>
            </div>
            <div>
              <p className="kpi-title">Engagement</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{platform.engagement}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PublicSentiment = () => (
  <div>
    <div className="page-header">
      <h1>Public Sentiment Explorer</h1>
      <p>Deep dive into thematic sentiment and frequently discussed public concerns.</p>
    </div>
    <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="card">
        <h3>Top Discussion Topics</h3>
        <div className="sentiment-list">
          <div className="sentiment-item">
            <p className="sentiment-topic">Eligibility Requirements</p>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>28% of total comments. Mostly Neutral.</p>
          </div>
          <div className="sentiment-item">
            <p className="sentiment-topic">Benefit Payment Delays</p>
            <p style={{ fontSize: '0.875rem', color: '#ef4444' }}>15% of total comments. Highly Negative.</p>
          </div>
          <div className="sentiment-item">
            <p className="sentiment-topic">Application Process Success</p>
            <p style={{ fontSize: '0.875rem', color: '#10b981' }}>22% of total comments. Highly Positive.</p>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Demo Comments Feed</h3>
        <div className="sentiment-list">
          <div className="sentiment-item" style={{ borderLeft: '4px solid #ef4444' }}>
            <p style={{ fontSize: '0.875rem' }}>"Kab aayega PM KISAN ka paisa? It's been delayed by a month now."</p>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block' }}>Platform: Facebook • PM-KISAN</span>
          </div>
          <div className="sentiment-item" style={{ borderLeft: '4px solid #10b981' }}>
            <p style={{ fontSize: '0.875rem' }}>"The new eligibility criteria for Ayushman Bharat is very clear. Thank you!"</p>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block' }}>Platform: X • Ayushman Bharat</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setInsights([
        { id: 1, priority: 'high', title: 'Address Delayed Payments', text: 'Negative sentiment around delayed benefits has increased by 15% this week.', action: 'Investigate backend delays and issue a public statement.' },
        { id: 2, priority: 'high', title: 'Clarify Eligibility', text: 'Eligibility confusion is increasing in recent Facebook comments regarding Ayushman Bharat.', action: 'Publish a simple eligibility checklist infographic.' },
        { id: 3, priority: 'medium', title: 'Leverage YouTube', text: 'Awareness metrics for the Youth Skill Initiative are strongest on YouTube.', action: 'Produce and test 60-second short explainer videos.' }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>AI Recommendations</h1>
          <p>Automated strategic insights based on sentiment analysis.</p>
        </div>
        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          <Lightbulb size={18} />
          {loading ? 'Analyzing Data...' : 'Generate AI Insights'}
        </button>
      </div>

      {insights.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#64748b' }}>Click "Generate AI Insights" to simulate the analysis engine.</p>
        </div>
      )}

      <div className="ai-grid">
        {insights.map(insight => (
          <div key={insight.id} className={`ai-card ${insight.priority}-priority`}>
            <span className={`priority-badge ${insight.priority}`}>
              {insight.priority} Priority
            </span>
            <h3 style={{ marginBottom: '8px' }}>{insight.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.5' }}>{insight.text}</p>
            <div className="ai-action">
              <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {insight.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>
    <SettingsIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
    <h2>{title}</h2>
    <p>This settings module is simulated for the demo.</p>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="main-wrapper">
          <Topbar setIsOpen={setSidebarOpen} />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/schemes" element={<SchemeMonitoring />} />
              <Route path="/platforms" element={<PlatformAnalytics />} />
              <Route path="/sentiment" element={<PublicSentiment />} />
              <Route path="/ai-insights" element={<AIRecommendations />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}