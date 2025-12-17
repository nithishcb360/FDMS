'use client';

import React, { useState } from 'react';
import { preneedsApi, PreneedData } from '@/lib/api/preneeds';

interface AddPreneedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreneedAdded: () => void;
}

export default function AddPreneedModal({ isOpen, onClose, onPreneedAdded }: AddPreneedModalProps) {
  const [formData, setFormData] = useState<Partial<PreneedData>>({
    family_id: null,
    plan_holder_name: '',
    date_of_birth: '',
    relationship_to_primary: '',
    service_type: '',
    package: '',
    service_preferences: {},
    estimated_cost: 0,
    amount_paid: 0,
    payment_plan: 'Full Payment',
    status: 'Active',
    contract_document: null,
    special_instructions: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse service preferences JSON
      let servicePrefs = null;
      if (formData.service_preferences && typeof formData.service_preferences === 'string') {
        try {
          servicePrefs = JSON.parse(formData.service_preferences);
        } catch {
          servicePrefs = formData.service_preferences;
        }
      }

      const submitData: any = {
        family_id: formData.family_id || null,
        plan_holder_name: formData.plan_holder_name,
        date_of_birth: formData.date_of_birth,
        relationship_to_primary: formData.relationship_to_primary || null,
        service_type: formData.service_type,
        package: formData.package,
        service_preferences: servicePrefs,
        estimated_cost: formData.estimated_cost,
        amount_paid: formData.amount_paid || 0,
        payment_plan: formData.payment_plan,
        status: formData.status || 'Active',
        contract_document: formData.contract_document || null,
        special_instructions: formData.special_instructions || null,
        notes: formData.notes || null,
      };

      await preneedsApi.create(submitData);
      onPreneedAdded();
      setFormData({
        family_id: null,
        plan_holder_name: '',
        date_of_birth: '',
        relationship_to_primary: '',
        service_type: '',
        package: '',
        service_preferences: {},
        estimated_cost: 0,
        amount_paid: 0,
        payment_plan: 'Full Payment',
        status: 'Active',
        contract_document: null,
        special_instructions: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating preneed:', error);
      alert('Failed to create pre-need plan. Please try again.');
    }
  };

  if (!isOpen) return null;

  const serviceTypes = ['Burial', 'Cremation', 'Memorial Service', 'Direct Burial', 'Direct Cremation', 'Green Burial'];
  const paymentPlans = ['Full Payment', 'Monthly', 'Quarterly', 'Annual'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📋 New Pre-need Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">Create advance funeral arrangement</p>

          {/* Plan Holder Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Plan Holder Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.family_id || ''}
                  onChange={(e) => setFormData({ ...formData, family_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">----------</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.plan_holder_name}
                  onChange={(e) => setFormData({ ...formData, plan_holder_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Primary Contact</label>
                <input
                  type="text"
                  value={formData.relationship_to_primary}
                  onChange={(e) => setFormData({ ...formData, relationship_to_primary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Service Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">----------</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">----------</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Preferences</label>
                <textarea
                  value={typeof formData.service_preferences === 'string' ? formData.service_preferences : JSON.stringify(formData.service_preferences || {})}
                  onChange={(e) => setFormData({ ...formData, service_preferences: e.target.value })}
                  rows={3}
                  placeholder="{}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Enter preferences as JSON: {}</p>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💵 Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Plan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.payment_plan}
                  onChange={(e) => setFormData({ ...formData, payment_plan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {paymentPlans.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Document</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, contract_document: e.target.files?.[0]?.name || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={formData.special_instructions}
                  onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              ✕ Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              💾 Create Pre-need Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
