'use client';

import React, { useState, useEffect } from 'react';
import { documentTypesApi } from '@/lib/api/document-types';

interface NewDocumentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentTypeCreated?: () => void;
}

const STATUSES = ['Active', 'Inactive'];

export default function NewDocumentTypeModal({ isOpen, onClose, onDocumentTypeCreated }: NewDocumentTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    allowed_extensions: '',
    max_size_mb: '',
    retention_years: '',
    require_signature: false,
    require_approval: false,
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        description: '',
        category: '',
        allowed_extensions: '',
        max_size_mb: '',
        retention_years: '',
        require_signature: false,
        require_approval: false,
        status: 'Active',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await documentTypesApi.create({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        allowed_extensions: formData.allowed_extensions || undefined,
        max_size_mb: formData.max_size_mb ? parseInt(formData.max_size_mb) : undefined,
        retention_years: formData.retention_years ? parseInt(formData.retention_years) : undefined,
        require_signature: formData.require_signature,
        require_approval: formData.require_approval,
        status: formData.status,
      });
      alert('Document type created successfully!');
      onDocumentTypeCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating document type:', error);
      alert(error.response?.data?.detail || 'Failed to create document type');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">New Document Type</h2>
              <p className="text-sm text-gray-500 mt-1">Create a new document type category</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Form Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., FDMS, Contract, Invoice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Financial Records, Legal Documents"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
                />
              </div>

              {/* Status */}
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
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Restrictions Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Restrictions</h3>
                <div className="space-y-4">
                  {/* Allowed Extensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Extensions</label>
                    <input
                      type="text"
                      name="allowed_extensions"
                      value={formData.allowed_extensions}
                      onChange={handleChange}
                      placeholder="e.g., pdf,jpg,doc (comma-separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Max Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Size (MB)</label>
                      <input
                        type="number"
                        name="max_size_mb"
                        value={formData.max_size_mb}
                        onChange={handleChange}
                        placeholder="e.g., 2"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      />
                    </div>

                    {/* Retention */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retention (years)</label>
                      <input
                        type="number"
                        name="retention_years"
                        value={formData.retention_years}
                        onChange={handleChange}
                        placeholder="e.g., 5"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="require_signature"
                    id="require_signature"
                    checked={formData.require_signature}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="require_signature" className="ml-2 text-sm font-medium text-gray-700">
                    Require Signature
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="require_approval"
                    id="require_approval"
                    checked={formData.require_approval}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="require_approval" className="ml-2 text-sm font-medium text-gray-700">
                    Require Approval
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Document Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
