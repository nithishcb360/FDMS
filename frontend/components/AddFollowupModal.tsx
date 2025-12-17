'use client';

import React, { useState } from 'react';
import { followupsApi, FollowupData } from '@/lib/api/followups';

interface AddFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFollowupAdded: () => void;
}

export default function AddFollowupModal({ isOpen, onClose, onFollowupAdded }: AddFollowupModalProps) {
  const [formData, setFormData] = useState<Partial<FollowupData>>({
    family_id: null,
    case_id: null,
    task_type: '',
    priority: 'Normal',
    title: '',
    description: '',
    assigned_to: null,
    due_date: '',
    reminder_date: null,
    status: 'Pending',
    completed_at: null,
    completion_notes: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: any = {
        family_id: formData.family_id || null,
        case_id: formData.case_id || null,
        task_type: formData.task_type,
        priority: formData.priority || 'Normal',
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date,
        reminder_date: formData.reminder_date || null,
        status: formData.status || 'Pending',
        completed_at: formData.completed_at || null,
        completion_notes: formData.completion_notes || null,
      };

      await followupsApi.create(submitData);
      onFollowupAdded();
      setFormData({
        family_id: null,
        case_id: null,
        task_type: '',
        priority: 'Normal',
        title: '',
        description: '',
        assigned_to: null,
        due_date: '',
        reminder_date: null,
        status: 'Pending',
        completed_at: null,
        completion_notes: null,
      });
    } catch (error) {
      console.error('Error creating followup:', error);
      alert('Failed to create follow-up. Please try again.');
    }
  };

  if (!isOpen) return null;

  const taskTypes = ['Phone Call', 'Email', 'Meeting', 'Document Review', 'Follow-up Visit', 'Payment Reminder', 'Other'];
  const priorities = ['Low', 'Normal', 'High', 'Urgent'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🔔 Add Follow-up
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">Create a new follow-up task</p>

          {/* Task Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Task Information</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Case</label>
                <select
                  value={formData.case_id || ''}
                  onChange={(e) => setFormData({ ...formData, case_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">----------</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.task_type}
                  onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">----------</option>
                  {taskTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Assignment & Dates */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Assignment & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select
                  value={formData.assigned_to || ''}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">----------</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Date</label>
                <input
                  type="date"
                  value={formData.reminder_date || ''}
                  onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Completion */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Completion</h3>
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
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completed At</label>
                <input
                  type="datetime-local"
                  value={formData.completed_at || ''}
                  onChange={(e) => setFormData({ ...formData, completed_at: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Notes</label>
                <textarea
                  value={formData.completion_notes || ''}
                  onChange={(e) => setFormData({ ...formData, completion_notes: e.target.value || null })}
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
              💾 Create Follow-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
