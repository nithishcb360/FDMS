'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { arrangementsApi, ArrangementData, ArrangementStats } from '@/lib/api/arrangements';
import NewArrangementModal from '@/components/NewArrangementModal';
import ViewArrangementModal from '@/components/ViewArrangementModal';
import EditArrangementModal from '@/components/EditArrangementModal';

export default function ServiceArrangementsPage() {
  const [arrangements, setArrangements] = useState<ArrangementData[]>([]);
  const [stats, setStats] = useState<ArrangementStats>({ total: 0, pending_approval: 0, approved: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('All Statuses');
  const [confirmedFilter, setConfirmedFilter] = useState('All');
  const [isNewArrangementModalOpen, setIsNewArrangementModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArrangement, setSelectedArrangement] = useState<ArrangementData | null>(null);

  useEffect(() => {
    fetchArrangements();
    fetchStats();
  }, []);

  const fetchArrangements = async () => {
    try {
      setLoading(true);
      const data = await arrangementsApi.getAll();
      setArrangements(data);
    } catch (error) {
      console.error('Error fetching arrangements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await arrangementsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilter = () => {
    const params: any = {};

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (approvalStatusFilter && approvalStatusFilter !== 'All Statuses') {
      params.approval_status = approvalStatusFilter;
    }

    if (confirmedFilter === 'Yes') {
      params.is_confirmed = true;
    } else if (confirmedFilter === 'No') {
      params.is_confirmed = false;
    }

    arrangementsApi.getAll(params).then(setArrangements);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending Approval':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Service Arrangements</h1>
                <p className="text-gray-600 text-sm mt-1">Manage funeral service planning and arrangements</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Arrangements */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Arrangements</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Approval */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.pending_approval}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.confirmed}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  placeholder="eliz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Approval Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                <select
                  value={approvalStatusFilter}
                  onChange={(e) => setApprovalStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All Statuses</option>
                  <option>Pending Approval</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* Confirmed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmed</label>
                <select
                  value={confirmedFilter}
                  onChange={(e) => setConfirmedFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All</option>
                  <option>Yes</option>
                  <option>No</option>
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
              Showing {arrangements.length > 0 ? 1 : 0} to {arrangements.length} of {arrangements.length} arrangements
            </p>
            <button
              onClick={() => setIsNewArrangementModalOpen(true)}
              style={{ backgroundColor: '#D4AF37' }}
              className="hover:opacity-90 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <span className="text-lg">+</span>
              <span className="text-sm">New Arrangement</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Case</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Service Details</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Venue</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Attendees</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Approval Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Confirmed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading arrangements...
                    </td>
                  </tr>
                ) : arrangements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="text-gray-500 text-sm">No service arrangements found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  arrangements.map((arrangement, index) => (
                    <tr
                      key={arrangement.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === arrangements.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-blue-600">{arrangement.deceased_name}</div>
                        <div className="text-xs text-gray-500">{arrangement.case_number}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{arrangement.service_package || 'N/A'}</div>
                        <div className="text-xs text-gray-600">{formatDate(arrangement.service_date || '')}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{arrangement.venue || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{arrangement.estimated_attendees || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getApprovalStatusColor(arrangement.approval_status || 'Pending Approval')}`}>
                          {arrangement.approval_status || 'Pending Approval'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                          arrangement.is_confirmed
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}>
                          {arrangement.is_confirmed ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedArrangement(arrangement);
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
                              setSelectedArrangement(arrangement);
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
      <NewArrangementModal
        isOpen={isNewArrangementModalOpen}
        onClose={() => setIsNewArrangementModalOpen(false)}
        onArrangementCreated={() => {
          setIsNewArrangementModalOpen(false);
          fetchArrangements();
          fetchStats();
        }}
      />

      <ViewArrangementModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedArrangement(null);
        }}
        arrangementData={selectedArrangement}
      />

      <EditArrangementModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedArrangement(null);
        }}
        arrangementData={selectedArrangement}
        onArrangementUpdated={() => {
          setIsEditModalOpen(false);
          setSelectedArrangement(null);
          fetchArrangements();
          fetchStats();
        }}
      />
    </div>
  );
}
