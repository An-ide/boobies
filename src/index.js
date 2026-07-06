import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error);
    console.error('Error info:', errorInfo);
    
    if (error.message.includes('Objects are not valid as a React child')) {
      console.error('Object rendering error detected!');
      console.error('This usually means categories or other data is objects instead of strings.');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          {this.state.error?.message.includes('Objects are not valid as a React child') && (
            <div style={{ background: '#fff3cd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
              <h3>Category Data Issue Detected</h3>
              <p>Your categories data contains objects instead of strings.</p>
              <p>Common fix: Update ProductContext.jsx to extract category names from objects.</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);