import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Share2,
  Smile,
  MessageSquareText,
  Sparkles,
  Bell,
  Settings,
  Search,
  Calendar,
  ChevronDown,
  User,
  Menu,
  X,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Info,
  Filter,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---

const MOCK_SCHEMES = [
  { id: 1, name: 'PM-KISAN', department: 'Agriculture', status: 'Active', mentions: 12450, sentiment: 65, platforms: ['FB', 'X', 'YT'], lastUpdated: '2026-10-29' },
  { id: 2, name: 'Ayushman Bharat', department: 'Health', status: 'Active', mentions: 18200, sentiment: 72, platforms: ['FB', 'X', 'IG'], lastUpdated: '2026-10-30' },
  { id: 3, name: 'PMAY (Housing)', department: 'Urban Affairs', status: 'Active', mentions: 8900, sentiment: 58, platforms: ['FB', 'YT'], lastUpdated: '2026-10-28' },
  { id: 4, name: 'National Youth Skill Initiative', department: 'Skill Development', status: 'Pilot', mentions: 5420, sentiment: 81, platforms: ['IG', 'YT', 'X'], lastUpdated: '2026-10-30' },
];

const SENTIMENT_TRENDS = Array.from({ length: 30 }, (_, i) => ({
  date: `Oct ${i + 1}`,
  positive: Math.floor(Math.random() * 50) + 40,
  neutral: Math.floor(Math.random() * 30) + 10,
  negative: Math.floor(Math.random() * 40) + 10,
}));

const PLATFORM_ENGAGEMENT = [
  { name: 'Facebook', value: 45000 },
  { name: 'Instagram', value: 38000 },
  { name: 'YouTube', value: 29000 },
  { name: 'X (Twitter)', value: 16000 },
];

const TOP_TOPICS = [
  { topic: 'Eligibility Criteria', mentions: 8500 },
  { topic: 'Application Process', mentions: 7200 },
  { topic: 'Benefit Disbursement', mentions: 6800 },
  { topic: 'Documentation Required', mentions: 4500 },
  { topic: 'Portal Glitches', mentions: 3200 },
];

