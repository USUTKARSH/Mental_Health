import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import JournalEntry from './pages/JournalEntry';
import HabitTracker from './pages/HabitTracker';
import Analytics from './pages/Analytics';
import Reminders from './pages/Reminders';
import Diagnostics from './pages/Diagnostics';
import './index.css';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function LoadingPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8fafc',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Loading...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>Initializing application</div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = !!localStorage.getItem('authToken');
    console.log('Initial auth state:', hasToken);
    return hasToken;
  });

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    console.log('Initial user:', parsed);
    return parsed;
  });

  const [appReady, setAppReady] = useState(true);

  const login = (token, userData) => {
    console.log('Login called with:', userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    console.log('Logout called');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  console.log('App rendering, isAuthenticated:', isAuthenticated, 'appReady:', appReady);

  if (!appReady) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/diagnostics" element={<Diagnostics />} />

          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/journal" element={<JournalEntry />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
