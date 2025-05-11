// /app/create-snippet/loading.js
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8">
        <div className="h-8 w-64 bg-gray-800 animate-pulse rounded mb-6"></div>
        
        <div className="mb-8">
          <div className="h-4 w-full bg-gray-800 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-gray-700">
              <div className="h-32 bg-gray-800 animate-pulse"></div>
              <div className="bg-gray-800 py-2 px-3 text-center">
                <div className="h-4 w-20 bg-gray-700 animate-pulse rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}