const MOCK_COMMENTS = [
  { id: 1, text: "The new PM-KISAN installment really helped with buying seeds this season. Thank you!", platform: "FB", scheme: "PM-KISAN", date: "2026-10-30", sentiment: "Positive", topic: "Benefit Disbursement", confidence: 95 },
  { id: 2, text: "Form fill karne me problem aa rahi hai, server down hai lagta hai.", platform: "X", scheme: "National Youth Skill Initiative", date: "2026-10-30", sentiment: "Negative", topic: "Portal Glitches", confidence: 88 },
  { id: 3, text: "Ayushman card apply kiya 2 mahine ho gaye, abhi tak status pending dikha raha hai.", platform: "FB", scheme: "Ayushman Bharat", date: "2026-10-29", sentiment: "Negative", topic: "Application Process", confidence: 92 },
  { id: 4, text: "Can someone explain the exact documentation needed for PMAY? The website is confusing.", platform: "X", scheme: "PMAY", date: "2026-10-29", sentiment: "Neutral", topic: "Documentation Required", confidence: 75 },
  { id: 5, text: "Yojana bahut acchi hai, youth ko kafi fayda hoga isse.", platform: "YT", scheme: "National Youth Skill Initiative", date: "2026-10-28", sentiment: "Positive", topic: "General Feedback", confidence: 98 },
  { id: 6, text: "Just received my Ayushman Bharat card. Process was surprisingly smooth.", platform: "IG", scheme: "Ayushman Bharat", date: "2026-10-28", sentiment: "Positive", topic: "Application Process", confidence: 94 },
  { id: 7, text: "Kisan samman nidhi ka paisa abhi tak account me nahi aaya hai is bar.", platform: "YT", scheme: "PM-KISAN", date: "2026-10-27", sentiment: "Negative", topic: "Benefit Disbursement", confidence: 91 },
  { id: 8, text: "I think the income limit for this scheme should be increased to cover middle class.", platform: "X", scheme: "PMAY", date: "2026-10-27", sentiment: "Neutral", topic: "Eligibility Criteria", confidence: 82 },
  { id: 9, text: "Excellent initiative by the government for upskilling.", platform: "IG", scheme: "National Youth Skill Initiative", date: "2026-10-26", sentiment: "Positive", topic: "General Feedback", confidence: 96 },
  { id: 10, text: "Site is constantly crashing when trying to upload PDF documents.", platform: "X", scheme: "Ayushman Bharat", date: "2026-10-26", sentiment: "Negative", topic: "Portal Glitches", confidence: 89 },
  { id: 11, text: "Is it applicable for tenant farmers? Need clarity.", platform: "FB", scheme: "PM-KISAN", date: "2026-10-25", sentiment: "Neutral", topic: "Eligibility Criteria", confidence: 78 },
  { id: 12, text: "Mera naam list me hai par subsidy nahi aayi, kahan complain karu?", platform: "YT", scheme: "PMAY", date: "2026-10-25", sentiment: "Negative", topic: "Benefit Disbursement", confidence: 90 },
  { id: 13, text: "Training centers are well equipped, loving the coding course.", platform: "IG", scheme: "National Youth Skill Initiative", date: "2026-10-24", sentiment: "Positive", topic: "Training Quality", confidence: 93 },
  { id: 14, text: "Hospital refused to accept Ayushman card saying network is down.", platform: "X", scheme: "Ayushman Bharat", date: "2026-10-24", sentiment: "Negative", topic: "Implementation", confidence: 87 },
  { id: 15, text: "How to check my application status online?", platform: "FB", scheme: "PMAY", date: "2026-10-23", sentiment: "Neutral", topic: "Application Process", confidence: 80 },
  { id: 16, text: "Good step, but rural awareness is still very low.", platform: "YT", scheme: "National Youth Skill Initiative", date: "2026-10-23", sentiment: "Mixed", topic: "Awareness", confidence: 65 },
  { id: 17, text: "Thankful for the timely financial support.", platform: "FB", scheme: "PM-KISAN", date: "2026-10-22", sentiment: "Positive", topic: "Benefit Disbursement", confidence: 99 },
  { id: 18, text: "Aadhar linking fails every time I try. Please fix.", platform: "X", scheme: "Ayushman Bharat", date: "2026-10-22", sentiment: "Negative", topic: "Portal Glitches", confidence: 92 },
  { id: 19, text: "PMAY ne hamara apna ghar ka sapna poora kiya.", platform: "IG", scheme: "PMAY", date: "2026-10-21", sentiment: "Positive", topic: "General Feedback", confidence: 97 },
  { id: 20, text: "What is the last date to apply for the upcoming batch?", platform: "YT", scheme: "National Youth Skill Initiative", date: "2026-10-21", sentiment: "Neutral", topic: "Application Process", confidence: 85 }
];

