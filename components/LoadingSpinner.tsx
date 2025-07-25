"use client"

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-sm border border-gray-200">
          <div className="p-6">
            {/* Title Section */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="h-6 bg-cyan-600 rounded w-48 animate-pulse"></div>
            </div>
            
            {/* Loading Content */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
            
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your booking form...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 