'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { serviceAddonsApi, ServiceAddonData, ServiceAddonStats } from '@/lib/api/service-addons';
import NewAddOnModal from '@/components/NewAddOnModal';
import ViewAddOnModal from '@/components/ViewAddOnModal';
import EditAddOnModal from '@/components/EditAddOnModal';

export default function ServiceAddOnsPage() {
  const [addons, setAddons] = useState<ServiceAddonData[]>([]);
  const [stats, setStats] = useState<ServiceAddonStats>({ total: 0, active: 0, categories: 0, avg_price: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isNewAddOnModalOpen, setIsNewAddOnModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddOn, setSelectedAddOn] = useState<ServiceAddonData | null>(null);

  useEffect(() => {
    fetchAddOns();
    fetchStats();
    fetchCategories();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const data = await serviceAddonsApi.getAll();
      setAddons(data);
    } catch (error) {
      console.error('Error fetching add-ons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await serviceAddonsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await serviceAddonsApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilter = () => {
    const params: any = {};

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (categoryFilter && categoryFilter !== 'All Categories') {
      params.category = categoryFilter;
    }

    if (statusFilter && statusFilter !== 'All Statuses') {
      params.status = statusFilter;
    }

    serviceAddonsApi.getAll(params).then(setAddons);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Service Add-ons</h1>
                <p className="text-gray-600 text-sm mt-1">Manage additional services and products</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Add-ons */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Add-ons</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.categories}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Avg. Price */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Price</p>
                  <p className="text-3xl font-bold text-gray-800">${stats.avg_price.toFixed(2)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Add-on name or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All Categories</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Filter Button */}
              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Results and New Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {addons.length > 0 ? 1 : 0} to {addons.length} of {addons.length} add-ons
            </p>
            <button
              onClick={() => setIsNewAddOnModalOpen(true)}
              style={{ backgroundColor: '#D4AF37' }}
              className="hover:opacity-90 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <span className="text-lg">+</span>
              <span className="text-sm">New Add-on</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Add-on Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Stock Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading add-ons...
                    </td>
                  </tr>
                ) : addons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No service add-ons found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  addons.map((addon, index) => (
                    <tr
                      key={addon.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === addons.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                        {addon.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">{addon.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{addon.category || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ${typeof addon.unit_price === 'number' ? addon.unit_price.toFixed(2) : parseFloat(addon.unit_price as any || '0').toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{addon.unit_of_measure || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                          addon.current_stock_quantity === 0 ? 'bg-red-100 text-red-700 border-red-300' :
                          addon.current_stock_quantity && addon.current_stock_quantity <= addon.minimum_stock_level! ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          'bg-green-100 text-green-700 border-green-300'
                        }`}>
                          {addon.current_stock_quantity === 0 ? 'Out of Stock' :
                           addon.current_stock_quantity && addon.current_stock_quantity <= addon.minimum_stock_level! ? 'Low Stock' :
                           'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${addon.is_active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                          {addon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAddOn(addon);
                              setIsViewModalOpen(true);
                            }}
                            title="View"
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAddOn(addon);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit"
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modals */}
      <NewAddOnModal
        isOpen={isNewAddOnModalOpen}
        onClose={() => setIsNewAddOnModalOpen(false)}
        onAddOnCreated={() => {
          setIsNewAddOnModalOpen(false);
          fetchAddOns();
          fetchStats();
          fetchCategories();
        }}
      />

      <ViewAddOnModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAddOn(null);
        }}
        addOn={selectedAddOn}
      />

      <EditAddOnModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAddOn(null);
        }}
        addOn={selectedAddOn}
        onAddOnUpdated={() => {
          setIsEditModalOpen(false);
          setSelectedAddOn(null);
          fetchAddOns();
          fetchStats();
          fetchCategories();
        }}
      />
    </div>
  );
}