const COLORS = {
  positive: '#22c55e', // Green
  negative: '#ef4444', // Red
  neutral: '#eab308',  // Yellow
  primary: '#1e3a8a',  // Navy
  accent: '#f97316'    // Saffron/Orange
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "default" }) => {
  const styles = {
    positive: "bg-green-100 text-green-700 border-green-200",
    negative: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-yellow-100 text-yellow-700 border-yellow-200",
    active: "bg-blue-100 text-blue-700 border-blue-200",
    pilot: "bg-purple-100 text-purple-700 border-purple-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
    mixed: "bg-orange-100 text-orange-700 border-orange-200"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type.toLowerCase()] || styles.default}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon }) => {
  const variants = {
    primary: 'bg-[#1e3a8a] text-white hover:bg-blue-900',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    accent: 'bg-[#f97316] text-white hover:bg-orange-600'
  };
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [schemes, setSchemes] = useState(MOCK_SCHEMES);
  
  // Modals & Drawers state
  const [isAddSchemeOpen, setIsAddSchemeOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const NAVIGATION = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'schemes', label: 'Scheme Monitoring', icon: FolderKanban },
    { id: 'platforms', label: 'Platform Analytics', icon: Share2 },
    { id: 'sentiment', label: 'Public Sentiment', icon: Smile },
    { id: 'comments', label: 'Comments Explorer', icon: MessageSquareText },
    { id: 'ai', label: 'AI Recommendations', icon: Sparkles },
    { id: 'alerts', label: 'Alerts & Reports', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (id) => {
    setCurrentRoute(id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // --- VIEWS ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Public Sentiment Intelligence</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor government schemes. Understand public feedback. Make evidence-based decisions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge type="active">Demo Data</Badge>
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Schemes</option>
            {schemes.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
          <Button icon={Download} variant="secondary" onClick={() => alert("Dashboard report download started.")}>Export</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Schemes Monitored', value: schemes.length, change: '+2', trend: 'up' },
          { label: 'Total Mentions', value: '48,620', change: '+12.5%', trend: 'up' },
          { label: 'Engagements', value: '1.28L', change: '+8.1%', trend: 'up' },
          { label: 'Positive Sentiment', value: '62.4%', change: '+4.2%', trend: 'up', color: 'text-green-600' },
          { label: 'Negative Sentiment', value: '21.7%', change: '-1.5%', trend: 'down', color: 'text-red-600' },
          { label: 'Neutral Sentiment', value: '15.9%', change: '-2.7%', trend: 'down', color: 'text-yellow-600' },
        ].map((kpi, i) => (
          <Card key={i} className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-semibold ${kpi.color || 'text-gray-900'}`}>{kpi.value}</span>
            </div>
            <div className={`mt-2 flex items-center text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {kpi.change} vs last month
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="col-span-1 lg:col-span-2 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Sentiment Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SENTIMENT_TRENDS} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="positive" name="Positive" stroke={COLORS.positive} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="negative" name="Negative" stroke={COLORS.negative} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="neutral" name="Neutral" stroke={COLORS.neutral} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: 62.4 },
                    { name: 'Negative', value: 21.7 },
                    { name: 'Neutral', value: 15.9 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS.positive} />
                  <Cell fill={COLORS.negative} />
                  <Cell fill={COLORS.neutral} />
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Bar Chart */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Platform</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_ENGAGEMENT} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Topics Horizontal Bar */}
        <Card className="col-span-1 lg:col-span-2 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Discussed Topics</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_TOPICS} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={120} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="mentions" fill={COLORS.accent} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const SchemeMonitoringView = () => {
    const [newScheme, setNewScheme] = useState({ name: '', department: '', status: 'Active' });

    const handleAdd = (e) => {
      e.preventDefault();
      if(newScheme.name && newScheme.department) {
        setSchemes([...schemes, {
          id: schemes.length + 1,
          ...newScheme,
          mentions: 0,
          sentiment: 50,
          platforms: ['FB', 'X'],
          lastUpdated: new Date().toISOString().split('T')[0]
        }]);
        setIsAddSchemeOpen(false);
        setNewScheme({ name: '', department: '', status: 'Active' });
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scheme Monitoring</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track performance of active government initiatives.</p>
          </div>
          <Button icon={Plus} onClick={() => setIsAddSchemeOpen(true)}>Add Scheme</Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Scheme Name</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Mentions</th>
                  <th className="px-6 py-4 font-medium">Sentiment Score</th>
                  <th className="px-6 py-4 font-medium">Platforms</th>
                  <th className="px-6 py-4 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schemes.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-900">{scheme.name}</td>
                    <td className="px-6 py-4 text-gray-600">{scheme.department}</td>
                    <td className="px-6 py-4"><Badge type={scheme.status}>{scheme.status}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{scheme.mentions.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div className={`h-2 rounded-full ${scheme.sentiment > 60 ? 'bg-green-500' : scheme.sentiment > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${scheme.sentiment}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{scheme.sentiment}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {scheme.platforms.map(p => <Badge key={p} type="default">{p}</Badge>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{scheme.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Scheme Modal */}
        {isAddSchemeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
            <Card className="w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Scheme</h2>
                <button onClick={() => setIsAddSchemeOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name</label>
                  <input required value={newScheme.name} onChange={e=>setNewScheme({...newScheme, name: e.target.value})} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Digital India" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input required value={newScheme.department} onChange={e=>setNewScheme({...newScheme, department: e.target.value})} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., IT & Telecom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords for Tracking (Comma separated)</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="digital, internet, broadband" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setIsAddSchemeOpen(false)} type="button">Cancel</Button>
                  <Button type="submit">Start Monitoring</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const PlatformAnalyticsView = () => {
    const [connectModal, setConnectModal] = useState(false);

    const platforms = [
      { name: 'X (Twitter)', icon: 'X', color: 'bg-black text-white', connected: true, mentions: '16.4k', sentiment: 45 },
      { name: 'Facebook', icon: 'FB', color: 'bg-blue-600 text-white', connected: true, mentions: '45.2k', sentiment: 68 },
      { name: 'Instagram', icon: 'IG', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white', connected: true, mentions: '38.1k', sentiment: 75 },
      { name: 'YouTube', icon: 'YT', color: 'bg-red-600 text-white', connected: true, mentions: '29.0k', sentiment: 62 },
      { name: 'Koo', icon: 'KO', color: 'bg-yellow-500 text-white', connected: false, mentions: '0', sentiment: 0 },
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Breakdown of engagement and sentiment across social networks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {platforms.map(p => (
            <Card key={p.name} className="p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${p.color}`}>
                  {p.icon}
                </div>
                {p.connected ? (
                  <Badge type="positive">Connected</Badge>
                ) : (
                  <Badge type="default">Disconnected</Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
              {p.connected ? (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Analyzed Posts</span>
                    <span className="font-semibold text-gray-900">{p.mentions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg Sentiment</span>
                    <span className="font-semibold text-gray-900">{p.sentiment}%</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center">
                      View full report <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <Button variant="secondary" className="w-full" onClick={() => setConnectModal(true)}>Connect Account</Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {connectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
            <Card className="w-full max-w-sm p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Demo Integration</h2>
              <p className="text-gray-500 text-sm mb-6">
                Real social media API authorization flows (OAuth) will be implemented in production. This is a prototype demonstration.
              </p>
              <Button className="w-full" onClick={() => setConnectModal(false)}>Acknowledge</Button>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const CommentsExplorerView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSentiment, setFilterSentiment] = useState('All');

    const filteredComments = MOCK_COMMENTS.filter(c => {
      const matchSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase()) || c.scheme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSentiment = filterSentiment === 'All' || c.sentiment === filterSentiment;
      return matchSearch && matchSentiment;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments Explorer</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into raw public feedback categorized by AI.</p>
        </div>

        <Card className="flex-1 flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-xl">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search comments, schemes..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={filterSentiment}
                onChange={e => setFilterSentiment(e.target.value)}
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
                <option value="Mixed">Mixed</option>
              </select>
              <Button variant="secondary" icon={Filter}>More Filters</Button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-600 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-medium w-1/3">Comment</th>
                  <th className="px-6 py-4 font-medium">Scheme</th>
                  <th className="px-6 py-4 font-medium">Sentiment</th>
                  <th className="px-6 py-4 font-medium">Detected Topic</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedComment(comment)}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                          {comment.platform}
                        </span>
                        <p className="text-gray-900 font-medium line-clamp-2">{comment.text}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{comment.scheme}</td>
                    <td className="px-6 py-4"><Badge type={comment.sentiment}>{comment.sentiment}</Badge></td>
                    <td className="px-6 py-4"><span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{comment.topic}</span></td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{comment.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">View</button>
                    </td>
                  </tr>
                ))}
                {filteredComments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No comments found matching your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Comment Detail Drawer */}
        {selectedComment && (
          <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/20 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col slide-in-from-right-full duration-300">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Comment Details</h3>
                <button onClick={() => setSelectedComment(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {selectedComment.platform}
                    </span>
                    <span className="text-sm text-gray-500">{selectedComment.date}</span>
                  </div>
                  <p className="text-lg text-gray-900 font-medium italic border-l-4 border-blue-500 pl-4 py-1">
                    "{selectedComment.text}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">Associated Scheme</span>
                    <span className="font-semibold text-gray-900">{selectedComment.scheme}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">Sentiment</span>
                    <Badge type={selectedComment.sentiment}>{selectedComment.sentiment}</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">Identified Topic</span>
                    <span className="text-sm font-medium text-gray-900">{selectedComment.topic}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">AI Confidence</span>
                    <span className="text-sm font-medium text-gray-900">{selectedComment.confidence}%</span>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                    <Sparkles className="w-4 h-4 text-orange-500 mr-2" /> AI Explanation & Suggestion
                  </h4>
                  <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-sm leading-relaxed space-y-3">
                    <p><strong>Analysis:</strong> The user is expressing {selectedComment.sentiment.toLowerCase()} sentiment regarding the '{selectedComment.topic}' aspect of the scheme.</p>
                    <p><strong>Suggested Action:</strong> {
                      selectedComment.sentiment === 'Negative' ? 'Acknowledge the issue publicly. Route to support team to verify the specific delay or portal glitch.' :
                      selectedComment.sentiment === 'Positive' ? 'Like the comment. Consider requesting permission to use as a testimonial.' :
                      'Provide a direct link to the official FAQ or guidelines document to clarify their doubt.'
                    }</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setSelectedComment(null)}>Close</Button>
                <Button>Generate Reply Draft</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AIRecommendationsView = () => {
    const [generating, setGenerating] = useState(false);
    const [insights, setInsights] = useState([]);

    const generateInsights = () => {
      setGenerating(true);
      setTimeout(() => {
        setInsights([
          { id: 1, type: 'action', title: 'Eligibility confusion is increasing', metric: '28% of questions', scheme: 'PM-KISAN', reason: 'High volume of neutral comments asking about tenant farmer rules.', action: 'Publish a simplified eligibility checklist infographic on Facebook and X.', priority: 'High' },
          { id: 2, type: 'alert', title: 'Negative sentiment spike detected', metric: '+15% this week', scheme: 'Ayushman Bharat', reason: 'Users reporting network errors at empanelled hospitals.', action: 'Investigate backend portal uptime. Issue holding statement.', priority: 'Critical' },
          { id: 3, type: 'opportunity', title: 'Strong awareness on YouTube', metric: '80% positive feedback', scheme: 'National Youth Skill Initiative', reason: 'Video testimonials are performing very well.', action: 'Increase investment in short 60-sec explainer shorts.', priority: 'Medium' },
          { id: 4, type: 'action', title: 'Application process bottleneck', metric: '42% drop-off mention', scheme: 'PMAY', reason: 'Users struggling with PDF document upload limits.', action: 'Create a step-by-step PDF compression guide.', priority: 'Medium' }
        ]);
        setGenerating(false);
      }, 1500);
    };

    const dismissInsight = (id) => {
      setInsights(insights.filter(i => i.id !== id));
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-500 text-sm mt-1">Simulated prototype outputs based on aggregated sentiment data.</p>
        </div>

        {insights.length === 0 && !generating ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-blue-50/30">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to analyze 48,620 data points</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Our AI engine correlates sentiment trends, topic frequencies, and engagement metrics to generate actionable policy and communication recommendations.
            </p>
            <Button size="lg" onClick={generateInsights} icon={Sparkles} className="px-8 py-3 text-lg">
              Generate AI Insights
            </Button>
          </Card>
        ) : generating ? (
          <Card className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-lg font-bold text-gray-900 animate-pulse">Analyzing cross-platform sentiment...</h2>
            <p className="text-gray-500 mt-2">Correlating topics and identifying actionable patterns.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map(insight => (
              <Card key={insight.id} className="p-6 flex flex-col relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${insight.priority === 'Critical' ? 'bg-red-500' : insight.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <Badge type={insight.priority === 'Critical' ? 'negative' : 'default'}>{insight.priority} Priority</Badge>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">{insight.scheme}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{insight.title}</h3>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Supporting Metric</span>
                      <p className="text-sm text-gray-900 font-medium">{insight.metric}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">AI Reasoning</span>
                      <p className="text-sm text-gray-600">{insight.reason}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
                    <span className="text-xs font-bold text-blue-800 uppercase block mb-1">Recommended Action</span>
                    <p className="text-sm text-blue-900 font-medium">{insight.action}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                  <Button className="flex-1" icon={CheckCircle2}>Create Task</Button>
                  <Button variant="secondary" onClick={() => dismissInsight(insight.id)}>Dismiss</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AlertsReportsView = () => {
    const handleDownloadCSV = () => {
      const headers = "Scheme Name,Department,Mentions,Sentiment Score,Last Updated\n";
      const rows = schemes.map(s => `"${s.name}","${s.department}",${s.mentions},${s.sentiment},${s.lastUpdated}`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "jandrishti_demo_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Reports</h1>
          <p className="text-gray-500 text-sm mt-1">System notifications and data export options.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Alerts</h2>
            {[
              { title: 'Negative Sentiment Spike', msg: 'Ayushman Bharat mentions dropped 12% in sentiment over 24h.', time: '2 hours ago', type: 'danger' },
              { title: 'Trending Topic Detected', msg: '"Portal Glitches" is trending rapidly for National Youth Skill Initiative.', time: '5 hours ago', type: 'warning' },
              { title: 'Milestone Reached', msg: 'PM-KISAN has crossed 10,000 positive mentions this month.', time: '1 day ago', type: 'success' },
            ].map((alert, i) => (
              <Card key={i} className="p-4 flex items-start gap-4">
                <div className={`p-2 rounded-full mt-1 flex-shrink-0 ${
                  alert.type === 'danger' ? 'bg-red-100 text-red-600' :
                  alert.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.msg}</p>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h2>
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Consolidated Report</h3>
              <p className="text-sm text-gray-500 mb-6">
                Download a CSV containing the latest summary metrics for all monitored schemes.
              </p>
              <Button className="w-full" onClick={handleDownloadCSV} icon={Download}>
                Download Demo Report
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Platform configuration and user preferences.</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Prototype Configuration</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Demo Data Mode</h4>
              <p className="text-sm text-gray-500">Toggle simulated data. (Locked for prototype)</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative opacity-70 cursor-not-allowed">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-500">Light / Dark mode preference</p>
            </div>
            <select disabled className="bg-gray-50 border border-gray-300 text-gray-500 rounded-lg px-3 py-1.5 text-sm outline-none cursor-not-allowed">
              <option>Light (Default)</option>
              <option>Dark</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3 text-orange-800 text-sm">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600" />
        <div>
          <strong className="font-bold block mb-1">Prototype Disclaimer</strong>
          This application is a frontend prototype built for demonstration purposes. All social media data, analytics, user details, and AI recommendations are locally simulated. No live API connections or real public data are utilized.
        </div>
      </div>
    </div>
  );

  // Fallback for missing routes
  const PublicSentimentView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Public Sentiment Detail</h1>
        <p className="text-gray-500 text-sm mt-1">Granular breakdown of emotion and topics.</p>
      </div>
      <Card className="p-12 text-center text-gray-500">
        <Smile className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p>This detailed view is conceptually represented in the Dashboard and Comments Explorer in this prototype.</p>
        <Button variant="secondary" className="mt-4" onClick={() => handleNavigate('overview')}>Back to Overview</Button>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentRoute) {
      case 'overview': return <DashboardView />;
      case 'schemes': return <SchemeMonitoringView />;
      case 'platforms': return <PlatformAnalyticsView />;
      case 'sentiment': return <PublicSentimentView />;
      case 'comments': return <CommentsExplorerView />;
      case 'ai': return <AIRecommendationsView />;
      case 'alerts': return <AlertsReportsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-slate-300 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#f97316] to-[#1e3a8a] flex items-center justify-center">
              <span className="text-white text-lg leading-none">J</span>
            </div>
            JanDrishti<span className="text-[#f97316]">AI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Analytics Platform</div>
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentRoute === item.id 
                  ? 'bg-slate-800 text-white border-l-4 border-[#f97316] shadow-sm' 
                  : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentRoute === item.id ? 'text-[#f97316]' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Analyst Desk</p>
              <p className="text-xs text-slate-500 truncate">Gov of India</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex relative w-64 lg:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Global search across platform..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </div>
            
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
}