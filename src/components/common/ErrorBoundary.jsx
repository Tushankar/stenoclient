import React from "react";
import { AlertOctagon, RefreshCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] p-6">
          <div className="bg-[var(--color-bg-secondary)] p-8 border border-[var(--color-border)] rounded-lg max-w-md w-full text-center shadow-2xl">
            <AlertOctagon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Something went wrong
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-6 text-left overflow-auto max-h-32 bg-black/20 p-2 rounded">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto bg-red-500/10 text-red-400 border border-red-500/50 px-4 py-2 rounded hover:bg-red-500/20 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
