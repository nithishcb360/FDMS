'use client';

import { ScheduleData } from '@/lib/api/schedules';

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: ScheduleData | null;
}

export default function ViewScheduleModal({ isOpen, onClose, scheduleData }: ViewScheduleModalProps) {
  if (!isOpen || !scheduleData) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
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
              <h2 className="text-xl font-bold text-gray-800">Schedule Details</h2>
              <p className="text-sm text-gray-600">View service schedule information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Case Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="font-semibold text-gray-800">Event Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Case Number</label>
                <p className="text-sm text-gray-900 font-medium">{scheduleData.case_number}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Deceased Name</label>
                <p className="text-sm text-gray-900 font-medium">{scheduleData.deceased_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label>
                <p className="text-sm text-gray-900">{scheduleData.event_type}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <p className="text-sm text-gray-900">{scheduleData.title}</p>
              </div>
            </div>

            {scheduleData.description && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <p className="text-sm text-gray-900">{scheduleData.description}</p>
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Date & Time</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date & Time</label>
                <p className="text-sm text-gray-900">{formatDateTime(scheduleData.start_datetime)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Date & Time</label>
                <p className="text-sm text-gray-900">{formatDateTime(scheduleData.end_datetime)}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Location</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                <p className="text-sm text-gray-900">{scheduleData.venue || 'N/A'}</p>
              </div>
              {scheduleData.location_details && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Location Details</label>
                  <p className="text-sm text-gray-900">{scheduleData.location_details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Staff & Notes */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Staff & Notes</h3>
            </div>

            {scheduleData.assigned_staff && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Staff</label>
                <p className="text-sm text-gray-900">{scheduleData.assigned_staff}</p>
              </div>
            )}

            {scheduleData.notes && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <p className="text-sm text-gray-900">{scheduleData.notes}</p>
              </div>
            )}

            {scheduleData.setup_notes && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Setup Notes</label>
                <p className="text-sm text-gray-900">{scheduleData.setup_notes}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Status</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Confirmation Status</label>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                scheduleData.confirmation_status
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}>
                {scheduleData.confirmation_status ? 'Yes, Confirmed' : 'Not Confirmed'}
              </span>
            </div>
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
