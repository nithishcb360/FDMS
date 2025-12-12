'use client';

import { useState, useEffect } from 'react';
import { arrangementsApi } from '@/lib/api/arrangements';
import { casesApi, CaseData } from '@/lib/api/cases';

interface NewArrangementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArrangementCreated?: () => void;
}

const SERVICE_PACKAGES = [
  'Basic Funeral Package',
  'Traditional Funeral Package',
  'Premium Funeral Package',
  'Cremation Package',
  'Direct Burial Package',
  'Memorial Service Package',
];

const VENUES = [
  'Main Chapel',
  'Main Chapel - Serenity Hall',
  'Church Hall',
  'Heritage Reception Hall',
  'Green Hills Cemetery',
  'Peaceful Passage Crematorium',
];

const RELIGIOUS_RITES = [
  'Christian',
  'Catholic',
  'Jewish',
  'Islamic',
  'Hindu',
  'Buddhist',
  'Non-Religious',
  'Other',
];

export default function NewArrangementModal({ isOpen, onClose, onArrangementCreated }: NewArrangementModalProps) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [formData, setFormData] = useState({
    case_id: '',
    service_package: '',
    service_date: '',
    service_time: '',
    duration_minutes: '120',
    venue: '',
    estimated_attendees: '0',
    religious_rite: '',
    clergy_name: '',
    clergy_contact: '',
    special_requests: '',
    music_preferences: '',
    eulogy_speakers: '',
    package_customized: false,
    customization_notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCases();
    }
  }, [isOpen]);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Combine date and time for service_date
      let service_datetime = null;
      if (formData.service_date) {
        service_datetime = formData.service_date;
        if (formData.service_time) {
          service_datetime += `T${formData.service_time}:00`;
        }
      }

      await arrangementsApi.create({
        case_id: parseInt(formData.case_id),
        service_package: formData.service_package || undefined,
        service_date: service_datetime || undefined,
        service_time: formData.service_time || undefined,
        duration_minutes: parseInt(formData.duration_minutes),
        venue: formData.venue || undefined,
        estimated_attendees: parseInt(formData.estimated_attendees),
        religious_rite: formData.religious_rite || undefined,
        clergy_name: formData.clergy_name || undefined,
        clergy_contact: formData.clergy_contact || undefined,
        special_requests: formData.special_requests || undefined,
        music_preferences: formData.music_preferences || undefined,
        eulogy_speakers: formData.eulogy_speakers || undefined,
        package_customized: formData.package_customized,
        customization_notes: formData.customization_notes || undefined,
      });

      alert('Arrangement created successfully!');
      setFormData({
        case_id: '',
        service_package: '',
        service_date: '',
        service_time: '',
        duration_minutes: '120',
        venue: '',
        estimated_attendees: '0',
        religious_rite: '',
        clergy_name: '',
        clergy_contact: '',
        special_requests: '',
        music_preferences: '',
        eulogy_speakers: '',
        package_customized: false,
        customization_notes: '',
      });
      onArrangementCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating arrangement:', error);
      alert('Failed to create arrangement. Please try again.');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Service Arrangement</h2>
              <p className="text-sm text-gray-600">Plan a new funeral service</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Package</label>
                <select
                  name="service_package"
                  value={formData.service_package}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="service_date"
                  value={formData.service_date}
                  onChange={handleChange}
                  required
                  placeholder="dd-mm-yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="service_time"
                  value={formData.service_time}
                  onChange={handleChange}
                  required
                  placeholder="--:--"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Attendees <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimated_attendees"
                  value={formData.estimated_attendees}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religious Rite</label>
                <select
                  name="religious_rite"
                  value={formData.religious_rite}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {RELIGIOUS_RITES.map((rite) => (
                    <option key={rite} value={rite}>{rite}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clergy Name</label>
                <input
                  type="text"
                  name="clergy_name"
                  value={formData.clergy_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clergy Contact</label>
                <input
                  type="text"
                  name="clergy_contact"
                  value={formData.clergy_contact}
                  onChange={handleChange}
                  placeholder="Phone or Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Music Preferences</label>
              <textarea
                name="music_preferences"
                value={formData.music_preferences}
                onChange={handleChange}
                rows={2}
                placeholder="List of preferred songs or music styles"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eulogy Speakers</label>
              <textarea
                name="eulogy_speakers"
                value={formData.eulogy_speakers}
                onChange={handleChange}
                rows={2}
                placeholder="List of people who will speak"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Customization */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <svg className="w-5 h-5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h3 className="font-semibold text-gray-800">Customization</h3>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="package_customized"
                  checked={formData.package_customized}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-900">Package Customized</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">Check if the selected package has been customized</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customization Notes</label>
              <textarea
                name="customization_notes"
                value={formData.customization_notes}
                onChange={handleChange}
                rows={3}
                placeholder="Describe any changes made to the standard package"
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
            {submitting ? 'Creating...' : 'Create Arrangement'}
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
