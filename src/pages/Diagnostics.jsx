import { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosClient';

export default function Diagnostics() {
  const [status, setStatus] = useState({
    backendReachable: 'checking',
    authTestPassed: 'checking',
    apiEndpoints: {},
    errors: [],
    successMessages: [],
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      backendReachable: false,
      authTestPassed: false,
      apiEndpoints: {},
      errors: [],
      successMessages: [],
    };

    // Test 1: Basic backend connectivity
    try {
      console.log('Testing backend connectivity...');
      const response = await axiosInstance.get('/auth/health', { timeout: 5000 });
      results.backendReachable = true;
      results.successMessages.push('✅ Backend is reachable');
      console.log('Health check passed:', response.data);
    } catch (err) {
      results.errors.push(`❌ Backend health check failed: ${err.message}`);
      console.error('Health check failed:', err);
    }

    // Test 2: Test localStorage and auth setup
    try {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      console.log('Auth token present:', !!token);
      console.log('User data present:', !!user);
      
      if (!token || !user) {
        results.successMessages.push('ℹ️ No auth token - user not logged in (this is expected for new users)');
      } else {
        results.authTestPassed = true;
        results.successMessages.push('✅ Auth token found');
      }
    } catch (err) {
      results.errors.push(`❌ Auth check failed: ${err.message}`);
    }

    // Test 3: Test API endpoints
    const endpoints = [
      { name: 'Analytics Weekly', path: '/analytics/weekly', requiresAuth: true },
      { name: 'Mood Tracker', path: '/mood', requiresAuth: true },
      { name: 'Journal', path: '/journal', requiresAuth: true },
      { name: 'Habits', path: '/habits', requiresAuth: true },
      { name: 'Reminders', path: '/reminders', requiresAuth: true },
    ];

    for (const endpoint of endpoints) {
      try {
        await axiosInstance.get(endpoint.path, { timeout: 3000 });
        results.apiEndpoints[endpoint.name] = '✅ Working';
        console.log(`${endpoint.name} endpoint working`);
      } catch (err) {
        if (endpoint.requiresAuth && err.response?.status === 401) {
          results.apiEndpoints[endpoint.name] = 'ℹ️ Requires authentication';
        } else {
          results.apiEndpoints[endpoint.name] = `❌ ${err.message}`;
          console.error(`${endpoint.name} failed:`, err);
        }
      }
    }

    setStatus(results);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>🔍 Application Diagnostics</h1>

        {/* Backend Status */}
        <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ marginTop: 0, marginBottom: '10px', color: '#333', fontSize: '18px' }}>Backend Status</h2>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            {status.backendReachable === 'checking' ? (
              <span style={{ color: '#666' }}>⏳ Checking backend...</span>
            ) : status.backendReachable ? (
              <span style={{ color: 'green' }}>✅ Backend is reachable</span>
            ) : (
              <span style={{ color: 'red' }}>❌ Backend is not reachable</span>
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            API Base URL: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px' }}>http://localhost:8080/api</code>
          </p>
        </div>

        {/* Success Messages */}
        {status.successMessages.length > 0 && (
          <div style={{ backgroundColor: '#e8f5e9', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #4caf50' }}>
            <h3 style={{ marginTop: 0, color: '#2e7d32' }}>Successful Checks</h3>
            {status.successMessages.map((msg, idx) => (
              <p key={idx} style={{ margin: '5px 0', color: '#2e7d32' }}>{msg}</p>
            ))}
          </div>
        )}

        {/* API Endpoints */}
        <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>API Endpoints</h3>
          {Object.entries(status.apiEndpoints).map(([name, result]) => (
            <div key={name} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <strong>{name}:</strong> <span style={{ marginLeft: '10px' }}>{result}</span>
            </div>
          ))}
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <div style={{ backgroundColor: '#ffebee', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #f44336' }}>
            <h3 style={{ marginTop: 0, color: '#c62828' }}>Errors</h3>
            {status.errors.map((err, idx) => (
              <p key={idx} style={{ margin: '5px 0', color: '#c62828' }}>{err}</p>
            ))}
          </div>
        )}

        {/* Browser Console Info */}
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffc107' }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>Next Steps</h3>
          <ol style={{ color: '#856404' }}>
            <li>Open Developer Console (F12) and check for any JavaScript errors</li>
            <li>Verify backend is running on port 8080</li>
            <li>Check Network tab to see if API requests are being made</li>
            <li>Ensure CORS is properly configured on the backend</li>
            <li>Try refreshing the page (Ctrl+Shift+R or Cmd+Shift+R)</li>
          </ol>
        </div>

        <button 
          onClick={runDiagnostics}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🔄 Re-run Diagnostics
        </button>
      </div>
    </div>
  );
}
