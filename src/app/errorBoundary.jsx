// src/app/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or send it to a reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ hasError: true, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI if error occurs
      return (
        <div className="error-screen">
          <h1>Something went wrong.</h1>
          <details>
            <summary>Details</summary>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
