'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { staffApi, StaffData, StaffStats } from '@/lib/api/staff';
import AddStaffModal from '@/components/AddStaffModal';
import EditStaffModal from '@/components/EditStaffModal';
import ViewStaffModal from '@/components/ViewStaffModal';

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffData[]>([]);
  const [stats, setStats] = useState<StaffStats>({
    total_staff: 0,
    active_staff: 0,
    full_time: 0,
    part_time: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [branchFilter, setBranchFilter] = useState('All Branches');

  // Load staff
  useEffect(() => {
    loadStaff();
    loadStats();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffApi.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await staffApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = staff;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter !== 'All Departments') {
      filtered = filtered.filter(member => member.department === departmentFilter);
    }

    // Employment type filter
    if (employmentTypeFilter !== 'All Types') {
      filtered = filtered.filter(member => member.employment_type === employmentTypeFilter);
    }

    // Status filter
    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Branch filter
    if (branchFilter !== 'All Branches') {
      filtered = filtered.filter(member => member.branch === branchFilter);
    }

    setFilteredStaff(filtered);
  }, [searchQuery, departmentFilter, employmentTypeFilter, statusFilter, branchFilter, staff]);

  // Filter options
  const departmentOptions = ['All Departments', ...Array.from(new Set(staff.map(s => s.department)))];
  const employmentTypeOptions = ['All Types', 'Full-Time', 'Part-Time', 'Contract'];
  const statusOptions = ['All Statuses', 'Active', 'Inactive', 'On Leave'];
  const branchOptions = ['All Branches', ...Array.from(new Set(staff.map(s => s.branch).filter(Boolean)))];

  const handleAddStaff = () => {
    setIsAddModalOpen(true);
  };

  const handleEditStaff = (member: StaffData) => {
    setSelectedStaff(member);
    setIsEditModalOpen(true);
  };

  const handleViewStaff = (member: StaffData) => {
    setSelectedStaff(member);
    setIsViewModalOpen(true);
  };

  const handleDeleteStaff = async (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffApi.delete(id);
        loadStaff();
        loadStats();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = async () => {
    await loadStaff();
    await loadStats();
    handleCloseModal();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('All Departments');
    setEmploymentTypeFilter('All Types');
    setStatusFilter('All Statuses');
    setBranchFilter('All Branches');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
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
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👥</span>
                <h1 className="text-2xl font-bold text-gray-900">Staff Members</h1>
              </div>
              <p className="text-gray-600 text-sm">Manage employee information and records</p>
            </div>
            <button
              onClick={handleAddStaff}
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
            >
              <span>+</span>
              Add Staff Member
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Staff</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total_staff}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Staff</div>
                <div className="text-2xl font-bold text-green-600">{stats.active_staff}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Full-Time</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.full_time}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Part-Time</div>
                <div className="text-2xl font-bold text-gray-600">{stats.part_time}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name, ID, email, position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employmentTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {branchOptions.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredStaff.length} of {stats.total_staff} staff members
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Staff Table */}
          {filteredStaff.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Employment Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.employee_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {member.first_name} {member.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{member.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{member.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{member.employment_type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.branch || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleViewStaff(member)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="text-green-600 hover:text-green-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => member.id && handleDeleteStaff(member.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="flex justify-center mb-4">
                <span className="text-6xl text-gray-300">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
              <button
                onClick={handleAddStaff}
                className="mt-4 px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-2"
              >
                <span>+</span>
                Add First Staff Member
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStaff}
      />
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStaff}
        staff={selectedStaff}
      />
      <ViewStaffModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        staff={selectedStaff}
      />
    </div>
  );
}
