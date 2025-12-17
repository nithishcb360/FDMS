'use client';

import { useState, useEffect } from 'react';
import { communicationsApi, CommunicationData } from '@/lib/api/communications';

interface LogCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  communication?: CommunicationData | null;
}

export default function LogCommunicationModal({ isOpen, onClose, onSave, communication }: LogCommunicationModalProps) {
  const [formData, setFormData] = useState({
    family_id: '',
    family_name: '',
    case_id: '',
    case_number: '',
    type: '',
    direction: '',
    status: 'Sent',
    subject: '',
    message: '',
    response: '',
    has_attachments: false,
    attachment_count: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (communication) {
      setFormData({
        family_id: communication.family_id?.toString() || '',
        family_name: communication.family_name || '',
        case_id: communication.case_id?.toString() || '',
        case_number: communication.case_number || '',
        type: communication.type || '',
        direction: communication.direction || '',
        status: communication.status || 'Sent',
        subject: communication.subject || '',
        message: communication.message || '',
        response: communication.response || '',
        has_attachments: communication.has_attachments || false,
        attachment_count: communication.attachment_count?.toString() || '0'
      });
    } else {
      resetForm();
    }
  }, [communication, isOpen]);

  const resetForm = () => {
    setFormData({
      family_id: '',
      family_name: '',
      case_id: '',
      case_number: '',
      type: '',
      direction: '',
      status: 'Sent',
      subject: '',
      message: '',
      response: '',
      has_attachments: false,
      attachment_count: '0'
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.direction) newErrors.direction = 'Direction is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        family_id: formData.family_id ? parseInt(formData.family_id) : null,
        family_name: formData.family_name || null,
        case_id: formData.case_id ? parseInt(formData.case_id) : null,
        case_number: formData.case_number || null,
        type: formData.type,
        direction: formData.direction,
        status: formData.status,
        subject: formData.subject || null,
        message: formData.message,
        response: formData.response || null,
        has_attachments: formData.has_attachments,
        attachment_count: parseInt(formData.attachment_count) || 0
      };

      if (communication?.id) {
        await communicationsApi.update(communication.id, submitData);
      } else {
        await communicationsApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving communication:', error);
      alert('Failed to save communication');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">💬 Log Communication</h2>
          <p className="text-sm text-gray-600">Record a new family interaction</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Communication Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Family</label>
                <input type="text" name="family_name" value={formData.family_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional family link" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case</label>
                <input type="text" name="case_number" value={formData.case_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional case link" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                <select name="type" value={formData.type} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.type ? 'border-red-500' : 'border-gray-300')}>
                  <option value="">---------</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="SMS">SMS</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Letter">Letter</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction <span className="text-red-500">*</span></label>
                <select name="direction" value={formData.direction} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.direction ? 'border-red-500' : 'border-gray-300')}>
                  <option value="">---------</option>
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                </select>
                {errors.direction && <p className="text-red-500 text-xs mt-1">{errors.direction}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Sent">Sent</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Message Content</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.message ? 'border-red-500' : 'border-gray-300')} />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                <textarea name="response" value={formData.response} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📎 Attachments</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" name="has_attachments" checked={formData.has_attachments} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700">Has Attachments</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment Count</label>
                <input type="number" name="attachment_count" value={formData.attachment_count} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" disabled={isSubmitting}>✖ Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '💾 Log Communication'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
