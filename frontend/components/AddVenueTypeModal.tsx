'use client';

import { useState, useEffect } from 'react';

interface AddVenueTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditMode?: boolean;
}

const venueTypeOptions = [
  'Cemetery',
  'Chapel',
  'Church',
  'Crematorium',
  'Function Hall',
  'Other'
];

export default function AddVenueTypeModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isEditMode = false,
}: AddVenueTypeModalProps) {
  const [formData, setFormData] = useState({
    venue_type: '',
    display_name: '',
    location: '',
    max_capacity: '0',
    hourly_rate: '0',
    has_parking: false,
    has_catering: false,
    has_av_equipment: false,
    contact_person: '',
    contact_phone: '',
    is_active: true,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        venue_type: editData.venue_type || '',
        display_name: editData.display_name || '',
        location: editData.location || '',
        max_capacity: editData.max_capacity?.toString() || '0',
        hourly_rate: editData.hourly_rate?.toString() || '0',
        has_parking: editData.has_parking || false,
        has_catering: editData.has_catering || false,
        has_av_equipment: editData.has_av_equipment || false,
        contact_person: editData.contact_person || '',
        contact_phone: editData.contact_phone || '',
        is_active: editData.is_active !== undefined ? editData.is_active : true,
      });
    } else {
      setFormData({
        venue_type: '',
        display_name: '',
        location: '',
        max_capacity: '0',
        hourly_rate: '0',
        has_parking: false,
        has_catering: false,
        has_av_equipment: false,
        contact_person: '',
        contact_phone: '',
        is_active: true,
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      max_capacity: parseInt(formData.max_capacity) || 0,
      hourly_rate: parseFloat(formData.hourly_rate) || 0,
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
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Venue Type' : 'New Venue Type'}
              </h2>
              <p className="text-sm text-gray-600">Add a new service venue</p>
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
                  Venue Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.venue_type}
                  onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">---------</option>
                  {venueTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the type of venue from predefined options</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Display name for customers"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Customer-facing name for this venue</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Address or location description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Full address or location description</p>
              </div>
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Capacity & Pricing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                    placeholder="Maximum number of attendees"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-2.5 text-gray-500">people</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum number of attendees this venue can accommodate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="0"
                    className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-2.5 text-gray-500">/hour</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Hourly rental rate for this venue</p>
              </div>
            </div>
          </div>

          {/* Available Facilities */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Available Facilities</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="has_parking"
                  checked={formData.has_parking}
                  onChange={(e) => setFormData({ ...formData, has_parking: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div>
                  <label htmlFor="has_parking" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Parking Available
                  </label>
                  <p className="text-xs text-gray-500 mt-1">On-site parking facility</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="has_catering"
                  checked={formData.has_catering}
                  onChange={(e) => setFormData({ ...formData, has_catering: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div>
                  <label htmlFor="has_catering" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                    </svg>
                    Catering Services
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Food & beverage service</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="has_av_equipment"
                  checked={formData.has_av_equipment}
                  onChange={(e) => setFormData({ ...formData, has_av_equipment: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div>
                  <label htmlFor="has_av_equipment" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z" />
                    </svg>
                    A/V Equipment
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Audio/Visual systems</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-100 p-1.5 rounded">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Contact person name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Primary contact at this venue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Phone number for booking inquiries</p>
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
                  Active Venue
                </label>
                <p className="text-xs text-gray-500 mt-1">Available for booking</p>
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
              {isEditMode ? 'Update Venue' : 'Create Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
