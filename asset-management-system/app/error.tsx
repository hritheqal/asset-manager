'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-500 px-6 py-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-white" />
            <h2 className="ml-3 text-xl font-bold text-white">Something went wrong</h2>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 overflow-auto">
              <p className="text-sm font-mono text-red-600">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
