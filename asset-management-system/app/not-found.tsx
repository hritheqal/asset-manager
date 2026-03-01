'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
            <Search className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Need help? Contact support at{' '}
            <a href="mailto:support@dbkl.gov.my" className="text-blue-600 hover:underline">
              support@dbkl.gov.my
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
