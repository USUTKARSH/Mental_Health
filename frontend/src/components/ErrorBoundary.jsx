import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8d7da', minHeight: '100vh' }}>
          <h1 style={{ color: '#721c24' }}>Application Error</h1>
          <p style={{ color: '#721c24', marginTop: '10px' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <details style={{ marginTop: '20px', textAlign: 'left', whiteSpace: 'pre-wrap', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#721c24', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
