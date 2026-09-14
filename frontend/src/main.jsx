import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

console.log('Mounting React app...');
const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (!rootElement) {
  throw new Error('Root element (#root) not found in HTML');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('React app mounted successfully');
