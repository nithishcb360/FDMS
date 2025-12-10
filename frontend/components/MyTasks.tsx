'use client';

export default function MyTasks() {
  const hasTasks = false; // Change to true when you have tasks data

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200/50">
      <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gray-800">My Tasks</h2>
      </div>
      <div className="p-6">
        {!hasTasks ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-16 h-16 mb-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No pending tasks</p>
            <p className="text-xs text-gray-400 mt-1">🎉 You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Task items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}
