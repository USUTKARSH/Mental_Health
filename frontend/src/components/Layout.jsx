import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FiHome, FiHeart, FiBook, FiActivity, FiBarChart2, FiBell, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiHeart, label: 'Mood Tracker', path: '/mood' },
    { icon: FiBook, label: 'Journal', path: '/journal' },
    { icon: FiActivity, label: 'Habits', path: '/habits' },
    { icon: FiBarChart2, label: 'Analytics', path: '/analytics' },
    { icon: FiBell, label: 'Reminders', path: '/reminders' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`fixed md:static w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white h-screen overflow-y-auto transition-transform z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">MindCare</h1>
          <p className="text-blue-100 text-sm">AI-Powered Mental Health</p>
        </div>

        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition mb-2"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-500">
          <div className="bg-blue-500 rounded-lg p-3 mb-3">
            <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-blue-100">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="font-bold">MindCare</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
