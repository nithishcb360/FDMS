'use client';

import { CaseData } from '@/lib/api/cases';

interface ViewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseData | null;
}

export default function ViewCaseModal({ isOpen, onClose, caseData }: ViewCaseModalProps) {
  if (!isOpen || !caseData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">View Case Details</h2>
                <p className="text-sm text-gray-600">{caseData.case_number}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Deceased Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <span>👤</span>
              Deceased Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900 mt-1">{caseData.first_name} {caseData.middle_name || ''} {caseData.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900 mt-1">{caseData.gender || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900 mt-1">{caseData.date_of_birth ? formatDate(caseData.date_of_birth) : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Death</label>
                <p className="text-gray-900 mt-1">{formatDate(caseData.date_of_death)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Place of Death</label>
                <p className="text-gray-900 mt-1">{caseData.place_of_death}</p>
              </div>
              {caseData.cause_of_death && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Cause of Death</label>
                  <p className="text-gray-900 mt-1">{caseData.cause_of_death}</p>
                </div>
              )}
            </div>
          </div>

          {/* Case Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <span>📋</span>
              Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Branch</label>
                <p className="text-gray-900 mt-1">{caseData.branch}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Service Type</label>
                <p className="text-gray-900 mt-1">{caseData.service_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <p className="text-gray-900 mt-1">{caseData.priority || 'Normal'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1">{caseData.status || 'Intake'}</p>
              </div>
              {caseData.internal_notes && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Internal Notes</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{caseData.internal_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
