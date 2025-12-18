'use client';

import { useState, useEffect } from 'react';

interface AddReligiousRiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditMode?: boolean;
}

const religionOptions = [
  'Buddhist',
  'Catholic',
  'Hindu',
  'Islamic',
  'Jewish',
  'Non-Religious',
  'Other'
];

export default function AddReligiousRiteModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isEditMode = false,
}: AddReligiousRiteModalProps) {
  const [formData, setFormData] = useState({
    religion: '',
    rite_name: '',
    description: '',
    duration_minutes: '60',
    special_requirements: '',
    is_active: true,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        religion: editData.religion || '',
        rite_name: editData.rite_name || '',
        description: editData.description || '',
        duration_minutes: editData.duration_minutes?.toString() || '60',
        special_requirements: editData.special_requirements || '',
        is_active: editData.is_active !== undefined ? editData.is_active : true,
      });
    } else {
      setFormData({
        religion: '',
        rite_name: '',
        description: '',
        duration_minutes: '60',
        special_requirements: '',
        is_active: true,
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      duration_minutes: parseInt(formData.duration_minutes) || 60,
    };

    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Religious Rite' : 'New Religious Rite'}
              </h2>
              <p className="text-sm text-gray-600">Add a new religious ceremony</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93V2.05c-5.05.5-9 4.76-9 9.95 0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.19-3.95-9.45-9-9.95z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">e.g., Christianity, Islam, Judaism, Hinduism</option>
                  {religionOptions.map(religion => (
                    <option key={religion} value={religion}>{religion}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Name of the religion or faith tradition</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rite Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.rite_name}
                  onChange={(e) => setFormData({ ...formData, rite_name: e.target.value })}
                  placeholder="e.g., Traditional Burial, Cremation Ceremony"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Name of the specific ceremony or rite</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of this religious rite"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Brief description of the ceremony and its significance</p>
              </div>
            </div>
          </div>

          {/* Duration & Requirements */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Duration & Requirements</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-2.5 text-gray-500">minutes</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Typical duration in minutes</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={formData.special_requirements}
                  onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                  placeholder="Any special requirements or customs for this ceremony"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Special customs, items, or procedures required</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <div>
                <label htmlFor="is_active" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Active Religious Rite
                </label>
                <p className="text-xs text-gray-500 mt-1">Available for service planning</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isEditMode ? 'Update Religious Rite' : 'Create Religious Rite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
