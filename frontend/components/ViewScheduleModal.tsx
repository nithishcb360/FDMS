'use client';

import { ScheduleData } from '@/lib/api/schedules';

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: ScheduleData | null;
}

export default function ViewScheduleModal({ isOpen, onClose, scheduleData }: ViewScheduleModalProps) {
  if (!isOpen || !scheduleData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // timeString is in HH:MM format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Staff Schedule Details</h2>
              <p className="text-sm text-gray-600">View staff shift information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Staff & Shift Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Staff & Shift Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Staff Member</label>
                <p className="text-sm text-gray-900 font-medium">{scheduleData.staff_member_name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Shift Date</label>
                <p className="text-sm text-gray-900 font-medium">{formatDate(scheduleData.shift_date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Shift Type</label>
                <p className="text-sm text-gray-900">{scheduleData.shift_type}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  scheduleData.status === 'Completed'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : scheduleData.status === 'Scheduled'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : scheduleData.status === 'Cancelled'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}>
                  {scheduleData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Time Details</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                <p className="text-sm text-gray-900">{formatTime(scheduleData.start_time)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                <p className="text-sm text-gray-900">{formatTime(scheduleData.end_time)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Break Duration</label>
                <p className="text-sm text-gray-900">{scheduleData.break_duration ? `${scheduleData.break_duration} minutes` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Additional Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">Overtime Shift:</label>
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  scheduleData.is_overtime
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}>
                  {scheduleData.is_overtime ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">Holiday Shift:</label>
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  scheduleData.is_holiday
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}>
                  {scheduleData.is_holiday ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {scheduleData.notes && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <p className="text-sm text-gray-900">{scheduleData.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
