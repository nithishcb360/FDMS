'use client';

import { useState, useEffect } from 'react';
import DynamicSidebar from '@/components/DynamicSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ServicePackageData, servicePackagesApi } from '@/lib/api/service-packages';
import { ServiceTypeData, serviceTypesApi } from '@/lib/api/service-types';
import AddServicePackageModal from '@/components/AddServicePackageModal';

export default function ServicePackagesPage() {
  const [packages, setPackages] = useState<ServicePackageData[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeData[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<ServicePackageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackageData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, filterServiceType, filterStatus, filterType]);

  const fetchData = async () => {
    try {
      const [packagesData, serviceTypesData] = await Promise.all([
        servicePackagesApi.getAll(),
        serviceTypesApi.getAll()
      ]);
      setPackages(packagesData);
      setServiceTypes(serviceTypesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Service type filter
    if (filterServiceType) {
      filtered = filtered.filter(pkg => pkg.service_type_id?.toString() === filterServiceType);
    }

    // Status filter
    if (filterStatus === 'Active') {
      filtered = filtered.filter(pkg => pkg.is_active);
    } else if (filterStatus === 'Inactive') {
      filtered = filtered.filter(pkg => !pkg.is_active);
    }

    // Type filter (customizable)
    if (filterType === 'Customizable') {
      filtered = filtered.filter(pkg => pkg.is_customizable);
    } else if (filterType === 'Fixed') {
      filtered = filtered.filter(pkg => !pkg.is_customizable);
    }

    setFilteredPackages(filtered);
  };

  const handleAddPackage = async (formData: any) => {
    try {
      await servicePackagesApi.create(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Failed to create package');
    }
  };

  const handleEditPackage = async (pkg: ServicePackageData) => {
    try {
      const fullData = await servicePackagesApi.getById(pkg.id!);
      setEditingPackage(fullData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching package details:', error);
      alert('Failed to load package details');
    }
  };

  const handleUpdatePackage = async (formData: any) => {
    if (!editingPackage?.id) return;

    try {
      await servicePackagesApi.update(editingPackage.id, formData);
      setIsEditModalOpen(false);
      setEditingPackage(null);
      fetchData();
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package');
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await servicePackagesApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package');
    }
  };

  const getServiceTypeName = (serviceTypeId?: number) => {
    if (!serviceTypeId) return 'N/A';
    const serviceType = serviceTypes.find(st => st.id === serviceTypeId);
    return serviceType?.service_type || 'N/A';
  };

  const getIncludedItemsArray = (includedItems?: string) => {
    if (!includedItems) return [];
    return includedItems.split('\n').filter(item => item.trim() !== '');
  };

  // Calculate stats
  const totalPackages = packages.length;
  const activePackages = packages.filter(pkg => pkg.is_active).length;
  const inactivePackages = totalPackages - activePackages;

  return (
    <div className="flex h-screen bg-gray-100">
      <DynamicSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Service Packages</h1>
                  <p className="text-gray-600 mt-1">Manage pre-configured service bundles</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium flex items-center gap-2"
              >
                <span>+</span> New Package
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Packages</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalPackages}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Packages</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activePackages}</p>
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
                  <p className="text-sm text-gray-600">Inactive Packages</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{inactivePackages}</p>
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
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterServiceType}
                onChange={(e) => setFilterServiceType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Service Types</option>
                {serviceTypes.map(st => (
                  <option key={st.id} value={st.id}>{st.service_type}</option>
                ))}
              </select>
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Customizable">Customizable</option>
                <option value="Fixed">Fixed</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterServiceType('');
                  setFilterStatus('');
                  setFilterType('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Filter
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading packages...</div>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">No packages found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{pkg.package_name}</h3>
                      {pkg.is_active && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                        {getServiceTypeName(pkg.service_type_id)}
                      </span>
                      {pkg.is_customizable && (
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded">
                          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                          Customizable
                        </span>
                      )}
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      ${pkg.package_price.toFixed(2)}
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                    )}

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Includes:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {getIncludedItemsArray(pkg.included_items).slice(0, 5).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                        {getIncludedItemsArray(pkg.included_items).length > 5 && (
                          <li className="text-gray-400 italic">
                            + {getIncludedItemsArray(pkg.included_items).length - 5} more items
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id!)}
                        className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Package Modal */}
      <AddServicePackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPackage}
        serviceTypes={serviceTypes}
      />

      {/* Edit Package Modal */}
      <AddServicePackageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPackage(null);
        }}
        onSave={handleUpdatePackage}
        editData={editingPackage || undefined}
        isEditMode={true}
        serviceTypes={serviceTypes}
      />
    </div>
  );
}
