'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { timeLogsApi, TimeLogData, TimeLogStats } from '@/lib/api/timeLogs';
import AddTimeLogModal from '@/components/AddTimeLogModal';
import { staffApi, StaffData } from '@/lib/api/staff';

export default function TimeLogsPage() {
  const [timeLogs, setTimeLogs] = useState<TimeLogData[]>([]);
  const [stats, setStats] = useState<TimeLogStats | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTimeLog, setEditingTimeLog] = useState<TimeLogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('');
  const [staffMemberFilter, setStaffMemberFilter] = useState('');
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);

  useEffect(() => {
    loadTimeLogs();
    loadStats();
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffApi.getAll({ status: 'Active' });
      setStaffMembers(data);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const loadTimeLogs = async () => {
    try {
      const data = await timeLogsApi.getAll({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        log_type: logTypeFilter || undefined,
        staff_member: staffMemberFilter || undefined
      });
      setTimeLogs(data);
    } catch (error) {
      console.error('Error loading time logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await timeLogsApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddNew = () => {
    setEditingTimeLog(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (timeLog: TimeLogData) => {
    setEditingTimeLog(timeLog);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this time log?')) {
      try {
        await timeLogsApi.delete(id);
        loadTimeLogs();
        loadStats();
      } catch (error) {
        console.error('Error deleting time log:', error);
        alert('Failed to delete time log');
      }
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTimeLog(null);
  };

  const handleSaveTimeLog = () => {
    loadTimeLogs();
    loadStats();
    handleCloseModal();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Time Logs</h1>
              <p className="text-gray-600 mt-1">Track staff work hours and time entries</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-slate-700 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Time Log
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Total Logs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_logs}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total_hours.toFixed(1)}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Total Pay</p>
                  <p className="text-2xl font-bold text-green-600">${stats.total_pay.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Overtime Hours</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.overtime_hours.toFixed(1)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search staff, log type..."
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
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={logTypeFilter}
                onChange={(e) => setLogTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Regular">Regular</option>
                <option value="Overtime">Overtime</option>
                <option value="Holiday">Holiday</option>
                <option value="On-Call">On-Call</option>
              </select>
              <select
                value={staffMemberFilter}
                onChange={(e) => setStaffMemberFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Staff</option>
                {staffMembers.map(staff => (
                  <option key={staff.id} value={`${staff.first_name} ${staff.last_name}`}>
                    {staff.first_name} {staff.last_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={loadTimeLogs}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
            >
              Search
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Log ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      Loading time logs...
                    </td>
                  </tr>
                ) : timeLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <p className="text-gray-500 font-medium">No time logs found</p>
                    </td>
                  </tr>
                ) : (
                  timeLogs.map((timeLog) => (
                    <tr key={timeLog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{timeLog.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {timeLog.staff_member_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(timeLog.log_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {timeLog.log_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="text-xs">
                          <div>In: {formatDateTime(timeLog.clock_in)}</div>
                          {timeLog.clock_out && <div>Out: {formatDateTime(timeLog.clock_out)}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {timeLog.hours_worked.toFixed(2)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${timeLog.total_pay?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' + getStatusColor(timeLog.status)}>
                          {timeLog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(timeLog)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => timeLog.id && handleDelete(timeLog.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <AddTimeLogModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTimeLog}
        timeLog={editingTimeLog}
      />
    </div>
  );
}
