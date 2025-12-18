'use client';

import { useState, useEffect } from 'react';
import { schedulesApi, ScheduleData } from '@/lib/api/schedules';
import { staffApi, StaffData } from '@/lib/api/staff';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  schedule?: ScheduleData | null;
}

export default function AddScheduleModal({ isOpen, onClose, onSave, schedule }: AddScheduleModalProps) {
  const [formData, setFormData] = useState({
    staff_member_id: '',
    staff_member_name: '',
    shift_date: '',
    shift_type: '',
    status: 'Scheduled',
    start_time: '',
    end_time: '',
    break_duration: '30',
    is_overtime: false,
    is_holiday: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffApi.getAll({ status: 'Active' });
        setStaffMembers(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  useEffect(() => {
    if (schedule) {
      setFormData({
        staff_member_id: schedule.staff_member_id?.toString() || '',
        staff_member_name: schedule.staff_member_name || '',
        shift_date: schedule.shift_date || '',
        shift_type: schedule.shift_type || '',
        status: schedule.status || 'Scheduled',
        start_time: schedule.start_time || '',
        end_time: schedule.end_time || '',
        break_duration: schedule.break_duration?.toString() || '30',
        is_overtime: schedule.is_overtime || false,
        is_holiday: schedule.is_holiday || false,
        notes: schedule.notes || ''
      });
    } else {
      resetForm();
    }
  }, [schedule, isOpen]);

  const resetForm = () => {
    setFormData({
      staff_member_id: '',
      staff_member_name: '',
      shift_date: '',
      shift_type: '',
      status: 'Scheduled',
      start_time: '',
      end_time: '',
      break_duration: '30',
      is_overtime: false,
      is_holiday: false,
      notes: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'staff_member_name') {
      const selectedStaff = staffMembers.find(s => `${s.first_name} ${s.last_name}` === value);
      setFormData(prev => ({
        ...prev,
        staff_member_id: selectedStaff?.id?.toString() || '',
        staff_member_name: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.staff_member_name.trim()) newErrors.staff_member_name = 'Staff member is required';
    if (!formData.shift_date) newErrors.shift_date = 'Shift date is required';
    if (!formData.shift_type.trim()) newErrors.shift_type = 'Shift type is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        staff_member_id: parseInt(formData.staff_member_id) || 1,
        staff_member_name: formData.staff_member_name,
        shift_date: formData.shift_date,
        shift_type: formData.shift_type,
        status: formData.status,
        start_time: formData.start_time,
        end_time: formData.end_time,
        break_duration: formData.break_duration ? parseInt(formData.break_duration) : 30,
        is_overtime: formData.is_overtime,
        is_holiday: formData.is_holiday,
        notes: formData.notes || null
      };

      if (schedule?.id) {
        await schedulesApi.update(schedule.id, submitData);
      } else {
        await schedulesApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            {schedule ? 'Edit Schedule' : 'New Schedule'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Member <span className="text-red-500">*</span>
                </label>
                <select
                  name="staff_member_name"
                  value={formData.staff_member_name}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.staff_member_name ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="">---------</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={`${staff.first_name} ${staff.last_name}`}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
                </select>
                {errors.staff_member_name && <p className="text-red-500 text-xs mt-1">{errors.staff_member_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="shift_date"
                  value={formData.shift_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.shift_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.shift_date && <p className="text-red-500 text-xs mt-1">{errors.shift_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="shift_type"
                  value={formData.shift_type}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.shift_type ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="">---------</option>
                  <option value="Day Shift">Day Shift</option>
                  <option value="Evening Shift">Evening Shift</option>
                  <option value="Night Shift">Night Shift</option>
                  <option value="On-Call">On-Call</option>
                  <option value="Split Shift">Split Shift</option>
                </select>
                {errors.shift_type && <p className="text-red-500 text-xs mt-1">{errors.shift_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.start_time ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.end_time ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  name="break_duration"
                  value={formData.break_duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
                <p className="text-xs text-gray-500 mt-1">Total break time in minutes</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Designations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_overtime"
                  checked={formData.is_overtime}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Overtime Shift
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_holiday"
                  checked={formData.is_holiday}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Holiday Shift
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Special instructions, coverage arrangements, or other details"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (schedule ? 'Update Schedule' : 'Create Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
