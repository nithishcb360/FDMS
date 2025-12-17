'use client';

import { StaffData } from '@/lib/api/staff';

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffData | null;
}

export default function ViewStaffModal({ isOpen, onClose, staff }: ViewStaffModalProps) {
  if (!isOpen || !staff) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Staff Member Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Header with Name and Status */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {staff.first_name} {staff.last_name}
                </h3>
                <p className="text-gray-600 text-lg">{staff.position}</p>
                <p className="text-gray-500 text-sm">{staff.department}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(staff.status)}`}>
                {staff.status}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="text-base font-medium text-gray-900">{staff.employee_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-medium text-gray-900">
                  <a href={`mailto:${staff.email}`} className="text-blue-600 hover:underline">
                    {staff.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-base font-medium text-gray-900">
                  {staff.phone ? (
                    <a href={`tel:${staff.phone}`} className="text-blue-600 hover:underline">
                      {staff.phone}
                    </a>
                  ) : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="text-base font-medium text-gray-900">{formatDate(staff.date_of_birth)}</p>
              </div>
              {staff.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-base font-medium text-gray-900">{staff.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-base font-medium text-gray-900">{staff.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="text-base font-medium text-gray-900">{staff.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="text-base font-medium text-gray-900">{staff.employment_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Branch</p>
                <p className="text-base font-medium text-gray-900">{staff.branch || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hire Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(staff.hire_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Termination Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(staff.termination_date)}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {(staff.emergency_contact_name || staff.emergency_contact_phone) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contact Name</p>
                  <p className="text-base font-medium text-gray-900">{staff.emergency_contact_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Phone</p>
                  <p className="text-base font-medium text-gray-900">
                    {staff.emergency_contact_phone ? (
                      <a href={`tel:${staff.emergency_contact_phone}`} className="text-blue-600 hover:underline">
                        {staff.emergency_contact_phone}
                      </a>
                    ) : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Qualifications */}
          {staff.qualifications && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h4>
              <p className="text-base text-gray-700 whitespace-pre-wrap">{staff.qualifications}</p>
            </div>
          )}

          {/* Notes */}
          {staff.notes && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-base text-gray-700 whitespace-pre-wrap">{staff.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="text-gray-900">
                  {staff.created_at ? new Date(staff.created_at).toLocaleString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900">
                  {staff.updated_at ? new Date(staff.updated_at).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
