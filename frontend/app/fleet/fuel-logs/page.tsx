'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { fuelLogsApi, FuelLogData, FuelLogStats } from '@/lib/api/fuel-logs';
import { vehiclesApi, VehicleData } from '@/lib/api/vehicles';
import NewFuelLogModal from '@/components/NewFuelLogModal';
import ViewFuelLogModal from '@/components/ViewFuelLogModal';
import EditFuelLogModal from '@/components/EditFuelLogModal';

export default function FuelLogsPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLogData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [stats, setStats] = useState<FuelLogStats>({
    total_logs: 0,
    total_fuel: 0,
    total_cost: 0,
    avg_mpg: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('All Types');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFuelLogId, setSelectedFuelLogId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [searchQuery, fuelTypeFilter, vehicleFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsData, statsData, typesData, vehiclesData] = await Promise.all([
        fuelLogsApi.getAll({
          search: searchQuery || undefined,
          fuel_type: fuelTypeFilter !== 'All Types' ? fuelTypeFilter : undefined,
          vehicle_id: vehicleFilter !== 'All Vehicles' ? parseInt(vehicleFilter) : undefined,
        }),
        fuelLogsApi.getStats(),
        fuelLogsApi.getFuelTypes(),
        vehiclesApi.getAll(),
      ]);

      setFuelLogs(logsData);
      setStats(statsData);
      setFuelTypes(typesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading fuel logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    setSelectedFuelLogId(id);
    setShowViewModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedFuelLogId(id);
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fuel log?')) return;

    try {
      await fuelLogsApi.delete(id);
      alert('Fuel log deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting fuel log:', error);
      alert('Failed to delete fuel log');
    }
  };

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return { name: 'Unknown', plate: 'N/A' };
    return {
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      plate: vehicle.license_plate,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.137 1.616.91 1.95l1.513.656a1 1 0 00.734.056L9.5 15.5v-1.323l-2.89-1.445A.996.996 0 015 13.274zm9.5 1.446A3.989 3.989 0 0013 12V8.777l-2 1v3.446l1.762.881a1 1 0 00.738-.034l1.5-.75z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Fuel Logs</h1>
                  <p className="text-sm text-gray-600">Track fuel consumption and efficiency</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewModal(true)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Log
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Logs</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.total_logs}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Fuel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Fuel</p>
                  <p className="text-4xl font-bold text-cyan-600">{stats.total_fuel.toFixed(1)} gal</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.137 1.616.91 1.95l1.513.656a1 1 0 00.734.056L9.5 15.5v-1.323l-2.89-1.445A.996.996 0 015 13.274zm9.5 1.446A3.989 3.989 0 0013 12V8.777l-2 1v3.446l1.762.881a1 1 0 00.738-.034l1.5-.75z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Cost</p>
                  <p className="text-4xl font-bold text-yellow-600">${stats.total_cost.toFixed(2)}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Avg MPG */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Avg MPG</p>
                  <p className="text-4xl font-bold text-green-600">{stats.avg_mpg.toFixed(1)}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ID, vehicle, station..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={fuelTypeFilter}
                  onChange={(e) => setFuelTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-gray-900 transition-colors bg-white"
                >
                  <option value="All Types">All Types</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-gray-900 transition-colors bg-white"
                >
                  <option value="All Vehicles">All Vehicles</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Empty State or Table */}
          {fuelLogs.length === 0 && !loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-20 text-center">
              <div className="max-w-sm mx-auto">
                <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.137 1.616.91 1.95l1.513.656a1 1 0 00.734.056L9.5 15.5v-1.323l-2.89-1.445A.996.996 0 015 13.274zm9.5 1.446A3.989 3.989 0 0013 12V8.777l-2 1v3.446l1.762.881a1 1 0 00.738-.034l1.5-.75z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No fuel logs found</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first fuel log entry.</p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Log
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Log ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Station</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fuel Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MPG</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
                          <p className="text-gray-600 mt-4">Loading fuel logs...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    fuelLogs.map((log) => {
                      const vehicleInfo = getVehicleInfo(log.vehicle_id);
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">#{log.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">{vehicleInfo.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 font-mono uppercase">{vehicleInfo.plate}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{formatDate(log.date)}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{log.station || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{log.fuel_type}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{log.quantity} gal</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">${log.cost}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{log.mpg || '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                title="View"
                                onClick={() => handleView(log.id!)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                title="Edit"
                                onClick={() => handleEdit(log.id!)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                title="Delete"
                                onClick={() => handleDelete(log.id!)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <NewFuelLogModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onFuelLogCreated={loadData}
      />

      <ViewFuelLogModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        fuelLogId={selectedFuelLogId}
      />

      <EditFuelLogModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        fuelLogId={selectedFuelLogId}
        onFuelLogUpdated={loadData}
      />
    </div>
  );
}
