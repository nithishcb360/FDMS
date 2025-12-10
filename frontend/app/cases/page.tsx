'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import NewCaseModal from '@/components/NewCaseModal';
import ViewCaseModal from '@/components/ViewCaseModal';
import EditCaseModal from '@/components/EditCaseModal';
import { casesApi, CaseData } from '@/lib/api/cases';

export default function CasesPage() {
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (id: number, caseNumber: string) => {
    if (window.confirm(`Are you sure you want to delete case ${caseNumber}?`)) {
      try {
        await casesApi.delete(id);
        await fetchCases();
        alert(`Case ${caseNumber} deleted successfully`);
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case');
      }
    }
  };

  const handleCaseCreated = () => {
    setIsNewCaseModalOpen(false);
    fetchCases();
  };

  const handleViewCase = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setIsViewModalOpen(true);
  };

  const handleEditCase = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setIsEditModalOpen(true);
  };

  const handleCaseUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedCase(null);
    fetchCases();
  };

  const statuses = [
    'All Statuses',
    'Intake',
    'Planning',
    'In Progress',
    'Completed',
    'Closed',
    'Cancelled'
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const filteredCases = selectedStatus === 'All Statuses'
    ? cases
    : cases.filter(c => c.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Planning':
        return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      case 'Intake':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Closed':
        return 'bg-gray-200 text-gray-600 border-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Urgent':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Normal':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Cases</h1>
            <p className="text-gray-600 text-sm mt-1">Manage all funeral cases</p>
          </div>

          {/* Controls Bar */}
          <div className="mb-6 flex items-center justify-between">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <span className="text-sm text-gray-900">{selectedStatus}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors ${
                        selectedStatus === status ? 'bg-gray-100 font-medium' : ''
                      } ${status === statuses[0] ? 'rounded-t-lg' : ''} ${
                        status === statuses[statuses.length - 1] ? 'rounded-b-lg' : ''
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Case Button */}
            <button
              onClick={() => setIsNewCaseModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span>
              <span className="text-sm font-medium">New Case</span>
            </button>
          </div>

          {/* Cases Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Case #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Deceased Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Date of Death</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Service Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading cases...
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No cases found. Click "New Case" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem, index) => (
                    <tr
                      key={caseItem.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === filteredCases.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{caseItem.case_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{caseItem.first_name} {caseItem.last_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(caseItem.date_of_death)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{caseItem.service_type || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(caseItem.status || 'Intake')}`}>
                          {caseItem.status || 'Intake'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(caseItem.priority || 'Normal')}`}>
                          {caseItem.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            title="View"
                            onClick={() => handleViewCase(caseItem)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            title="Edit"
                            onClick={() => handleEditCase(caseItem)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCase(caseItem.id!, caseItem.case_number!);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <NewCaseModal isOpen={isNewCaseModalOpen} onClose={() => setIsNewCaseModalOpen(false)} onCaseCreated={handleCaseCreated} />
      <ViewCaseModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} caseData={selectedCase} />
      <EditCaseModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} caseData={selectedCase} onCaseUpdated={handleCaseUpdated} />
    </div>
  );
}
