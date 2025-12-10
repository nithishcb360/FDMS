'use client';

export default function UpcomingServices() {
  const hasServices = false; // Change to true when you have services data

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200/50">
      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gray-800">Upcoming Services</h2>
      </div>
      <div className="p-6">
        {!hasServices ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-16 h-16 mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z" opacity="0.5"/>
                <path d="M12 11h5v5h-5z" opacity="0.3"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No upcoming services</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Service items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}
