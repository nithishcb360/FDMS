'use client';

export default function RecentActivity() {
  const hasActivity = false; // Change to true when you have activity data

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200/50">
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-5 py-3 flex items-center gap-2 border-b border-cyan-200/50">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
      </div>
      <div className="p-6">
        {!hasActivity ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-16 h-16 mb-3 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Activity items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}
