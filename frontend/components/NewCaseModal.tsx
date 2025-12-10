'use client';

import { useState } from 'react';
import { casesApi, CaseData } from '@/lib/api/cases';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: () => void;
}

// Branch options
const BRANCHES = [
  'Eternal Peace Funeral Home - Brooklyn (BRX01)',
  'Eternal Peace Funeral Home - Main (MAIN01)',
  'Eternal Peace Funeral Home - Queens (QNS01)',
];

// Service Type options
const SERVICE_TYPES = [
  'Traditional Burial Service',
  'Cremation Service',
  'Direct Burial',
  'Direct Cremation',
  'Memorial Service',
  'International Repatriation',
  'Viewing Only',
];

export default function NewCaseModal({ isOpen, onClose, onCaseCreated }: NewCaseModalProps) {
  const [formData, setFormData] = useState<Partial<CaseData>>({
    gender: 'Unknown',
    priority: 'Normal',
    status: 'Intake',
    photo_url: undefined,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await casesApi.create(formData as CaseData);
      alert('Case created successfully!');
      setFormData({
        gender: 'Unknown',
        priority: 'Normal',
        status: 'Intake',
      });
      onCaseCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setPhotoFile(fileInput.files ? fileInput.files[0] : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📁</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Case</h2>
              <p className="text-sm text-gray-600">Create a new funeral case</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Deceased Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">👤</span>
              <h3 className="font-semibold text-gray-800">Deceased Information</h3>
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <span className="text-yellow-500">📷</span>
                Photo of Deceased
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span>ℹ️</span>
                Accepted formats: JPG, PNG, GIF, Max size: 5MB
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Gender and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || 'Unknown'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>Unknown</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-yellow-500">📅</span>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange}
                  placeholder="dd-mm-yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-yellow-500">📅</span>
                  Date of Death <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_death"
                  value={formData.date_of_death || ''}
                  onChange={handleChange}
                  required
                  placeholder="dd-mm-yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Place of Death */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Death <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="place_of_death"
                value={formData.place_of_death || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Cause of Death */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cause of Death</label>
              <textarea
                name="cause_of_death"
                value={formData.cause_of_death || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>
          </div>

          {/* Case Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">📋</span>
              <h3 className="font-semibold text-gray-800">Case Information</h3>
            </div>

            {/* Branch and Service Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">----------</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  name="service_type"
                  value={formData.service_type || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">----------</option>
                  {SERVICE_TYPES.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>{serviceType}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority || 'Normal'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option>Normal</option>
                <option>Urgent</option>
                <option>High Priority</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
              <textarea
                name="internal_notes"
                value={formData.internal_notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <span>🔒</span>
                Internal staff notes - not visible to family
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Create Case
          </button>
          <button
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
