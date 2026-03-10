
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6">
                    <div className="text-center max-w-md space-y-6">
                        <div className="text-8xl">😵</div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Don't worry — your progress is saved. Try refreshing the page.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-[#4285F4] text-white rounded-xl font-bold shadow-lg hover:bg-[#1a73e8] transition-colors"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false, error: null });
                                    window.location.href = '/';
                                }}
                                className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Go to Home
                            </button>
                        </div>
                        {this.state.error && (
                            <details className="text-left mt-6">
                                <summary className="text-xs font-bold text-slate-400 cursor-pointer uppercase tracking-widest">
                                    Error Details
                                </summary>
                                <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-red-500 overflow-auto max-h-32">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
