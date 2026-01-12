'use client';

import { useState, useEffect } from 'react';
import { BranchData } from '@/lib/api/branches';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: BranchData;
  isEditMode?: boolean;
}

export default function AddBranchModal({ isOpen, onClose, onSave, editData, isEditMode = false }: AddBranchModalProps) {
  const [formData, setFormData] = useState({
    branch_name: '',
    branch_code: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    phone: '',
    email: '',
    website: '',
    tax_id: '',
    license_number: '',
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({
          branch_name: editData.branch_name || '',
          branch_code: editData.branch_code || '',
          street_address: editData.street_address || '',
          city: editData.city || '',
          state: editData.state || '',
          zip_code: editData.zip_code || '',
          country: editData.country || 'USA',
          phone: editData.phone || '',
          email: editData.email || '',
          website: editData.website || '',
          tax_id: editData.tax_id || '',
          license_number: editData.license_number || '',
          is_active: editData.is_active !== undefined ? editData.is_active : true,
        });
      } else {
        // Reset form when opening in create mode
        setFormData({
          branch_name: '',
          branch_code: '',
          street_address: '',
          city: '',
          state: '',
          zip_code: '',
          country: 'USA',
          phone: '',
          email: '',
          website: '',
          tax_id: '',
          license_number: '',
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Branch' : 'New Branch'}</h2>
              <p className="text-sm text-gray-500 mt-1">{isEditMode ? 'Update branch location information' : 'Add a new branch location'}</p>
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
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    placeholder="e.g., Downtown Branch"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="branch_code"
                    value={formData.branch_code}
                    onChange={handleChange}
                    placeholder="e.g., NYC01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier (e.g., NYC01)</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <textarea
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    placeholder="Street address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State/Province"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      placeholder="ZIP/Postal code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="USA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="branch@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Business Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    placeholder="Tax ID / EIN"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="License number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <span className="text-sm font-medium text-gray-700">Active Branch</span>
                    <p className="text-xs text-gray-500">Inactive branches won't be available for selection</p>
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
              {isEditMode ? 'Update Branch' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
