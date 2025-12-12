'use client';

import { VenueBookingData } from '@/lib/api/venue-bookings';

interface ViewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: VenueBookingData | null;
}

export default function ViewBookingModal({ isOpen, onClose, bookingData }: ViewBookingModalProps) {
  if (!isOpen || !bookingData) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Venue Booking Details</h2>
              <p className="text-sm text-gray-600">View venue reservation information</p>
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
                <p className="text-sm text-gray-900 font-medium">{bookingData.case_number}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Deceased Name</label>
                <p className="text-sm text-gray-900 font-medium">{bookingData.deceased_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                <p className="text-sm text-gray-900">{bookingData.venue}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                  bookingData.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : bookingData.status === 'Tentative'
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {bookingData.status || 'Tentative'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cost</label>
              <p className="text-sm text-gray-900 font-medium">{formatCurrency(bookingData.cost || 0)}</p>
            </div>
          </div>

          {/* Date & Time Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Date & Time Details</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Booking Date</label>
                <p className="text-sm text-gray-900">{formatDate(bookingData.booking_date)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Booking Time</label>
                <p className="text-sm text-gray-900">{bookingData.booking_time || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                <p className="text-sm text-gray-900">{bookingData.duration_hours ? `${bookingData.duration_hours} hours` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Contact Information</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact Person</label>
                <p className="text-sm text-gray-900">{bookingData.contact_person || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact Phone</label>
                <p className="text-sm text-gray-900">{bookingData.contact_phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
                <p className="text-sm text-gray-900 break-all">{bookingData.contact_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Additional Details</h3>
            </div>

            {bookingData.special_requirements && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Special Requirements</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{bookingData.special_requirements}</p>
              </div>
            )}

            {bookingData.setup_notes && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Setup Notes</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{bookingData.setup_notes}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                bookingData.is_paid
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {bookingData.is_paid ? 'Paid' : 'Unpaid'}
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
