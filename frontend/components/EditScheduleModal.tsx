'use client';

import { useState, useEffect } from 'react';
import { schedulesApi, ScheduleData } from '@/lib/api/schedules';
import { casesApi, CaseData } from '@/lib/api/cases';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: ScheduleData | null;
  onScheduleUpdated?: () => void;
}

const EVENT_TYPES = [
  'Reception',
  'Burial',
  'Viewing/Visitation',
  'Preparation',
  'Memorial Service',
  'Other Event',
];

const VENUES = [
  'Main Chapel',
  'Main Chapel - Serenity Hall',
  'Church Hall',
  'Heritage Reception Hall',
  'Green Hills Cemetery',
  'Peaceful Passage Crematorium',
];

const STAFF_MEMBERS = [
  'nithish.kumar (nithish.kumar@cloudberry360.com)',
];

export default function EditScheduleModal({ isOpen, onClose, scheduleData, onScheduleUpdated }: EditScheduleModalProps) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [formData, setFormData] = useState({
    case_id: '',
    event_type: '',
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    venue: '',
    location_details: '',
    assigned_staff: [] as string[],
    notes: '',
    setup_notes: '',
    confirmation_status: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && scheduleData) {
      fetchCases();
      // Format datetime for input fields
      const formatForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      // Parse assigned staff from comma-separated string
      const staffArray = scheduleData.assigned_staff ? scheduleData.assigned_staff.split(', ') : [];

      setFormData({
        case_id: scheduleData.case_id.toString(),
        event_type: scheduleData.event_type,
        title: scheduleData.title,
        description: scheduleData.description || '',
        start_datetime: formatForInput(scheduleData.start_datetime),
        end_datetime: formatForInput(scheduleData.end_datetime),
        venue: scheduleData.venue || '',
        location_details: scheduleData.location_details || '',
        assigned_staff: staffArray,
        notes: scheduleData.notes || '',
        setup_notes: scheduleData.setup_notes || '',
        confirmation_status: scheduleData.confirmation_status || false,
      });
    }
  }, [isOpen, scheduleData]);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  if (!isOpen || !scheduleData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await schedulesApi.update(scheduleData.id!, {
        case_id: parseInt(formData.case_id),
        event_type: formData.event_type,
        title: formData.title,
        description: formData.description || undefined,
        start_datetime: formData.start_datetime,
        end_datetime: formData.end_datetime,
        venue: formData.venue || undefined,
        location_details: formData.location_details || undefined,
        assigned_staff: formData.assigned_staff.join(', ') || undefined,
        notes: formData.notes || undefined,
        setup_notes: formData.setup_notes || undefined,
        confirmation_status: formData.confirmation_status,
      });
      alert('Schedule updated successfully!');
      onScheduleUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, assigned_staff: selected });
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
              <h2 className="text-xl font-bold text-gray-800">Edit Service Schedule</h2>
              <p className="text-sm text-gray-600">Update service event information</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Event Details Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="font-semibold text-gray-800">Event Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case <span className="text-red-500">*</span>
                </label>
                <select
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.case_number} - {caseItem.first_name} {caseItem.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Memorial Service"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Service description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Date & Time</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="start_datetime"
                  value={formData.start_datetime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Location</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="">---------</option>
                {VENUES.map((venue) => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
              <textarea
                name="location_details"
                value={formData.location_details}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, City&#10;Specific location if not using a venue"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Staff & Notes Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Staff & Notes</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Staff</label>
              <select
                name="assigned_staff"
                value={formData.assigned_staff}
                onChange={handleStaffChange}
                multiple
                size={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                {STAFF_MEMBERS.map((staff) => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple staff members</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="General notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setup Notes</label>
              <textarea
                name="setup_notes"
                value={formData.setup_notes}
                onChange={handleChange}
                placeholder="Setup instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Status Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Status</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmation_status"
                    checked={formData.confirmation_status === true}
                    onChange={() => setFormData({ ...formData, confirmation_status: true })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-900">Yes, Confirmed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmation_status"
                    checked={formData.confirmation_status === false}
                    onChange={() => setFormData({ ...formData, confirmation_status: false })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-900">Not Confirmed</span>
                </label>
              </div>
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
            {submitting ? 'Updating...' : 'Update Schedule'}
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
