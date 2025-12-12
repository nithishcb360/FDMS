'use client';

import { useState, useEffect } from 'react';
import { casesApi, CaseData } from '@/lib/api/cases';
import { caseNotesApi, CaseNoteData } from '@/lib/api/case-notes';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function AddNoteModal({ isOpen, onClose, onSave }: AddNoteModalProps) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    case_number: '',
    note_type: 'General Note',
    content: '',
    requires_follow_up: false,
    follow_up_date: '',
    is_private: false,
    created_by: 'System Administrator',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCases();
    }
  }, [isOpen]);

  const fetchCases = async () => {
    try {
      setLoadingCases(true);
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoadingCases(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const noteData: CaseNoteData = {
        case_number: formData.case_number,
        note_type: formData.note_type,
        content: formData.content,
        requires_follow_up: formData.requires_follow_up,
        follow_up_date: formData.follow_up_date || undefined,
        is_private: formData.is_private,
        created_by: formData.created_by,
      };

      await caseNotesApi.create(noteData);

      // Reset form
      setFormData({
        case_number: '',
        note_type: 'General Note',
        content: '',
        requires_follow_up: false,
        follow_up_date: '',
        is_private: false,
        created_by: 'System Administrator',
      });

      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Case Note</h2>
              <p className="text-sm text-gray-600">Create a new internal note for a case</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Case & Type Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">📋</span>
              <h3 className="font-semibold text-gray-800">Case & Type</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case <span className="text-red-500">*</span>
                </label>
                <select
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleChange}
                  required
                  disabled={loadingCases}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCases ? 'Loading cases...' : '-- Select Case --'}
                  </option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.case_number}>
                      {caseItem.case_number} - {caseItem.first_name} {caseItem.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="note_type"
                  value={formData.note_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="General Note">General Note</option>
                  <option value="Important">Important</option>
                  <option value="Issue/Problem">Issue/Problem</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Issue Resolved">Issue Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">✍️</span>
              <h3 className="font-semibold text-gray-800">Note Content</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Enter note content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Options Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">⚠️</span>
              <h3 className="font-semibold text-gray-800">Follow-up Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="requires_follow_up"
                  name="requires_follow_up"
                  checked={formData.requires_follow_up}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="requires_follow_up" className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Requires Follow-up</span>
                  <span className="block text-xs text-gray-600">This note requires follow-up action</span>
                </label>
              </div>

              {formData.requires_follow_up && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="dd-mm-yyyy"
                  />
                  <p className="text-xs text-gray-500 mt-1">Target date for follow-up action (optional)</p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <span className="text-lg">🔒</span>
              <h3 className="font-semibold text-gray-800">Privacy Settings</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_private" className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Private Note</span>
                  <span className="block text-xs text-gray-600">Only visible to authorized staff members</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
