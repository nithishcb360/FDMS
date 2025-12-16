'use client';

import { useState, useEffect } from 'react';
import { invoicesApi, InvoiceData } from '@/lib/api/invoices';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  invoice?: InvoiceData | null;
}

export default function AddInvoiceModal({ isOpen, onClose, onSave, invoice }: AddInvoiceModalProps) {
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    billing_address: '',
    branch: '',
    case_reference: '',
    service_reference: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'Draft',
    subtotal: '0',
    tax_amount: '0',
    discount_amount: '0',
    total_amount: '0',
    paid_amount: '0',
    balance: '0',
    payment_terms: 'Net 30 days',
    internal_notes: 'Not visible to client',
    client_notes: 'Visible on invoice'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number || '',
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        client_phone: invoice.client_phone || '',
        billing_address: invoice.billing_address || '',
        branch: invoice.branch || '',
        case_reference: invoice.case_reference || '',
        service_reference: invoice.service_reference || '',
        invoice_date: invoice.invoice_date || '',
        due_date: invoice.due_date || '',
        status: invoice.status || 'Draft',
        subtotal: invoice.subtotal?.toString() || '0',
        tax_amount: invoice.tax_amount?.toString() || '0',
        discount_amount: invoice.discount_amount?.toString() || '0',
        total_amount: invoice.total_amount?.toString() || '0',
        paid_amount: invoice.paid_amount?.toString() || '0',
        balance: invoice.balance?.toString() || '0',
        payment_terms: invoice.payment_terms || 'Net 30 days',
        internal_notes: invoice.internal_notes || '',
        client_notes: invoice.client_notes || ''
      });
    } else {
      resetForm();
    }
  }, [invoice, isOpen]);

  const resetForm = () => {
    setFormData({
      invoice_number: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      billing_address: '',
      branch: '',
      case_reference: '',
      service_reference: '',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'Draft',
      subtotal: '0',
      tax_amount: '0',
      discount_amount: '0',
      total_amount: '0',
      paid_amount: '0',
      balance: '0',
      payment_terms: 'Net 30 days',
      internal_notes: 'Not visible to client',
      client_notes: 'Visible on invoice'
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate total and balance
    if (['subtotal', 'tax_amount', 'discount_amount', 'paid_amount'].includes(name)) {
      const newSubtotal = name === 'subtotal' ? parseFloat(value) || 0 : parseFloat(formData.subtotal) || 0;
      const newTax = name === 'tax_amount' ? parseFloat(value) || 0 : parseFloat(formData.tax_amount) || 0;
      const newDiscount = name === 'discount_amount' ? parseFloat(value) || 0 : parseFloat(formData.discount_amount) || 0;
      const newPaid = name === 'paid_amount' ? parseFloat(value) || 0 : parseFloat(formData.paid_amount) || 0;

      const calculatedTotal = newSubtotal + newTax - newDiscount;
      const calculatedBalance = calculatedTotal - newPaid;

      setFormData(prev => ({
        ...prev,
        [name]: value,
        total_amount: calculatedTotal.toFixed(2),
        balance: calculatedBalance.toFixed(2)
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoice_number.trim()) newErrors.invoice_number = 'Invoice number is required';
    if (!formData.client_name.trim()) newErrors.client_name = 'Client name is required';
    if (!formData.invoice_date) newErrors.invoice_date = 'Invoice date is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        invoice_number: formData.invoice_number,
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        billing_address: formData.billing_address || null,
        branch: formData.branch || null,
        case_reference: formData.case_reference || null,
        service_reference: formData.service_reference || null,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        status: formData.status,
        subtotal: parseFloat(formData.subtotal) || 0,
        tax_amount: parseFloat(formData.tax_amount) || 0,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        total_amount: parseFloat(formData.total_amount) || 0,
        paid_amount: parseFloat(formData.paid_amount) || 0,
        balance: parseFloat(formData.balance) || 0,
        payment_terms: formData.payment_terms || null,
        internal_notes: formData.internal_notes || null,
        client_notes: formData.client_notes || null
      };

      if (invoice?.id) {
        await invoicesApi.update(invoice.id, submitData);
      } else {
        await invoicesApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg sticky top-0 z-10">
          <span className="text-2xl">📄</span>
          <h2 className="text-xl font-semibold text-gray-900">
            {invoice ? 'Edit Invoice' : 'New Invoice'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">👤</span>
              <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.client_name ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.client_name && <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
                <input
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
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
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                <textarea
                  name="billing_address"
                  value={formData.billing_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Reference</label>
                <input
                  type="text"
                  name="case_reference"
                  value={formData.case_reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Reference</label>
                <input
                  type="text"
                  name="service_reference"
                  value={formData.service_reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.invoice_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.invoice_date && <p className="text-red-500 text-xs mt-1">{errors.invoice_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.due_date ? 'border-red-500' : 'border-gray-300')}
                />
                {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
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
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💲</span>
              <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtotal <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="tax_amount"
                    value={formData.tax_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_amount"
                    value={formData.discount_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="total_amount"
                    value={formData.total_amount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="paid_amount"
                    value={formData.paid_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="balance"
                    value={formData.balance}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📝</span>
              <h3 className="text-lg font-semibold text-gray-900">Terms & Notes</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  name="internal_notes"
                  value={formData.internal_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Not visible to client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Notes</label>
                <textarea
                  name="client_notes"
                  value={formData.client_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Visible on invoice"
                />
              </div>
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
              {isSubmitting ? 'Saving...' : (invoice ? '💾 Update Invoice' : '💾 Create Invoice')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
