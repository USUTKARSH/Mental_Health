import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axiosInstance from '../api/AxiosClient';
import { FiBarChart2, FiTrendingUp, FiBook, FiActivity, FiHeart, FiAward, FiSmile } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showGroundingTechnique, setShowGroundingTechnique] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  // 13 Mental Health Protection Tips
  const mentalHealthTips = [
    { title: '🛌 Sleep Hygiene', description: 'Eliminate devices from evening routine and maintain a consistent sleep schedule' },
    { title: '👨‍👩‍👧 Support System', description: 'Engage with trusted friends, family, or support circle during stressful times' },
    { title: '🧘 Grounding Techniques', description: 'Use breathing and sensory techniques to manage stress and anxiety' },
    { title: '🏃 Get Active', description: 'Move your body through high or low impact activities to reduce stress naturally' },
    { title: '🚪 Healthy Boundaries', description: 'Learn to say "no" to requests beyond your scope or bandwidth' },
    { title: '👂 Active Listening', description: 'Offer undivided attention and use encouraging non-verbal cues in conversations' },
    { title: '💙 Empathy', description: 'Consider others\' perspectives and validate their emotions and experiences' },
    { title: '🗣️ Clarity', description: 'Reflect before speaking and use concise language to communicate your needs' },
    { title: '✅ Accountability', description: 'recognize your role and take accountability for your actions and emotions' },
    { title: '🤝 Collaboration', description: 'Work together to find solutions that work for all parties involved' },
    { title: '💬 Talk About It', description: 'Share information and experiences about mental health to reduce stigma' },
    { title: '🤲 Offer Support', description: 'Encourage others to seek support and challenge internalized stigmas' },
    { title: '🌈 Inclusive Spaces', description: 'Speak up against stereotypes and use compassionate, inclusive language' }
  ];

  // Grounding technique (5-4-3-2-1)
  const groundingSteps = [
    { title: '👀 Five Things You See', description: 'Look around and notice 5 specific things you can see' },
    { title: '✋ Four Things You Feel', description: 'Notice 4 physical sensations - texture, temperature, etc.' },
    { title: '👂 Three Things You Hear', description: 'Listen carefully and identify 3 different sounds' },
    { title: '👃 Two Things You Smell', description: 'Notice 2 distinct smells around you' },
    { title: '👅 One Thing You Taste', description: 'Pay attention to 1 taste or flavor' }
  ];

  // Inspirational Quotes
  const quotes = [
    { text: "Your mental health is a priority, not a luxury.", author: "Unknown" },
    { text: "Small progress is still progress.", author: "Unknown" },
    { text: "You are stronger than you believe.", author: "Unknown" },
    { text: "It's okay to not be okay, but seek help when you need it.", author: "Unknown" },
    { text: "Self-care is not selfish; it's essential.", author: "Unknown" }
  ];

  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    fetchStats();
    // Rotate tips every 30 seconds
    const tipTimer = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % mentalHealthTips.length);
    }, 30000);
    return () => clearInterval(tipTimer);
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      setLoading(true);
      const response = await axiosInstance.get('/analytics/weekly');
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err.response || err.message);
      setError('Failed to fetch stats: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const currentTip = mentalHealthTips[currentTipIndex];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user?.firstName || 'User'}! 👋</h1>
      <p className="text-gray-600 mb-8">Here's your mental health overview</p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-semibold">{error}</div>}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Weekly Avg Mood</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.averageMood || 'N/A'}</p>
                </div>
                <FiBarChart2 size={32} className="text-blue-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Mood Entries</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.entries || 0}</p>
                </div>
                <FiBook size={32} className="text-green-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Mood Trend</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.trend || 'N/A'}</p>
                </div>
                <FiTrendingUp size={32} className="text-purple-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Wellness Streak</p>
                  <p className="text-3xl font-bold text-orange-600">🔥 7</p>
                </div>
                <FiAward size={32} className="text-orange-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily Mental Health Tip */}
            <div className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-indigo-900 mb-4">💡 Daily Tip #{currentTipIndex + 1}</h3>
              <p className="text-2xl font-bold text-indigo-700 mb-2">{currentTip.title}</p>
              <p className="text-indigo-600 mb-4">{currentTip.description}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentTipIndex((prev) => (prev - 1 + mentalHealthTips.length) % mentalHealthTips.length)}
                  className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  ← Previous
                </button>
                <button 
                  onClick={() => setCurrentTipIndex((prev) => (prev + 1) % mentalHealthTips.length)}
                  className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Inspirational Quote */}
            <div className="card bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
              <h3 className="text-lg font-bold text-pink-900 mb-4">✨ Daily Inspiration</h3>
              <div className="h-full flex flex-col justify-center">
                <p className="text-pink-700 italic text-lg font-semibold mb-3">"{randomQuote.text}"</p>
                <p className="text-pink-600 text-sm">— {randomQuote.author}</p>
              </div>
            </div>

            {/* Grounding Technique */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-4">🧘 Grounding Technique</h3>
              {!showGroundingTechnique ? (
                <div className="h-full flex flex-col justify-center">
                  <p className="text-green-700 mb-4">Feeling stressed? Try the 5-4-3-2-1 grounding technique to calm your mind.</p>
                  <button 
                    onClick={() => setShowGroundingTechnique(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
                  >
                    Start Now 🌿
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-green-700 text-sm font-semibold mb-3">{groundingSteps[groundingStep].title}</p>
                  <p className="text-green-600 mb-4">{groundingSteps[groundingStep].description}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setGroundingStep(groundingStep > 0 ? groundingStep - 1 : 0)}
                      disabled={groundingStep === 0}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                    >
                      ← Back
                    </button>
                    {groundingStep < groundingSteps.length - 1 ? (
                      <button 
                        onClick={() => setGroundingStep(groundingStep + 1)}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Next →
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setShowGroundingTechnique(false); setGroundingStep(0); }}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        ✓ Done!
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiHeart className="text-red-500" /> Self-Care Checklist
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 pb-3 border-b hover:bg-gray-50 p-2 rounded transition">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <span className="text-gray-700">Got 7-9 hours of quality sleep</span>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b hover:bg-gray-50 p-2 rounded transition">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <span className="text-gray-700">Engaged with my support system</span>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b hover:bg-gray-50 p-2 rounded transition">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <span className="text-gray-700">Moved my body (exercise/walk)</span>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b hover:bg-gray-50 p-2 rounded transition">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <span className="text-gray-700">Set healthy boundaries today</span>
                </li>
                <li className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded transition">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <span className="text-gray-700">Journaled or processed emotions</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiSmile className="text-blue-500" /> Mental Health Resources
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-900">🆘 Crisis Support</p>
                  <p className="text-sm text-blue-700">Call or text 988 (Suicide & Crisis Lifeline)</p>
                </div>
                <div className="bg-green-50 px-4 py-3 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-900">💬 Active Listening</p>
                  <p className="text-sm text-green-700">Offer undivided attention and validate others\' emotions</p>
                </div>
                <div className="bg-purple-50 px-4 py-3 rounded-lg border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-900">🌈 Combat Stigma</p>
                  <p className="text-sm text-purple-700">Use inclusive language and speak about mental health openly</p>
                </div>
                <div className="bg-orange-50 px-4 py-3 rounded-lg border-l-4 border-orange-500">
                  <p className="font-semibold text-orange-900">🤝 Build Community</p>
                  <p className="text-sm text-orange-700">Connect with others who understand your journey</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
