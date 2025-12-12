'use client';

import { ArrangementData } from '@/lib/api/arrangements';

interface ViewArrangementModalProps {
  isOpen: boolean;
  onClose: () => void;
  arrangementData: ArrangementData | null;
}

export default function ViewArrangementModal({ isOpen, onClose, arrangementData }: ViewArrangementModalProps) {
  if (!isOpen || !arrangementData) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Arrangement Details</h2>
              <p className="text-sm text-gray-600">View service arrangement information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Case Number</label>
                <p className="text-sm text-gray-900 font-medium">{arrangementData.case_number}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Deceased Name</label>
                <p className="text-sm text-gray-900 font-medium">{arrangementData.deceased_name}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Service Package</label>
              <p className="text-sm text-gray-900">{arrangementData.service_package || 'N/A'}</p>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Schedule Details</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Service Date</label>
                <p className="text-sm text-gray-900">{formatDate(arrangementData.service_date || '')}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Service Time</label>
                <p className="text-sm text-gray-900">{arrangementData.service_time || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                <p className="text-sm text-gray-900">{arrangementData.duration_minutes ? `${arrangementData.duration_minutes} minutes` : 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                <p className="text-sm text-gray-900">{arrangementData.venue || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Attendees</label>
                <p className="text-sm text-gray-900">{arrangementData.estimated_attendees || 0}</p>
              </div>
            </div>
          </div>

          {/* Religious Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="font-semibold text-gray-800">Religious Details</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Religious Rite</label>
                <p className="text-sm text-gray-900">{arrangementData.religious_rite || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Clergy Name</label>
                <p className="text-sm text-gray-900">{arrangementData.clergy_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Clergy Contact</label>
                <p className="text-sm text-gray-900">{arrangementData.clergy_contact || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <h3 className="font-semibold text-gray-800">Service Preferences</h3>
            </div>

            {arrangementData.special_requests && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Special Requests</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{arrangementData.special_requests}</p>
              </div>
            )}

            {arrangementData.music_preferences && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Music Preferences</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{arrangementData.music_preferences}</p>
              </div>
            )}

            {arrangementData.eulogy_speakers && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Eulogy Speakers</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{arrangementData.eulogy_speakers}</p>
              </div>
            )}
          </div>

          {/* Customization */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h3 className="font-semibold text-gray-800">Customization</h3>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Package Customized</label>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                arrangementData.package_customized
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}>
                {arrangementData.package_customized ? 'Yes' : 'No'}
              </span>
            </div>

            {arrangementData.customization_notes && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customization Notes</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{arrangementData.customization_notes}</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Approval Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                  arrangementData.approval_status === 'Approved'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : arrangementData.approval_status === 'Pending Approval'
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {arrangementData.approval_status || 'Pending Approval'}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirmed</label>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                  arrangementData.is_confirmed
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}>
                  {arrangementData.is_confirmed ? 'Yes' : 'No'}
                </span>
              </div>
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
