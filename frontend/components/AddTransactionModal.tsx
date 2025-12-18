'use client';

import { useState, useEffect } from 'react';
import { transactionsApi, TransactionData } from '@/lib/api/transactions';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  transaction?: TransactionData | null;
}

export default function AddTransactionModal({ isOpen, onClose, onSave, transaction }: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    transaction_type: 'Income',
    category: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    invoice_id: '',
    payment_id: '',
    reference_number: '',
    account_name: '',
    branch: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        transaction_type: transaction.transaction_type || 'Income',
        category: transaction.category || '',
        amount: transaction.amount?.toString() || '',
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
        description: transaction.description || '',
        invoice_id: transaction.invoice_id?.toString() || '',
        payment_id: transaction.payment_id?.toString() || '',
        reference_number: transaction.reference_number || '',
        account_name: transaction.account_name || '',
        branch: transaction.branch || '',
        notes: transaction.notes || ''
      });
    } else {
      resetForm();
    }
  }, [transaction, isOpen]);

  const resetForm = () => {
    setFormData({
      transaction_type: 'Income',
      category: '',
      amount: '',
      transaction_date: new Date().toISOString().split('T')[0],
      description: '',
      invoice_id: '',
      payment_id: '',
      reference_number: '',
      account_name: '',
      branch: '',
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

    if (!formData.transaction_type) newErrors.transaction_type = 'Transaction type is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.transaction_date) newErrors.transaction_date = 'Transaction date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        transaction_type: formData.transaction_type,
        category: formData.category,
        amount: parseFloat(formData.amount) || 0,
        transaction_date: formData.transaction_date,
        description: formData.description,
        invoice_id: formData.invoice_id ? parseInt(formData.invoice_id) : null,
        payment_id: formData.payment_id ? parseInt(formData.payment_id) : null,
        reference_number: formData.reference_number || null,
        account_name: formData.account_name || null,
        branch: formData.branch || null,
        notes: formData.notes || null
      };

      if (transaction?.id) {
        await transactionsApi.update(transaction.id, submitData);
      } else {
        await transactionsApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const incomeCategories = ['Service Fees', 'Product Sales', 'Other'];
  const expenseCategories = ['Office Supplies', 'Utilities', 'Rent', 'Insurance', 'Maintenance', 'Professional Services', 'Other'];
  const categoryOptions = formData.transaction_type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.transaction_type ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
                {errors.transaction_type && <p className="text-red-500 text-xs mt-1">{errors.transaction_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.category ? 'border-red-500' : 'border-gray-300')}
                >
                  <option value="">---------</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={'w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.amount ? 'border-red-500' : 'border-gray-300')}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.transaction_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.description ? 'border-red-500' : 'border-gray-300')}
                  placeholder="Brief description of the transaction"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Reference Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
                <input
                  type="text"
                  name="invoice_id"
                  value={formData.invoice_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional invoice link"
                />
                <p className="text-xs text-gray-500 mt-1">Optional invoice link</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <input
                  type="text"
                  name="payment_id"
                  value={formData.payment_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional payment link"
                />
                <p className="text-xs text-gray-500 mt-1">Optional payment link</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Account name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">---------</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="Branch A">Branch A</option>
                  <option value="Branch B">Branch B</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Additional Notes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments about this transaction"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              ✖ Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (transaction ? '💾 Update Transaction' : '💾 Record Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
