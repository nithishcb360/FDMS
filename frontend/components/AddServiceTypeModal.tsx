'use client';

import { useState, useEffect } from 'react';
import { ServiceTypeData } from '@/lib/api/service-types';

interface AddServiceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: ServiceTypeData;
  isEditMode?: boolean;
}

export default function AddServiceTypeModal({ isOpen, onClose, onSave, editData, isEditMode = false }: AddServiceTypeModalProps) {
  const [formData, setFormData] = useState({
    service_type: 'Burial',
    display_name: '',
    description: '',
    base_price: 0,
    estimated_duration: 2,
    requires_venue: false,
    requires_vehicle: false,
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({
          service_type: editData.service_type || 'Burial',
          display_name: editData.display_name || '',
          description: editData.description || '',
          base_price: editData.base_price || 0,
          estimated_duration: editData.estimated_duration || 2,
          requires_venue: editData.requires_venue || false,
          requires_vehicle: editData.requires_vehicle || false,
          is_active: editData.is_active !== undefined ? editData.is_active : true,
        });
      } else {
        // Reset form when opening in create mode
        setFormData({
          service_type: 'Burial',
          display_name: '',
          description: '',
          base_price: 0,
          estimated_duration: 2,
          requires_venue: false,
          requires_vehicle: false,
          is_active: true,
        });
      }
    }
  }, [isOpen, isEditMode, editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Service Type' : 'New Service Type'}</h2>
              <p className="text-sm text-gray-500 mt-1">{isEditMode ? 'Update service type information' : 'Add a new type of funeral service'}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-180px)]">
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">---------</option>
                    <option value="Burial">Burial</option>
                    <option value="Cremation">Cremation</option>
                    <option value="Memorial">Memorial</option>
                    <option value="Viewing">Viewing</option>
                    <option value="Graveside">Graveside</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select the type of service from predefined options</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    placeholder="Display name for customers"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Customer-facing name for this service</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of this service type"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Detailed description of this service type</p>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Pricing & Duration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    $ Base Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Starting price for this service type (can be customized per package)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🕐 Estimated Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="estimated_duration"
                      value={formData.estimated_duration}
                      onChange={handleChange}
                      placeholder="2"
                      min="1"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                    <span className="text-gray-600 font-medium">hours</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Typical duration for this type of service</p>
                </div>
              </div>
            </div>

            {/* Service Requirements */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Service Requirements</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="requires_venue"
                      checked={formData.requires_venue}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Requires Venue</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">Check if this service type needs a venue booking</p>
                    </div>
                  </label>
                </div>

                <div className="bg-cyan-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="requires_vehicle"
                      checked={formData.requires_vehicle}
                      onChange={handleChange}
                      className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Requires Vehicle</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">Check if this service type needs a vehicle assignment</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Active Service Type</span>
                    <p className="text-xs text-gray-500">Inactive service types won't be available for selection in new arrangements</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              {isEditMode ? 'Update Service Type' : 'Create Service Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
