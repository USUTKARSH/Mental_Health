import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';
import { FiPlus, FiTrash2, FiCalendar, FiTrendingUp } from 'react-icons/fi';

export default function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [moodScore, setMoodScore] = useState(5);
  const [emotion, setEmotion] = useState('calm');
  const [notes, setNotes] = useState('');
  const [trigger, setTrigger] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const emotions = ['happy', 'sad', 'anxious', 'calm', 'stressed', 'peaceful', 'excited', 'angry'];

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/mood');
      setMoods(response.data || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
      setError('Failed to fetch moods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    if (!emotion || !intensity) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      const response = await axiosInstance.post('/mood', {
        moodScore: parseInt(moodScore),
        emotion,
        intensity,
        trigger,
        notes,
      });
      setMoods([response.data, ...moods]);
      setShowForm(false);
      resetForm();
      setSuccess('Mood logged successfully! 😊');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding mood:', error);
      setError('Failed to save mood entry');
    }
  };

  const handleDeleteMood = async (id) => {
    if (window.confirm('Delete this mood entry?')) {
      try {
        await axiosInstance.delete(`/mood/${id}`);
        setMoods(moods.filter(m => m.id !== id));
        setSuccess('Mood entry deleted');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting mood:', error);
        setError('Failed to delete mood');
      }
    }
  };

  const resetForm = () => {
    setMoodScore(5);
    setEmotion('calm');
    setNotes('');
    setTrigger('');
    setIntensity('medium');
    setError('');
  };

  const getMoodColor = (score) => {
    if (score <= 3) return 'bg-red-50 border-red-200';
    if (score <= 6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getMoodEmoji = (score) => {
    if (score === 1) return '😭';
    if (score <= 3) return '😢';
    if (score <= 5) return '😐';
    if (score <= 7) return '🙂';
    if (score <= 9) return '😊';
    return '😄';
  };

  const calculateStats = () => {
    if (moods.length === 0) return { avg: 0, highest: 0, lowest: 0 };
    const scores = moods.map(m => m.moodScore);
    return {
      avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMoods = filterEmotion === 'all' ? moods : moods.filter(m => m.emotion === filterEmotion);
  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎭 Mood Tracker</h1>
          <p className="text-gray-600">Track your emotional well-being and identify patterns</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <FiPlus size={20} />
          Log Mood
        </button>
      </div>

      {/* Statistics Cards */}
      {moods.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Average Mood</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.avg}/10</p>
              </div>
              <FiTrendingUp className="text-blue-400 text-4xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Highest Mood</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.highest}/10</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Entries</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{moods.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Mood Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📝 How are you feeling today?</h3>
          <form onSubmit={handleAddMood} className="space-y-5">
            {/* Visual Mood Scale */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Mood Score</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodScore}
                  onChange={(e) => setMoodScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Terrible</span>
                  <span>Neutral</span>
                  <span>Great</span>
                </div>
                <div className="text-center">
                  <p className="text-5xl mb-2">{getMoodEmoji(moodScore)}</p>
                  <p className="text-2xl font-bold text-blue-600">{moodScore}/10</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emotion Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Primary Emotion</label>
                <div className="grid grid-cols-4 gap-2">
                  {emotions.map(emo => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setEmotion(emo)}
                      className={`p-2 rounded-lg text-sm font-semibold transition ${
                        emotion === emo
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Intensity</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setIntensity(level)}
                      className={`p-2 rounded-lg font-semibold transition capitalize ${
                        intensity === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trigger */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">What triggered this mood? (optional)</label>
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g., Good news, workout, work stress"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share more details about your feelings..."
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                Save Mood Entry
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      {moods.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterEmotion('all')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filterEmotion === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Emotions
          </button>
          {emotions.map(emo => (
            <button
              key={emo}
              onClick={() => setFilterEmotion(emo)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize ${
                filterEmotion === emo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {emo}
            </button>
          ))}
        </div>
      )}

      {/* Mood History */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading moods...</p>
      ) : filteredMoods.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            {moods.length === 0 
              ? 'No mood entries yet. Start by logging your first mood! 🌟' 
              : 'No entries found for this emotion filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">📊 Recent Entries ({filteredMoods.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMoods.map((mood) => (
              <div key={mood.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                mood.moodScore <= 3 ? 'border-red-400' : 
                mood.moodScore <= 6 ? 'border-yellow-400' : 
                'border-green-400'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">{getMoodEmoji(mood.moodScore)}</span>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{mood.moodScore}</p>
                      <p className="text-xs text-gray-500 capitalize">{mood.emotion}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMood(mood.id)} 
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  {mood.trigger && (
                    <p className="text-gray-700"><span className="font-semibold">Trigger:</span> {mood.trigger}</p>
                  )}
                  <p className="text-gray-600 capitalize"><span className="font-semibold">Intensity:</span> {mood.intensity}</p>
                  {mood.notes && (
                    <p className="text-gray-700 bg-gray-50 p-2 rounded">{mood.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-3 pt-3 border-t">
                    <FiCalendar size={14} />
                    {formatDate(mood.createdAt || new Date())}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
