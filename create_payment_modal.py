content = """'use client';

import { useState, useEffect } from 'react';
import { paymentsApi, PaymentData } from '@/lib/api/payments';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  payment?: PaymentData | null;
}

export default function AddPaymentModal({ isOpen, onClose, onSave, payment }: AddPaymentModalProps) {
  const [formData, setFormData] = useState({
    payment_number: '',
    invoice_number: '',
    payer_name: '',
    payment_method: '',
    amount: '0',
    payment_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    status: 'Pending',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (payment) {
      setFormData({
        payment_number: payment.payment_number || '',
        invoice_number: payment.invoice_number || '',
        payer_name: payment.payer_name || '',
        payment_method: payment.payment_method || '',
        amount: payment.amount?.toString() || '0',
        payment_date: payment.payment_date || '',
        reference_number: payment.reference_number || '',
        status: payment.status || 'Pending',
        notes: payment.notes || ''
      });
    } else {
      resetForm();
    }
  }, [payment, isOpen]);

  const resetForm = () => {
    setFormData({
      payment_number: '',
      invoice_number: '',
      payer_name: '',
      payment_method: '',
      amount: '0',
      payment_date: new Date().toISOString().split('T')[0],
      reference_number: '',
      status: 'Pending',
      notes: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.payment_number.trim()) newErrors.payment_number = 'Payment number is required';
    if (!formData.payer_name.trim()) newErrors.payer_name = 'Payer name is required';
    if (!formData.payment_method.trim()) newErrors.payment_method = 'Payment method is required';
    if (!formData.payment_date) newErrors.payment_date = 'Payment date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        payment_number: formData.payment_number,
        invoice_number: formData.invoice_number || null,
        payer_name: formData.payer_name,
        payment_method: formData.payment_method,
        amount: parseFloat(formData.amount) || 0,
        payment_date: formData.payment_date,
        reference_number: formData.reference_number || null,
        status: formData.status,
        notes: formData.notes || null
      };

      if (payment?.id) {
        await paymentsApi.update(payment.id, submitData);
      } else {
        await paymentsApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg sticky top-0 z-10">
          <span className="text-2xl">💳</span>
          <h2 className="text-xl font-semibold text-gray-900">
            {payment ? 'Edit Payment' : 'Record Payment'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💰</span>
              <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice <span className="text-red-500">*</span>
                </label>
                <select
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">---------</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.payment_method ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="">---------</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
                {errors.payment_method && <p className="text-red-500 text-xs mt-1">{errors.payment_method}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={'w-full px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.amount ? 'border-red-500' : 'border-gray-300')}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.payment_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Check #, Transaction ID, etc"
                />
                <p className="text-xs text-gray-500 mt-1">Check #, Transaction ID, etc.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="payer_name"
                  value={formData.payer_name}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.payer_name ? 'border-red-500' : 'border-gray-300')}
                  placeholder="If different from client"
                />
                <p className="text-xs text-gray-500 mt-1">If different from client</p>
                {errors.payer_name && <p className="text-red-500 text-xs mt-1">{errors.payer_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📝</span>
              <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              ✕ Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (payment ? '💾 Update Payment' : '💾 Record Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
"""

with open(r"D:\\FDMS\\frontend\\components\\AddPaymentModal.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("AddPaymentModal created successfully")
