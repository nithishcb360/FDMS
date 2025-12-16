'use client';

import { useState, useEffect } from 'react';
import { expensesApi, ExpenseData } from '@/lib/api/expenses';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  expense?: ExpenseData | null;
}

export default function AddExpenseModal({ isOpen, onClose, onSave, expense }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    category: '',
    branch: '',
    description: '',
    amount: '',
    expense_date: '',
    due_date: '',
    vendor_name: '',
    vendor_reference: '',
    payment_method: '',
    check_number: '',
    status: 'Pending',
    is_tax_deductible: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || '',
        branch: expense.branch || '',
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        expense_date: expense.expense_date || '',
        due_date: expense.due_date || '',
        vendor_name: expense.vendor_name || '',
        vendor_reference: expense.vendor_reference || '',
        payment_method: expense.payment_method || '',
        check_number: expense.check_number || '',
        status: expense.status || 'Pending',
        is_tax_deductible: expense.is_tax_deductible || false,
        notes: expense.notes || ''
      });
    } else {
      resetForm();
    }
  }, [expense, isOpen]);

  const resetForm = () => {
    setFormData({
      category: '',
      branch: '',
      description: '',
      amount: '',
      expense_date: '',
      due_date: '',
      vendor_name: '',
      vendor_reference: '',
      payment_method: '',
      check_number: '',
      status: 'Pending',
      is_tax_deductible: false,
      notes: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.expense_date) newErrors.expense_date = 'Expense date is required';
    if (!formData.vendor_name.trim()) newErrors.vendor_name = 'Vendor name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        category: formData.category,
        branch: formData.branch || null,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        expense_date: formData.expense_date,
        due_date: formData.due_date || null,
        vendor_name: formData.vendor_name,
        vendor_reference: formData.vendor_reference || null,
        payment_method: formData.payment_method || null,
        check_number: formData.check_number || null,
        status: formData.status,
        is_tax_deductible: formData.is_tax_deductible,
        notes: formData.notes || null
      };

      if (expense?.id) {
        await expensesApi.update(expense.id, submitData);
      } else {
        await expensesApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            {expense ? 'Edit Expense' : 'New Expense'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Branch name"
                />
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
                  placeholder="Brief description of the expense"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.amount ? 'border-red-500' : 'border-gray-300')}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expense_date"
                  value={formData.expense_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.expense_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.expense_date && <p className="text-red-500 text-xs mt-1">{errors.expense_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.vendor_name ? 'border-red-500' : 'border-gray-300')}
                  placeholder="Vendor name"
                />
                {errors.vendor_name && <p className="text-red-500 text-xs mt-1">{errors.vendor_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Reference</label>
                <input
                  type="text"
                  name="vendor_reference"
                  value={formData.vendor_reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Invoice/PO number"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">---------</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Number</label>
                <input
                  type="text"
                  name="check_number"
                  value={formData.check_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Check number (if applicable)"
                />
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
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_tax_deductible"
                    checked={formData.is_tax_deductible}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Tax Deductible Expense
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments about this expense"
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (expense ? 'Update Expense' : 'Create Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
