'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { communicationsApi, CommunicationData, CommunicationStats } from '@/lib/api/communications';
import LogCommunicationModal from '@/components/LogCommunicationModal';

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<CommunicationData[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommunication, setEditingCommunication] = useState<CommunicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadCommunications();
    loadStats();
  }, []);

  const loadCommunications = async () => {
    try {
      const data = await communicationsApi.getAll({
        search: searchTerm || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined
      });
      setCommunications(data);
    } catch (error) {
      console.error('Error loading communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await communicationsApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddNew = () => {
    setEditingCommunication(null);
    setIsModalOpen(true);
  };

  const handleEdit = (communication: CommunicationData) => {
    setEditingCommunication(communication);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this communication?')) {
      try {
        await communicationsApi.delete(id);
        loadCommunications();
        loadStats();
      } catch (error) {
        console.error('Error deleting communication:', error);
        alert('Failed to delete communication');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCommunication(null);
  };

  const handleSave = () => {
    loadCommunications();
    loadStats();
    handleCloseModal();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💬 Communications</h1>
              <p className="text-gray-600 mt-1">Track all family interactions and communications</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-yellow-500 text-slate-900 px-4 py-2.5 rounded-lg hover:bg-yellow-600 font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Log Communication
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <p className="text-gray-600 text-sm">Sent</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-gray-600 text-sm">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="text-gray-600 text-sm">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Family, subject, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="SMS">SMS</option>
                <option value="Meeting">Meeting</option>
                <option value="Letter">Letter</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button
              onClick={loadCommunications}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
            >
              🔍 Filter
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">Showing {communications.length} of {communications.length} communications</p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading communications...</div>
            ) : communications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <span className="text-6xl mb-4">💬</span>
                <p>No communications found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {communications.map((comm) => (
                    <tr key={comm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.family_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{comm.subject || comm.message.substring(0, 50)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comm.direction}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comm.communication_date ? formatDate(comm.communication_date) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${comm.status === 'Delivered' ? 'bg-green-100 text-green-800' : comm.status === 'Sent' ? 'bg-blue-100 text-blue-800' : comm.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {comm.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(comm)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => comm.id && handleDelete(comm.id)}
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

      <LogCommunicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        communication={editingCommunication}
      />
    </div>
  );
}
