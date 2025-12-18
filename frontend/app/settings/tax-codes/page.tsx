'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { TaxCodeData, taxCodesApi } from '@/lib/api/tax-codes';
import AddTaxCodeModal from '@/components/AddTaxCodeModal';

export default function TaxCodesPage() {
  const [taxCodes, setTaxCodes] = useState<TaxCodeData[]>([]);
  const [filteredTaxCodes, setFilteredTaxCodes] = useState<TaxCodeData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaxCode, setEditingTaxCode] = useState<TaxCodeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAppliesTo, setFilterAppliesTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaxCodes();
  }, []);

  useEffect(() => {
    filterTaxCodes();
  }, [taxCodes, searchTerm, filterStatus, filterAppliesTo]);

  const fetchTaxCodes = async () => {
    try {
      const data = await taxCodesApi.getAll();
      setTaxCodes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tax codes:', error);
      setLoading(false);
    }
  };

  const filterTaxCodes = () => {
    let filtered = taxCodes;

    if (searchTerm) {
      filtered = filtered.filter(tc =>
        tc.tax_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.tax_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus === 'Active') {
      filtered = filtered.filter(tc => tc.is_active);
    } else if (filterStatus === 'Inactive') {
      filtered = filtered.filter(tc => !tc.is_active);
    }

    if (filterAppliesTo) {
      if (filterAppliesTo === 'Services') {
        filtered = filtered.filter(tc => tc.applies_to_services);
      } else if (filterAppliesTo === 'Products') {
        filtered = filtered.filter(tc => tc.applies_to_products);
      }
    }

    setFilteredTaxCodes(filtered);
  };

  const handleAddTaxCode = async (formData: any) => {
    try {
      await taxCodesApi.create(formData);
      setIsModalOpen(false);
      fetchTaxCodes();
    } catch (error) {
      console.error('Error creating tax code:', error);
      alert('Failed to create tax code');
    }
  };

  const handleEditTaxCode = async (taxCode: TaxCodeData) => {
    try {
      const fullData = await taxCodesApi.getById(taxCode.id!);
      setEditingTaxCode(fullData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching tax code details:', error);
      alert('Failed to load tax code details');
    }
  };

  const handleUpdateTaxCode = async (formData: any) => {
    if (!editingTaxCode?.id) return;

    try {
      await taxCodesApi.update(editingTaxCode.id, formData);
      setIsEditModalOpen(false);
      setEditingTaxCode(null);
      fetchTaxCodes();
    } catch (error) {
      console.error('Error updating tax code:', error);
      alert('Failed to update tax code');
    }
  };

  const handleDeleteTaxCode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tax code?')) return;

    try {
      await taxCodesApi.delete(id);
      fetchTaxCodes();
    } catch (error) {
      console.error('Error deleting tax code:', error);
      alert('Failed to delete tax code');
    }
  };

  const totalTaxCodes = taxCodes.length;
  const activeTaxCodes = taxCodes.filter(tc => tc.is_active).length;
  const inactiveTaxCodes = totalTaxCodes - activeTaxCodes;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No end date';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tax Codes</h1>
                  <p className="text-gray-600 mt-1">Manage tax rates for billing</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium flex items-center gap-2"
              >
                <span>+</span> New Tax Code
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tax Codes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalTaxCodes}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Tax Codes</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activeTaxCodes}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive Tax Codes</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{inactiveTaxCodes}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search tax codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                value={filterAppliesTo}
                onChange={(e) => setFilterAppliesTo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Applies To (All)</option>
                <option value="Services">Services</option>
                <option value="Products">Products</option>
              </select>
            </div>
          </div>

          {/* Tax Codes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applies To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading tax codes...</td>
                    </tr>
                  ) : filteredTaxCodes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No tax codes found</td>
                    </tr>
                  ) : (
                    filteredTaxCodes.map((taxCode) => (
                      <tr key={taxCode.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-gray-900">{taxCode.tax_code}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taxCode.tax_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {taxCode.tax_rate.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-gray-200 text-gray-800 rounded">
                            {taxCode.country}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {taxCode.applies_to_services && (
                              <span className="px-2 py-1 inline-flex text-xs font-semibold rounded bg-cyan-100 text-cyan-800">
                                Services
                              </span>
                            )}
                            {taxCode.applies_to_products && (
                              <span className="px-2 py-1 inline-flex text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                                Products
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">From: {formatDate(taxCode.effective_from)}</div>
                            <div className="text-xs">{formatDate(taxCode.effective_to)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            taxCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {taxCode.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditTaxCode(taxCode)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title="Edit"
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTaxCode(taxCode.id!)}
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

      <AddTaxCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTaxCode}
      />

      <AddTaxCodeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTaxCode(null);
        }}
        onSave={handleUpdateTaxCode}
        editData={editingTaxCode || undefined}
        isEditMode={true}
      />
    </div>
  );
}
