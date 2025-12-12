'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { venueBookingsApi, VenueBookingData, VenueBookingStats } from '@/lib/api/venue-bookings';
import NewBookingModal from '@/components/NewBookingModal';
import ViewBookingModal from '@/components/ViewBookingModal';
import EditBookingModal from '@/components/EditBookingModal';

const VENUES = [
  'Main Chapel',
  'Main Chapel - Serenity Hall',
  'Church Hall',
  'Heritage Reception Hall',
  'Green Hills Cemetery',
  'Peaceful Passage Crematorium',
];

export default function VenueBookingsPage() {
  const [bookings, setBookings] = useState<VenueBookingData[]>([]);
  const [stats, setStats] = useState<VenueBookingStats>({ total: 0, confirmed: 0, tentative: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [venueFilter, setVenueFilter] = useState('All Venues');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<VenueBookingData | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await venueBookingsApi.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await venueBookingsApi.getStats();
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

    if (venueFilter && venueFilter !== 'All Venues') {
      params.venue = venueFilter;
    }

    if (statusFilter && statusFilter !== 'All Statuses') {
      params.status = statusFilter;
    }

    venueBookingsApi.getAll(params).then(setBookings);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Tentative':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Cancelled':
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Venue Bookings</h1>
                <p className="text-gray-600 text-sm mt-1">Manage venue reservations and bookings</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Bookings */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tentative */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tentative</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.tentative}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">${stats.total_revenue.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  placeholder="Case ID, contact person..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <select
                  value={venueFilter}
                  onChange={(e) => setVenueFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All Venues</option>
                  {VENUES.map((venue) => (
                    <option key={venue}>{venue}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option>All Statuses</option>
                  <option>Confirmed</option>
                  <option>Tentative</option>
                  <option>Cancelled</option>
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
              Showing {bookings.length > 0 ? 1 : 0} to {bookings.length} of {bookings.length} bookings
            </p>
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              style={{ backgroundColor: '#D4AF37' }}
              className="hover:opacity-90 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <span className="text-lg">+</span>
              <span className="text-sm">New Booking</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Venue</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Case</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Cost</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-gray-500 text-sm">No venue bookings found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === bookings.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.venue}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-blue-600">{booking.deceased_name}</div>
                        <div className="text-xs text-gray-500">{booking.case_number}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{formatDate(booking.booking_date)}</div>
                        <div className="text-xs text-gray-600">{booking.booking_time || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.contact_person || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(booking.cost || 0)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status || 'Tentative')}`}>
                          {booking.status || 'Tentative'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
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
                              setSelectedBooking(booking);
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
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onBookingCreated={() => {
          setIsNewBookingModalOpen(false);
          fetchBookings();
          fetchStats();
        }}
      />

      <ViewBookingModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
      />

      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
        onBookingUpdated={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
          fetchBookings();
          fetchStats();
        }}
      />
    </div>
  );
}
