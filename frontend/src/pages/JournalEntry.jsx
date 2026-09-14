import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';
import { FiPlus, FiTrash2, FiCalendar, FiBook } from 'react-icons/fi';

export default function JournalEntry() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [tags, setTags] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const suggestedPrompts = [
    'How did I feel today and why?',
    'What was the highlight of my day?',
    'What challenges did I overcome?',
    'What am I grateful for today?',
    'What did I learn about myself?',
    'How can I improve tomorrow?',
    'What made me smile today?',
    'What am I worried about?',
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/journal');
      setEntries(response.data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    try {
      const response = await axiosInstance.post('/journal', {
        title,
        content,
        moodScoreAtTime: parseInt(moodScore),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
      setEntries([response.data, ...entries]);
      setShowForm(false);
      resetForm();
      setSuccess('🎉 Entry saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding entry:', error);
      setError('Failed to save entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      try {
        await axiosInstance.delete(`/journal/${id}`);
        setEntries(entries.filter(e => e.id !== id));
        setSuccess('Entry deleted');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting entry:', error);
        setError('Failed to delete entry');
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMoodScore(5);
    setTags('');
    setError('');
  };

  const insertPrompt = (prompt) => {
    setContent(content + (content && !content.endsWith('\n') ? '\n' : '') + prompt + '\n');
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const getMoodEmoji = (score) => {
    if (score <= 3) return '😢';
    if (score <= 6) return '😐';
    return '😊';
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📔 Digital Journal</h1>
          <p className="text-gray-600">A safe space to explore your thoughts and emotions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <FiPlus size={20} />
          New Entry
        </button>
      </div>

      {/* Statistics */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold">Total Entries</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{entries.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold">Total Words</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {entries.reduce((sum, e) => sum + (e.content ? e.content.split(/\s+/).length : 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold">Average Mood</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {(entries.reduce((sum, e) => sum + (e.moodScoreAtTime || 5), 0) / entries.length).toFixed(1)}/10
            </p>
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

      {/* New Entry Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">✍️ Start Writing</h3>

          {/* Prompts Section */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-3">💡 Writing Prompts (Click to add):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => insertPrompt(prompt)}
                  type="button"
                  className="text-left text-sm bg-blue-200 hover:bg-blue-300 text-blue-900 px-3 py-2 rounded transition font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddEntry} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a meaningful title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Mood Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-semibold">Your Mood (1-10)</label>
                <span className="text-2xl">{getMoodEmoji(moodScore)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(e.target.value)}
                className="w-full h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Terrible</span>
                <span className="font-bold text-blue-600">{moodScore}</span>
                <span>Great</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Thoughts *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely about your day, thoughts, feelings, and experiences..."
                rows="8"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                required
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Words: {wordCount}</span>
                <span>Reading time: ~{readingTime} min</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tags (optional)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., reflection, gratitude, anxiety (comma-separated)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                💾 Save Entry
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

      {/* Search */}
      {entries.length > 0 && (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search entries..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading your journal...</p>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiBook className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {entries.length === 0
              ? 'Your journal is empty. Start writing to begin your journaling journey! ✨'
              : 'No entries match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-semibold">Showing {filteredEntries.length} of {entries.length} entries</p>
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 space-y-3">
              {/* Entry Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {formatDate(entry.createdAt || new Date())}
                    </span>
                    {entry.moodScoreAtTime && (
                      <span>
                        {getMoodEmoji(entry.moodScoreAtTime)} Mood: {entry.moodScoreAtTime}/10
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              {/* Entry Content Preview */}
              <p className="text-gray-700 line-clamp-3 whitespace-pre-wrap">{entry.content}</p>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                {entry.content && (
                  <span>{entry.content.split(/\s+/).length} words • ~{Math.ceil(entry.content.split(/\s+/).length / 200)} min read</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
