import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('greendc_sim_state_v1');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-emerald-500/30 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-lg font-extrabold text-white">Something went wrong</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected render issue occurred. Click the button below to restore default configuration and continue.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-amber-300 text-left overflow-x-auto max-h-24">
              {this.state.error?.message || 'Unknown render error'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Restore & Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
