'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { tasksApi, TaskData, TaskStats } from '@/lib/api/tasks';
import AddTaskModal from '@/components/AddTaskModal';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total_tasks: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Load tasks
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await tasksApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.case_reference && task.case_reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.client_reference && task.client_reference.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, tasks]);

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(id);
        loadTasks();
        loadStats();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async () => {
    await loadTasks();
    await loadStats();
    handleCloseModal();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600';
      case 'High Priority':
        return 'text-orange-600';
      case 'Medium Priority':
        return 'text-yellow-600';
      case 'Low Priority':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const categoryOptions = ['All', ...Array.from(new Set(tasks.map(t => t.category)))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✓</span>
                <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
              </div>
              <p className="text-gray-600 text-sm">Track and manage tasks and assignments</p>
            </div>
            <button
              onClick={handleAddTask}
              className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
            >
              <span>+</span>
              New Task
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Tasks</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total_tasks}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search task ID, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Urgent">Urgent</option>
                <option value="High Priority">High Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="Low Priority">Low Priority</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredTasks.length} of {stats.total_tasks} tasks
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Tasks Table */}
          {filteredTasks.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Task ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{task.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(task.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => task.id && handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="flex justify-center mb-4">
                <span className="text-6xl text-gray-300">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <button
                onClick={handleAddTask}
                className="mt-4 px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-2"
              >
                <span>+</span>
                Create First Task
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />
    </div>
  );
}
