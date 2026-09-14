import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [reminderType, setReminderType] = useState('meditation');
  const [recurring, setRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('DAILY');
  const [scheduledTime, setScheduledTime] = useState('');

  const reminderTypes = [
    'meditation',
    'journal',
    'mood_check',
    'habit_track',
    'medication',
    'exercise',
  ];

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axiosInstance.get('/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/reminders', {
        title,
        message,
        reminderType,
        recurring,
        recurrencePattern: recurring ? recurrencePattern : null,
        scheduledTime: new Date(scheduledTime).toISOString(),
      });
      setReminders([response.data, ...reminders]);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      try {
        await axiosInstance.delete(`/reminders/${id}`);
        setReminders(reminders.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setReminderType('meditation');
    setRecurring(false);
    setRecurrencePattern('DAILY');
    setScheduledTime('');
  };

  const getReminderIcon = (type) => {
    const icons = {
      meditation: '🧘',
      journal: '📝',
      mood_check: '😊',
      habit_track: '📋',
      medication: '💊',
      exercise: '🏃',
    };
    return icons[type] || '🔔';
  };

  const getStatusColor = (sent) => {
    return sent ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          New Reminder
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create Reminder</h3>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Reminder title"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="input-field"
                >
                  {reminderTypes.map(type => (
                    <option key={type} value={type}>
                      {getReminderIcon(type)} {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reminder message"
                rows="3"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Scheduled Time</label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-gray-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Recurring Reminder
                </label>
              </div>
            </div>

            {recurring && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Recurrence Pattern</label>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  className="input-field"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create Reminder</button>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-500 text-lg">No reminders set. Create one now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className={`card border-2 ${getStatusColor(reminder.sent)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getReminderIcon(reminder.reminderType)}</span>
                    <h3 className="text-lg font-bold text-gray-800">{reminder.title}</h3>
                    {reminder.recurring && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {reminder.recurrencePattern}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{reminder.message}</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(reminder.scheduledTime).toLocaleString()}
                  </p>
                  {reminder.sent && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      ✓ Sent at {new Date(reminder.sentAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteReminder(reminder.id)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
