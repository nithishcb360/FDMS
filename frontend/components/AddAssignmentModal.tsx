'use client';

import { useState, useEffect } from 'react';
import { AssignmentData } from '@/lib/api/assignments';
import { casesApi, CaseData } from '@/lib/api/cases';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AssignmentData, 'id' | 'assigned_date' | 'created_at' | 'updated_at'>) => void;
  assignment?: AssignmentData | null;
}

export default function AddAssignmentModal({ isOpen, onClose, onSave, assignment }: AddAssignmentModalProps) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [formData, setFormData] = useState({
    case_number: '',
    staff_member: '',
    role: '',
    instructions: '',
    status: 'Pending',
    completion_notes: '',
    mark_completed: false,
  });

  // Load cases when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCases();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (assignment) {
      setFormData({
        case_number: assignment.case_number,
        staff_member: assignment.staff_member,
        role: assignment.role,
        instructions: assignment.instructions || '',
        status: assignment.status,
        completion_notes: '',
        mark_completed: assignment.status === 'Completed',
      });
    } else {
      setFormData({
        case_number: '',
        staff_member: '',
        role: '',
        instructions: '',
        status: 'Pending',
        completion_notes: '',
        mark_completed: false,
      });
    }
  }, [assignment, isOpen]);

  const loadCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'mark_completed' && checked ? { status: 'Completed' } : {}),
      ...(name === 'mark_completed' && !checked ? { status: 'Pending' } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      case_number: formData.case_number,
      staff_member: formData.staff_member,
      role: formData.role,
      instructions: formData.instructions,
      status: formData.status,
    };
    onSave(submitData);
  };

  if (!isOpen) return null;

  const staffMembers = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'David Wilson',
    'Jessica Martinez',
    'Robert Taylor',
    'Lisa Anderson',
  ];

  const roles = [
    'Funeral Director',
    'Embalmer',
    'Administrative Staff',
    'Transport Coordinator',
    'Memorial Service Coordinator',
    'Grief Counselor',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">👥</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Case Assignment</h2>
              <p className="text-sm text-gray-600">Assign staff to a case</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Case & Staff Assignment */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                <h3 className="text-lg font-semibold text-gray-900">Case & Staff Assignment</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Case */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Case <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="case_number"
                    value={formData.case_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">---------</option>
                    {cases.map((caseItem) => (
                      <option key={caseItem.id} value={caseItem.case_number}>
                        {caseItem.case_number} - {caseItem.first_name} {caseItem.last_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select the case for this assignment</p>
                </div>

                {/* Staff Member */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Staff Member <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="staff_member"
                    value={formData.staff_member}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">---------</option>
                    {staffMembers.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select staff to assign</p>
                </div>
              </div>

              {/* Role */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">---------</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the role for this assignment</p>
              </div>
            </div>

            {/* Section 2: Assignment Instructions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                <h3 className="text-lg font-semibold text-gray-900">Assignment Instructions</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide specific instructions or responsibilities for this assignment"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Provide specific instructions or responsibilities for this assignment</p>
              </div>
            </div>

            {/* Section 3: Completion Status */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                <h3 className="text-lg font-semibold text-gray-900">Completion Status</h3>
              </div>

              {/* Mark as Completed Checkbox */}
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="mark_completed"
                  name="mark_completed"
                  checked={formData.mark_completed}
                  onChange={handleChange}
                  className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="mark_completed" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Mark as Completed
                  </label>
                  <p className="text-xs text-gray-500">Check this box when the assignment has been completed</p>
                </div>
              </div>

              {/* Completion Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Completion Notes
                </label>
                <textarea
                  name="completion_notes"
                  value={formData.completion_notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add notes about the completion of this assignment"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={!formData.mark_completed}
                />
                <p className="text-xs text-gray-500 mt-1">Add notes about the completion of this assignment</p>
              </div>

              {/* Info Note */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
                <span className="text-blue-600 text-lg flex-shrink-0">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> When marking an assignment as completed, please provide completion notes documenting what was accomplished.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium flex items-center gap-2"
              >
                <span>📋</span>
                Create Assignment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
