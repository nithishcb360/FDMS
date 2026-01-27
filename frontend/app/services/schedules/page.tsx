'use client';

import { useState, useEffect } from 'react';
import DynamicSidebar from '@/components/DynamicSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { schedulesApi, ScheduleData } from '@/lib/api/schedules';
import { casesApi, CaseData } from '@/lib/api/cases';
import NewScheduleModal from '@/components/NewScheduleModal';
import ViewScheduleModal from '@/components/ViewScheduleModal';
import EditScheduleModal from '@/components/EditScheduleModal';

export default function ServiceSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchCases();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await schedulesApi.getAll();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    // Handle time string format (HH:MM:SS or HH:MM)
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleViewSchedule = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const handleEditSchedule = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDeleteSchedule = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await schedulesApi.delete(id);
        await fetchSchedules();
        alert('Schedule deleted successfully');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-600 text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <DynamicSidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Service Schedule</h1>
              <p className="text-gray-600 text-sm mt-1">View and manage scheduled services</p>
            </div>

            {/* New Schedule Button */}
            <button
              onClick={() => setIsNewScheduleModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span>
              <span className="text-sm font-medium">New Schedule</span>
            </button>
          </div>

          {/* Schedules Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Staff Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Shift Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Notes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading schedules...
                    </td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No schedules found. Click "New Schedule" to create one.
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === schedules.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{formatDateTime(schedule.shift_date)}</div>
                        <div className="text-xs text-gray-600">
                          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{schedule.staff_member_name}</div>
                        {schedule.is_overtime && <div className="text-xs text-orange-600">Overtime</div>}
                        {schedule.is_holiday && <div className="text-xs text-purple-600">Holiday</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{schedule.shift_type}</div>
                        {schedule.break_duration && <div className="text-xs text-gray-500">Break: {schedule.break_duration} min</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStatusColor(schedule.status)}`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {schedule.notes || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            title="View"
                            onClick={() => handleViewSchedule(schedule)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            title="Edit"
                            onClick={() => handleEditSchedule(schedule)}
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
      <NewScheduleModal
        isOpen={isNewScheduleModalOpen}
        onClose={() => setIsNewScheduleModalOpen(false)}
        onScheduleCreated={() => {
          setIsNewScheduleModalOpen(false);
          fetchSchedules();
        }}
      />
      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        scheduleData={selectedSchedule}
      />
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        scheduleData={selectedSchedule}
        onScheduleUpdated={() => {
          setIsEditModalOpen(false);
          setSelectedSchedule(null);
          fetchSchedules();
        }}
      />
    </div>
  );
}