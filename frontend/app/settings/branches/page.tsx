'use client';

import { useState, useEffect } from 'react';
import DynamicSidebar from '@/components/DynamicSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { BranchData, branchesApi } from '@/lib/api/branches';
import AddBranchModal from '@/components/AddBranchModal';

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<BranchData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    filterBranches();
  }, [branches, searchTerm, filterStatus]);

  const fetchBranches = async () => {
    try {
      const data = await branchesApi.getAll();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setLoading(false);
    }
  };

  const filterBranches = () => {
    let filtered = branches;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.branch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.city && branch.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus === 'Active') {
      filtered = filtered.filter(branch => branch.is_active);
    } else if (filterStatus === 'Inactive') {
      filtered = filtered.filter(branch => !branch.is_active);
    }

    setFilteredBranches(filtered);
  };

  const handleAddBranch = async (formData: any) => {
    try {
      await branchesApi.create(formData);
      setIsModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error('Error creating branch:', error);
      alert('Failed to create branch');
    }
  };

  const handleEditBranch = async (branch: BranchData) => {
    try {
      const fullData = await branchesApi.getById(branch.id!);
      setEditingBranch(fullData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching branch details:', error);
      alert('Failed to load branch details');
    }
  };

  const handleUpdateBranch = async (formData: any) => {
    if (!editingBranch?.id) return;

    try {
      await branchesApi.update(editingBranch.id, formData);
      setIsEditModalOpen(false);
      setEditingBranch(null);
      fetchBranches();
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Failed to update branch');
    }
  };

  const handleDeleteBranch = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      await branchesApi.delete(id);
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch');
    }
  };

  // Calculate stats
  const totalBranches = branches.length;
  const activeBranches = branches.filter(branch => branch.is_active).length;
  const inactiveBranches = totalBranches - activeBranches;

  return (
    <div className="flex h-screen bg-gray-100">
      <DynamicSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 p-2 rounded">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
                <p className="text-gray-600 mt-1">Manage funeral home branches and locations</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Branches</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalBranches}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Branches</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activeBranches}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive Branches</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{inactiveBranches}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, code, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus(''); }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Apply Filters
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium whitespace-nowrap"
              >
                + New Branch
              </button>
            </div>
          </div>

          {/* Branches Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Loading branches...
                      </td>
                    </tr>
                  ) : filteredBranches.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No branches found
                      </td>
                    </tr>
                  ) : (
                    filteredBranches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 p-2 rounded mr-3">
                              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{branch.branch_name}</div>
                              {branch.license_number && (
                                <div className="text-xs text-gray-500">License: {branch.license_number}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-gray-800 text-white rounded">
                            {branch.branch_code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            {branch.city && branch.state ? `${branch.city}, ${branch.state}` : branch.city || branch.state || '-'}
                          </div>
                          <div className="text-xs text-gray-400">{branch.country || 'USA'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col gap-1">
                            {branch.email && (
                              <a href={`mailto:${branch.email}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {branch.email}
                              </a>
                            )}
                            {branch.phone && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {branch.phone}
                              </div>
                            )}
                            {!branch.email && !branch.phone && '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            branch.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {branch.is_active ? '✓ Active' : '✗ Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditBranch(branch)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title="Edit"
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Branch Modal */}
      <AddBranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddBranch}
      />

      {/* Edit Branch Modal */}
      <AddBranchModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBranch(null);
        }}
        onSave={handleUpdateBranch}
        editData={editingBranch || undefined}
        isEditMode={true}
      />
    </div>
  );
}
