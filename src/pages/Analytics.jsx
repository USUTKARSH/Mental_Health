import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/analytics/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading analytics...</p>;
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics & Insights</h1>

      <div className="flex gap-2 mb-6">
        {['overview', 'trends', 'habits', 'triggers', 'insights'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboard?.weeklyStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm font-semibold">Avg Weekly Mood</p>
            <p className="text-3xl font-bold text-blue-600">{dashboard.weeklyStats.averageMood || 'N/A'}</p>
            <p className="text-xs text-gray-500 mt-2">Based on {dashboard.weeklyStats.entries} entries</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm font-semibold">Mood Trend</p>
            <p className="text-2xl font-bold text-purple-600">{dashboard.weeklyStats.trend}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm font-semibold">Current Status</p>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm font-semibold">Last Week</p>
            <p className="text-2xl font-bold text-orange-600">+2 Habits</p>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && dashboard?.moodTrends && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">30-Day Mood Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dashboard.moodTrends.dailyAverages.map((val, idx) => ({ day: idx + 1, mood: val }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-600 mt-4 text-sm">Overall Average: {dashboard.moodTrends.overallAverage}</p>
        </div>
      )}

      {/* Habits Tab */}
      {activeTab === 'habits' && dashboard?.habitCorrelation && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Habit Averages</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(dashboard.habitCorrelation.habitAverages).map(([habit, value]) => ({
                name: habit,
                value: Math.round(value)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">AI Insights</h3>
            <ul className="space-y-2">
              {dashboard.habitCorrelation.insights && dashboard.habitCorrelation.insights.map((insight, idx) => (
                <li key={idx} className="flex gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Triggers Tab */}
      {activeTab === 'triggers' && dashboard?.triggers && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Mood Triggers</h3>
          {dashboard.triggers.frequentTriggers && dashboard.triggers.frequentTriggers.length > 0 ? (
            <div className="space-y-3">
              {dashboard.triggers.frequentTriggers.map((trigger, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-orange-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ width: `${(dashboard.triggers.triggerFrequency[trigger] / Math.max(...Object.values(dashboard.triggers.triggerFrequency))) * 100}%` }}
                    >
                      {dashboard.triggers.triggerFrequency[trigger]}
                    </div>
                  </div>
                  <span className="text-gray-700 font-semibold w-32">{trigger}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No triggers identified yet. Keep tracking!</p>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && dashboard?.weeklyInsights && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Weekly Summary</h3>
            <p className="text-gray-700">{dashboard.weeklyInsights.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-sm font-semibold text-gray-600">Mood Trend</p>
              <p className="text-2xl font-bold text-blue-600">{dashboard.weeklyInsights.moodTrend}</p>
            </div>

            <div className="card">
              <p className="text-sm font-semibold text-gray-600">Dominant Emotion</p>
              <p className="text-2xl font-bold text-purple-600 capitalize">{dashboard.weeklyInsights.dominantEmotion}</p>
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">Identified Triggers</h4>
            <div className="flex flex-wrap gap-2">
              {dashboard.weeklyInsights.triggers && dashboard.weeklyInsights.triggers.map((trigger, idx) => (
                <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  {trigger}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-gray-800 mb-3">AI Recommendations</h4>
            <ul className="space-y-2">
              {dashboard.weeklyInsights.recommendations && dashboard.weeklyInsights.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 p-2 bg-green-50 rounded">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
