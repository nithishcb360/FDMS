'use client';

import { useState, useEffect } from 'react';
import { timeLogsApi, TimeLogData } from '@/lib/api/timeLogs';
import { staffApi, StaffData } from '@/lib/api/staff';

interface AddTimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  timeLog?: TimeLogData | null;
}

export default function AddTimeLogModal({ isOpen, onClose, onSave, timeLog }: AddTimeLogModalProps) {
  const [formData, setFormData] = useState({
    staff_member_id: '',
    staff_member_name: '',
    log_date: '',
    log_type: '',
    related_schedule_id: '',
    clock_in: '',
    clock_out: '',
    break_duration: '0',
    hours_worked: '0',
    status: 'Pending Approval',
    hourly_rate: '',
    total_pay: '',
    is_overtime: false,
    is_holiday_pay: false,
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
    if (timeLog) {
      setFormData({
        staff_member_id: timeLog.staff_member_id?.toString() || '',
        staff_member_name: timeLog.staff_member_name || '',
        log_date: timeLog.log_date || '',
        log_type: timeLog.log_type || '',
        related_schedule_id: timeLog.related_schedule_id?.toString() || '',
        clock_in: timeLog.clock_in?.substring(0, 16) || '',
        clock_out: timeLog.clock_out?.substring(0, 16) || '',
        break_duration: timeLog.break_duration?.toString() || '0',
        hours_worked: timeLog.hours_worked?.toString() || '0',
        status: timeLog.status || 'Pending Approval',
        hourly_rate: timeLog.hourly_rate?.toString() || '',
        total_pay: timeLog.total_pay?.toString() || '',
        is_overtime: timeLog.is_overtime || false,
        is_holiday_pay: timeLog.is_holiday_pay || false,
        notes: timeLog.notes || ''
      });
    } else {
      resetForm();
    }
  }, [timeLog, isOpen]);

  const resetForm = () => {
    setFormData({
      staff_member_id: '',
      staff_member_name: '',
      log_date: '',
      log_type: '',
      related_schedule_id: '',
      clock_in: '',
      clock_out: '',
      break_duration: '0',
      hours_worked: '0',
      status: 'Pending Approval',
      hourly_rate: '',
      total_pay: '',
      is_overtime: false,
      is_holiday_pay: false,
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
    if (!formData.log_date) newErrors.log_date = 'Log date is required';
    if (!formData.log_type.trim()) newErrors.log_type = 'Log type is required';
    if (!formData.clock_in) newErrors.clock_in = 'Clock in time is required';

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
        log_date: formData.log_date,
        log_type: formData.log_type,
        related_schedule_id: formData.related_schedule_id ? parseInt(formData.related_schedule_id) : undefined,
        clock_in: formData.clock_in,
        clock_out: formData.clock_out || undefined,
        break_duration: parseInt(formData.break_duration) || 0,
        hours_worked: parseFloat(formData.hours_worked) || 0,
        status: formData.status,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        total_pay: formData.total_pay ? parseFloat(formData.total_pay) : undefined,
        is_overtime: formData.is_overtime,
        is_holiday_pay: formData.is_holiday_pay,
        notes: formData.notes || undefined
      };

      if (timeLog?.id) {
        await timeLogsApi.update(timeLog.id, submitData);
      } else {
        await timeLogsApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving time log:', error);
      alert('Failed to save time log. Please try again.');
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            {timeLog ? 'Edit Time Log' : 'New Time Log'}
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
                  Log Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="log_date"
                  value={formData.log_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.log_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.log_date && <p className="text-red-500 text-xs mt-1">{errors.log_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Log Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="log_type"
                  value={formData.log_type}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.log_type ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="">---------</option>
                  <option value="Regular">Regular</option>
                  <option value="Overtime">Overtime</option>
                  <option value="Holiday">Holiday</option>
                  <option value="On-Call">On-Call</option>
                </select>
                {errors.log_type && <p className="text-red-500 text-xs mt-1">{errors.log_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Schedule
                </label>
                <select
                  name="related_schedule_id"
                  value={formData.related_schedule_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">---------</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Optional link to schedule</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock In <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="clock_in"
                  value={formData.clock_in}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.clock_in ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.clock_in && <p className="text-red-500 text-xs mt-1">{errors.clock_in}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock Out
                </label>
                <input
                  type="datetime-local"
                  name="clock_out"
                  value={formData.clock_out}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if still working</p>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Worked <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="hours_worked"
                  value={formData.hours_worked}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Total hours excluding breaks</p>
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
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay & Compensation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Rate per hour for this entry</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Pay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="total_pay"
                    value={formData.total_pay}
                    onChange={handleChange}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_overtime"
                  checked={formData.is_overtime}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Overtime Hours
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_holiday_pay"
                  checked={formData.is_holiday_pay}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Holiday Pay
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
                placeholder="Tasks performed, exceptions, or other relevant information"
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
              {isSubmitting ? 'Saving...' : (timeLog ? 'Update Time Log' : 'Create Time Log')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
