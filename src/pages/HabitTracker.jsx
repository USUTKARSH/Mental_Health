import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';
import { FiPlus, FiTrash2, FiTrendingUp, FiCalendar } from 'react-icons/fi';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [habitType, setHabitType] = useState('exercise');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('minutes');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const habitTypes = [
    { name: 'sleep', unit: 'hours', icon: '😴', target: 8 },
    { name: 'exercise', unit: 'minutes', icon: '🏃', target: 30 },
    { name: 'meditation', unit: 'minutes', icon: '🧘', target: 10 },
    { name: 'water', unit: 'glasses', icon: '💧', target: 8 },
    { name: 'reading', unit: 'pages', icon: '📖', target: 30 },
    { name: 'journaling', unit: 'minutes', icon: '📝', target: 15 },
    { name: 'medication', unit: 'times', icon: '💊', target: 1 },
    { name: 'healthy_food', unit: 'servings', icon: '🥗', target: 5 },
  ];

  useEffect(() => {
    const selected = habitTypes.find(h => h.name === habitType);
    if (selected) setUnit(selected.unit);
    fetchHabits();
  }, [habitType]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/habits');
      setHabits(response.data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!value) {
      setError('Please enter a value');
      return;
    }
    try {
      const response = await axiosInstance.post('/habits', {
        habitType,
        value: parseInt(value),
        unit,
        notes,
      });
      setHabits([response.data, ...habits]);
      setShowForm(false);
      resetForm();
      setSuccess('✅ Habit logged successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to save habit');
    }
  };

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Delete this habit entry?')) {
      try {
        await axiosInstance.delete(`/habits/${id}`);
        setHabits(habits.filter(h => h.id !== id));
        setSuccess('Habit deleted');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting habit:', error);
        setError('Failed to delete habit');
      }
    }
  };

  const resetForm = () => {
    setHabitType('exercise');
    setValue('');
    setNotes('');
    setError('');
  };

  const getIcon = (type) => {
    return habitTypes.find(h => h.name === type)?.icon || '📋';
  };

  const getTarget = (type) => {
    return habitTypes.find(h => h.name === type)?.target || 0;
  };

  // Calculate habit statistics
  const calculateStats = (habitType) => {
    const habitEntries = habits.filter(h => h.habitType === habitType);
    if (habitEntries.length === 0) return { total: 0, average: 0, streak: 0, todayCompleted: false };

    const today = new Date().toDateString();
    const todayEntry = habitEntries.find(h => new Date(h.logDate).toDateString() === today);
    
    return {
      total: habitEntries.length,
      average: (habitEntries.reduce((sum, h) => sum + h.value, 0) / habitEntries.length).toFixed(1),
      streak: calculateStreak(habitEntries),
      todayCompleted: !!todayEntry,
    };
  };

  const calculateStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    const sortedDates = entries
      .map(e => new Date(e.logDate).toDateString())
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of sortedDates) {
      const entryDate = new Date(dateStr);
      if (entryDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (Math.abs(currentDate - entryDate) < 24 * 60 * 60 * 1000) {
        streak++;
        currentDate = new Date(entryDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getUniqueHabits = () => {
    const unique = {};
    habits.forEach(habit => {
      if (!unique[habit.habitType]) {
        unique[habit.habitType] = [];
      }
      unique[habit.habitType].push(habit);
    });
    return unique;
  };

  const uniqueHabits = getUniqueHabits();
  const filteredHabits = selectedFilter === 'all' 
    ? habits 
    : habits.filter(h => h.habitType === selectedFilter);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Habit Tracker</h1>
          <p className="text-gray-600">Build positive habits and track your streaks</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <FiPlus size={20} />
          Log Habit
        </button>
      </div>

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

      {/* Habit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">📊 Log Your Habit</h3>
          
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Habit Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Habit Type *</label>
                <select
                  value={habitType}
                  onChange={(e) => setHabitType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  {habitTypes.map(h => (
                    <option key={h.name} value={h.name}>
                      {h.icon} {h.name.charAt(0).toUpperCase() + h.name.slice(1).replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Daily goal: {getTarget(habitType)} {unit}</p>
              </div>

              {/* Value */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Value ({unit}) *</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel? Any obstacles?"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                💾 Log Habit
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

      {/* Habit Summary Cards */}
      {!loading && Object.keys(uniqueHabits).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(uniqueHabits).map(habitName => {
            const stats = calculateStats(habitName);
            const target = getTarget(habitName);
            const habitTypeObj = habitTypes.find(h => h.name === habitName);
            return (
              <div key={habitName} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl mb-1">{getIcon(habitName)}</p>
                    <p className="font-bold text-gray-800 capitalize">{habitName.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">🔥 {stats.streak}</p>
                    <p className="text-xs text-gray-600">day streak</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-700"><span className="font-semibold">Today:</span> {stats.todayCompleted ? '✅ Completed' : '⏳ Pending'}</p>
                  <p className="text-gray-700"><span className="font-semibold">Average:</span> {stats.average} {habitTypeObj?.unit}</p>
                  <p className="text-gray-700"><span className="font-semibold">Total Logs:</span> {stats.total}</p>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{width: `${Math.min((stats.average / target) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">Goal: {target} {habitTypeObj?.unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && habits.length > 0 && (
        <div className="flex gap-2 flex-wrap overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Habits
          </button>
          {Object.keys(uniqueHabits).map(habitName => (
            <button
              key={habitName}
              onClick={() => setSelectedFilter(habitName)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                selectedFilter === habitName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {getIcon(habitName)} {habitName.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Habits List */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading habits...</p>
      ) : habits.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            No habits logged yet. Start building positive habits today! 🚀
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiTrendingUp size={20} />
            Recent Entries ({filteredHabits.length})
          </h3>
          <div className="space-y-2">
            {filteredHabits.map((habit) => (
              <div key={habit.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between border-l-4 border-blue-500">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getIcon(habit.habitType)}</span>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{habit.habitType.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600">{habit.value} {habit.unit}</p>
                      {habit.notes && (
                        <p className="text-xs text-gray-500 italic">"{habit.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiCalendar size={14} />
                    {formatDate(habit.logDate || new Date())}
                  </p>
                  <button 
                    onClick={() => handleDeleteHabit(habit.id)} 
                    className="mt-2 text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
