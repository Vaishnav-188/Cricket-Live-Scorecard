import React, { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Pavilion Live unhandled error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#f8fafc', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#10b981', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>PAVILION LIVE</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '420px', marginBottom: '16px' }}>
            We encountered a temporary display issue loading the live score centre.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            Reload Match Centre
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);

