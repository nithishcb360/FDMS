'use client';

import { useState, useEffect } from 'react';
import { PaymentModeData } from '@/lib/api/payment-modes';

interface AddPaymentModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: PaymentModeData;
  isEditMode?: boolean;
}

export default function AddPaymentModeModal({ isOpen, onClose, onSave, editData, isEditMode = false }: AddPaymentModeModalProps) {
  const [formData, setFormData] = useState({
    payment_method: '',
    display_name: '',
    payment_type: '',
    description: '',
    has_processing_fee: false,
    percentage_fee: 0,
    fixed_fee: 0,
    is_online: false,
    requires_authorization: false,
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({
          payment_method: editData.payment_method || '',
          display_name: editData.display_name || '',
          payment_type: editData.payment_type || '',
          description: editData.description || '',
          has_processing_fee: editData.has_processing_fee || false,
          percentage_fee: editData.percentage_fee || 0,
          fixed_fee: editData.fixed_fee || 0,
          is_online: editData.is_online || false,
          requires_authorization: editData.requires_authorization || false,
          is_active: editData.is_active !== undefined ? editData.is_active : true,
        });
      } else {
        // Reset form when opening in create mode
        setFormData({
          payment_method: '',
          display_name: '',
          payment_type: '',
          description: '',
          has_processing_fee: false,
          percentage_fee: 0,
          fixed_fee: 0,
          is_online: false,
          requires_authorization: false,
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
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Payment Mode' : 'New Payment Mode'}</h2>
              <p className="text-sm text-gray-500 mt-1">{isEditMode ? 'Update payment method details' : 'Add a new payment method'}</p>
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
                    Payment Method Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">---------</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="credit_debit_card">Credit/Debit Card</option>
                    <option value="online_payment">Online Payment</option>
                    <option value="installment_plan">Installment Plan</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select the payment method type</p>
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
                  <p className="text-xs text-gray-500 mt-1">Customer-facing name for this payment method</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  placeholder="Internal payment method identifier"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Internal identifier for this payment method</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description of this payment method"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Detailed description of this payment method</p>
              </div>
            </div>

            {/* Processing Fees */}
            <div className="border-b border-yellow-400 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Processing Fees</h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_processing_fee"
                    checked={formData.has_processing_fee}
                    onChange={handleChange}
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Has Processing Fee</span>
                    <p className="text-xs text-gray-500">Does this payment method have processing fees?</p>
                  </div>
                </label>
              </div>

              {formData.has_processing_fee && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage Fee
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="percentage_fee"
                        value={formData.percentage_fee}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <span className="absolute right-4 top-2.5 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Percentage fee (e.g., 2.5 for 2.5%)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        name="fixed_fee"
                        value={formData.fixed_fee}
                        onChange={handleChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fixed fee amount in dollars</p>
                  </div>
                </div>
              )}

              {formData.has_processing_fee && (formData.percentage_fee > 0 || formData.fixed_fee > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-4">
                  <strong>ℹ️ Note:</strong> If both percentage and fixed fee are set, they will be combined. For example, 2.5% + $0.30 is common for credit card processing.
                </div>
              )}
            </div>

            {/* Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-100 p-1.5 rounded">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_online"
                      checked={formData.is_online}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">🌐 Online Payment</span>
                      <p className="text-xs text-gray-500">Can be processed online</p>
                    </div>
                  </label>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="requires_authorization"
                      checked={formData.requires_authorization}
                      onChange={handleChange}
                      className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">🔒 Requires Authorization</span>
                      <p className="text-xs text-gray-500">Needs approval before processing</p>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">☑️ Active Payment Mode</span>
                      <p className="text-xs text-gray-500">Available for use</p>
                    </div>
                  </label>
                </div>
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
              {isEditMode ? 'Update Payment Mode' : 'Create Payment Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
