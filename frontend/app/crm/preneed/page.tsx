'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { preneedsApi, PreneedData, PreneedStats } from '@/lib/api/preneeds';
import AddPreneedModal from '@/components/AddPreneedModal';

export default function PreneedPage() {
  const [preneeds, setPreneeds] = useState<PreneedData[]>([]);
  const [stats, setStats] = useState<PreneedStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentPlanFilter, setPaymentPlanFilter] = useState('');

  const fetchPreneeds = async () => {
    try {
      const data = await preneedsApi.getAll({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        payment_plan: paymentPlanFilter || undefined,
      });
      setPreneeds(data);
    } catch (error) {
      console.error('Error fetching preneeds:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await preneedsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPreneeds();
    fetchStats();
  }, [searchTerm, statusFilter, paymentPlanFilter]);

  const handlePreneedAdded = () => {
    fetchPreneeds();
    fetchStats();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this pre-need plan?')) {
      try {
        await preneedsApi.delete(id);
        fetchPreneeds();
        fetchStats();
      } catch (error) {
        console.error('Error deleting preneed:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              📋 Pre-need Plans
            </h1>
            <p className="text-gray-600 mt-1">Manage advance funeral arrangements</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_plans}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_plans}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-blue-600">${stats.total_value.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${stats.total_paid.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Plan holder, family..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={paymentPlanFilter}
                onChange={(e) => setPaymentPlanFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Plans</option>
                <option value="Full Payment">Full Payment</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium whitespace-nowrap"
              >
                + New Pre-need Plan
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Holder</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preneeds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-6xl mb-4">📋</span>
                        <p className="text-lg font-medium">No pre-need plans found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  preneeds.map((preneed) => (
                    <tr key={preneed.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{preneed.plan_holder_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{preneed.family_id || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{preneed.service_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${preneed.estimated_cost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${(preneed.amount_paid || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{preneed.payment_plan}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          preneed.status === 'Active' ? 'bg-green-100 text-green-800' :
                          preneed.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {preneed.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => preneed.id && handleDelete(preneed.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
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

          <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
            Showing {preneeds.length} of {stats?.total_plans || 0} pre-need plans
          </div>
        </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AddPreneedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPreneedAdded={handlePreneedAdded}
        />
      )}
    </div>
  );
}
