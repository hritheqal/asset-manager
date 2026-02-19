import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        <p className="text-sm text-gray-400 mt-1">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
