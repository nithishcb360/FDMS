'use client';

import { CaseData } from '@/lib/api/cases';

interface ViewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseData | null;
  onEdit?: () => void;
}

export default function ViewCaseModal({ isOpen, onClose, caseData, onEdit }: ViewCaseModalProps) {
  if (!isOpen || !caseData) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Intake':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Normal':
        return 'bg-gray-600';
      case 'Low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Case {caseData.case_number}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {caseData.first_name} {caseData.middle_name ? caseData.middle_name + ' ' : ''}{caseData.last_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Deceased Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Deceased Information Section */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <span className="text-xl">👤</span>
                  <h3 className="font-semibold text-gray-900 text-base">Deceased Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium text-sm">
                      {caseData.first_name} {caseData.middle_name ? caseData.middle_name + ' ' : ''}{caseData.last_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 text-sm">{caseData.gender || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-gray-900 text-sm">{formatDate(caseData.date_of_birth)}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date of Death</label>
                    <p className="text-gray-900 text-sm">{formatDate(caseData.date_of_death)}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Place of Death</label>
                    <p className="text-gray-900 text-sm">{caseData.place_of_death || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cause of Death</label>
                    <p className="text-gray-900 text-sm">{caseData.cause_of_death || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <span className="text-xl">📝</span>
                  <h3 className="font-semibold text-gray-900 text-base">Internal Notes</h3>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded p-3">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {caseData.internal_notes || 'No notes available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Case Details */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-5 bg-white sticky top-24">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <span className="text-xl">ℹ️</span>
                  <h3 className="font-semibold text-gray-900 text-base">Case Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
                    <span className={`inline-block px-3 py-1 rounded text-white text-xs font-medium ${getStatusColor(caseData.status)}`}>
                      {caseData.status || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Priority</label>
                    <span className={`inline-block px-3 py-1 rounded text-white text-xs font-medium ${getPriorityColor(caseData.priority)}`}>
                      {caseData.priority || 'Normal'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Service Type</label>
                    <p className="text-gray-900 text-sm">{caseData.service_type || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
                    <p className="text-gray-900 text-sm">{caseData.branch || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
                    <p className="text-gray-700 text-xs">
                      {formatDateTime(caseData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
