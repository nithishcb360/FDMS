'use client';

import { useState, useEffect } from 'react';
import { schedulesApi } from '@/lib/api/schedules';
import { staffApi, StaffData } from '@/lib/api/staff';

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated?: () => void;
}

const SHIFT_TYPES = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
  'Full Day',
];

const STATUS_OPTIONS = [
  'Scheduled',
  'Completed',
  'Cancelled',
  'No Show',
];

export default function NewScheduleModal({ isOpen, onClose, onScheduleCreated }: NewScheduleModalProps) {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [formData, setFormData] = useState({
    staff_member_id: '',
    staff_member_name: '',
    shift_date: '',
    shift_type: '',
    status: 'Scheduled',
    start_time: '',
    end_time: '',
    break_duration: '',
    is_overtime: false,
    is_holiday: false,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  const fetchStaff = async () => {
    try {
      const data = await staffApi.getAll({ status: 'Active' });
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await schedulesApi.create({
        staff_member_id: parseInt(formData.staff_member_id),
        staff_member_name: formData.staff_member_name,
        shift_date: formData.shift_date,
        shift_type: formData.shift_type,
        status: formData.status,
        start_time: formData.start_time,
        end_time: formData.end_time,
        break_duration: formData.break_duration ? parseInt(formData.break_duration) : undefined,
        is_overtime: formData.is_overtime,
        is_holiday: formData.is_holiday,
        notes: formData.notes || undefined,
      });
      alert('Schedule created successfully!');
      setFormData({
        staff_member_id: '',
        staff_member_name: '',
        shift_date: '',
        shift_type: '',
        status: 'Scheduled',
        start_time: '',
        end_time: '',
        break_duration: '',
        is_overtime: false,
        is_holiday: false,
        notes: '',
      });
      onScheduleCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else if (name === 'staff_member_id') {
      // Update both staff_member_id and staff_member_name
      const selectedStaff = staff.find(s => s.id === parseInt(value));
      setFormData({
        ...formData,
        staff_member_id: value,
        staff_member_name: selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Staff Schedule</h2>
              <p className="text-sm text-gray-600">Create a new staff shift schedule</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Staff & Shift Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Staff & Shift Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Member <span className="text-red-500">*</span>
                </label>
                <select
                  name="staff_member_id"
                  value={formData.staff_member_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name} - {member.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="shift_date"
                  value={formData.shift_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="shift_type"
                  value={formData.shift_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {SHIFT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  name="break_duration"
                  value={formData.break_duration}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Additional Options</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_overtime"
                  checked={formData.is_overtime}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Overtime Shift</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_holiday"
                  checked={formData.is_holiday}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Holiday Shift</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this shift..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {submitting ? 'Creating...' : 'Create Schedule'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-medium border border-gray-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
