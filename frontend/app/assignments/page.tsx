'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { assignmentsApi, AssignmentData } from '@/lib/api/assignments';
import AddAssignmentModal from '@/components/AddAssignmentModal';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentData | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [caseFilter, setCaseFilter] = useState('All Cases');

  // Load assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await assignmentsApi.getAll();
      setAssignments(data);
      setFilteredAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(assignment =>
        assignment.staff_member.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter(assignment => assignment.role === roleFilter);
    }

    // Case filter
    if (caseFilter !== 'All Cases') {
      filtered = filtered.filter(assignment => assignment.case_number === caseFilter);
    }

    setFilteredAssignments(filtered);
  }, [searchQuery, statusFilter, roleFilter, caseFilter, assignments]);

  // Stats calculations
  const totalAssignments = assignments.length;
  const pendingCount = assignments.filter(a => a.status === 'Pending').length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;
  const activeStaffCount = new Set(assignments.map(a => a.staff_member)).size;

  // Fixed filter options
  const statusOptions = ['All Statuses', 'Pending', 'Completed'];
  const roleOptions = ['All Roles', 'Primary Director', 'Assistant', 'Embalmer', 'Driver', 'Coordinator', 'Other'];
  const uniqueCases = ['All Cases', ...Array.from(new Set(assignments.map(a => a.case_number)))];

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: AssignmentData) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = async (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentsApi.delete(id);
        loadAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSaveAssignment = async (data: Omit<AssignmentData, 'id' | 'assigned_date' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingAssignment?.id) {
        await assignmentsApi.update(editingAssignment.id, data);
      } else {
        await assignmentsApi.create(data);
      }
      loadAssignments();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setRoleFilter('All Roles');
    setCaseFilter('All Cases');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👥</span>
              <h1 className="text-2xl font-bold text-gray-900">Case Assignments</h1>
            </div>
            <p className="text-gray-600 text-sm">Manage staff assignments and responsibilities</p>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Assignments</div>
            <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Active Staff</div>
            <div className="text-2xl font-bold text-blue-600">{activeStaffCount}</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search staff, case, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueCases.map(caseNum => (
                <option key={caseNum} value={caseNum}>{caseNum}</option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredAssignments.length} of {totalAssignments} assignments
            </p>
            <button
              onClick={handleAddAssignment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Assignment
            </button>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Assigned Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Instructions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.case_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.staff_member}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {assignment.assigned_date ? new Date(assignment.assigned_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {assignment.instructions ? (
                      <span className="truncate max-w-xs block">{assignment.instructions}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => assignment.id && handleDeleteAssignment(assignment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No assignments found
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Add/Edit Assignment Modal */}
      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAssignment}
        assignment={editingAssignment}
      />
    </div>
  );
}
