'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { familiesApi, FamilyData, FamilyStats } from '@/lib/api/families';
import AddFamilyModal from '@/components/AddFamilyModal';

export default function FamiliesPage() {
  const [families, setFamilies] = useState<FamilyData[]>([]);
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadFamilies();
    loadStats();
  }, []);

  const loadFamilies = async () => {
    try {
      const data = await familiesApi.getAll({
        search: searchTerm || undefined,
        status: statusFilter || undefined
      });
      setFamilies(data);
    } catch (error) {
      console.error('Error loading families:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await familiesApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddNew = () => {
    setEditingFamily(null);
    setIsModalOpen(true);
  };

  const handleEdit = (family: FamilyData) => {
    setEditingFamily(family);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this family?')) {
      try {
        await familiesApi.delete(id);
        loadFamilies();
        loadStats();
      } catch (error) {
        console.error('Error deleting family:', error);
        alert('Failed to delete family');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFamily(null);
  };

  const handleSaveFamily = () => {
    loadFamilies();
    loadStats();
    handleCloseModal();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👨‍👩‍👧‍👦 Families</h1>
              <p className="text-gray-600 mt-1">Manage family contacts and CRM records</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-yellow-500 text-slate-900 px-4 py-2.5 rounded-lg hover:bg-yellow-600 font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Family
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <div>
                    <p className="text-gray-600 text-sm">Total Families</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_families}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-gray-600 text-sm">Active Families</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active_families}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💲</span>
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${stats.total_revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-gray-600 text-sm">Avg Lifetime Value</p>
                    <p className="text-2xl font-bold text-blue-600">${stats.avg_lifetime_value.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={loadFamilies}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
            >
              🔍 Filter
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">Showing {families.length} of {families.length} families</p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading families...</div>
            ) : families.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <span className="text-6xl mb-4">👨‍👩‍👧‍👦</span>
                <p>No families found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cases</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lifetime Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {families.map((family) => (
                    <tr key={family.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {family.family_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {family.primary_contact_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{family.email}</div>
                        <div className="text-xs">{family.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {family.city}, {family.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {family.total_cases || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${(family.lifetime_value || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${family.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {family.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(family)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => family.id && handleDelete(family.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <AddFamilyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFamily}
        family={editingFamily}
      />
    </div>
  );
}
