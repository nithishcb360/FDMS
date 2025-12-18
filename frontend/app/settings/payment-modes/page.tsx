'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { PaymentModeData, paymentModesApi } from '@/lib/api/payment-modes';
import AddPaymentModeModal from '@/components/AddPaymentModeModal';

export default function PaymentModesPage() {
  const [paymentModes, setPaymentModes] = useState<PaymentModeData[]>([]);
  const [filteredPaymentModes, setFilteredPaymentModes] = useState<PaymentModeData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPaymentMode, setEditingPaymentMode] = useState<PaymentModeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentModes();
  }, []);

  useEffect(() => {
    filterPaymentModes();
  }, [paymentModes, searchTerm, filterStatus, filterType]);

  const fetchPaymentModes = async () => {
    try {
      const data = await paymentModesApi.getAll();
      setPaymentModes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment modes:', error);
      setLoading(false);
    }
  };

  const filterPaymentModes = () => {
    let filtered = paymentModes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pm =>
        pm.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pm.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pm.description && pm.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus === 'Active') {
      filtered = filtered.filter(pm => pm.is_active);
    } else if (filterStatus === 'Inactive') {
      filtered = filtered.filter(pm => !pm.is_active);
    }

    // Type filter
    if (filterType === 'online') {
      filtered = filtered.filter(pm => pm.is_online);
    } else if (filterType === 'offline') {
      filtered = filtered.filter(pm => !pm.is_online);
    }

    setFilteredPaymentModes(filtered);
  };

  const handleAddPaymentMode = async (formData: any) => {
    try {
      await paymentModesApi.create(formData);
      setIsModalOpen(false);
      fetchPaymentModes();
    } catch (error) {
      console.error('Error creating payment mode:', error);
      alert('Failed to create payment mode');
    }
  };

  const handleEditPaymentMode = async (paymentMode: PaymentModeData) => {
    try {
      const fullData = await paymentModesApi.getById(paymentMode.id!);
      setEditingPaymentMode(fullData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching payment mode details:', error);
      alert('Failed to load payment mode details');
    }
  };

  const handleUpdatePaymentMode = async (formData: any) => {
    if (!editingPaymentMode?.id) return;

    try {
      await paymentModesApi.update(editingPaymentMode.id, formData);
      setIsEditModalOpen(false);
      setEditingPaymentMode(null);
      fetchPaymentModes();
    } catch (error) {
      console.error('Error updating payment mode:', error);
      alert('Failed to update payment mode');
    }
  };

  const handleDeletePaymentMode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment mode?')) return;

    try {
      await paymentModesApi.delete(id);
      fetchPaymentModes();
    } catch (error) {
      console.error('Error deleting payment mode:', error);
      alert('Failed to delete payment mode');
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      credit_debit_card: 'Credit/Debit Card',
      online_payment: 'Online Payment',
      installment_plan: 'Installment Plan',
      cheque: 'Cheque',
    };
    return typeMap[type] || type;
  };

  // Calculate stats
  const totalPaymentModes = paymentModes.length;
  const activePaymentModes = paymentModes.filter(pm => pm.is_active).length;
  const inactivePaymentModes = totalPaymentModes - activePaymentModes;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 p-2 rounded">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Modes</h1>
                <p className="text-gray-600 mt-1">Manage accepted payment methods</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payment Modes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalPaymentModes}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Payment Modes</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activePaymentModes}</p>
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
                  <p className="text-sm text-gray-600">Inactive Payment Modes</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{inactivePaymentModes}</p>
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search payment modes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus(''); setFilterType(''); }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Apply Filters
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium whitespace-nowrap"
              >
                + New Payment Mode
              </button>
            </div>
          </div>

          {/* Payment Modes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processing Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Loading payment modes...
                      </td>
                    </tr>
                  ) : filteredPaymentModes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No payment modes found
                      </td>
                    </tr>
                  ) : (
                    filteredPaymentModes.map((paymentMode) => (
                      <tr key={paymentMode.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 p-2 rounded mr-3">
                              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{paymentMode.payment_method}</div>
                              <div className="text-xs text-gray-500">{paymentMode.display_name}</div>
                              {paymentMode.description && (
                                <div className="text-xs text-gray-400 mt-0.5">{paymentMode.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-gray-800 text-white rounded">
                            {getPaymentTypeLabel(paymentMode.payment_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {paymentMode.has_processing_fee ? (
                            <div>
                              {paymentMode.percentage_fee > 0 && (
                                <div className="text-yellow-600 font-semibold">✓ {paymentMode.percentage_fee}%</div>
                              )}
                              {paymentMode.fixed_fee > 0 && (
                                <div className="text-yellow-600 font-semibold">$ {paymentMode.fixed_fee.toFixed(2)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No fee</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {paymentMode.is_online && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded bg-blue-100 text-blue-800">
                                🌐 Online
                              </span>
                            )}
                            {!paymentMode.is_online && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded bg-gray-100 text-gray-800">
                                📴 Offline
                              </span>
                            )}
                            {paymentMode.requires_authorization && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded bg-yellow-100 text-yellow-800">
                                🔒 Auth Req
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paymentMode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {paymentMode.is_active ? '✓ Active' : '✗ Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditPaymentMode(paymentMode)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title="Edit"
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePaymentMode(paymentMode.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Payment Mode Modal */}
      <AddPaymentModeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPaymentMode}
      />

      {/* Edit Payment Mode Modal */}
      <AddPaymentModeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPaymentMode(null);
        }}
        onSave={handleUpdatePaymentMode}
        editData={editingPaymentMode || undefined}
        isEditMode={true}
      />
    </div>
  );
}
