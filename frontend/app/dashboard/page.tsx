import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import UpcomingServices from '@/components/UpcomingServices';
import MyTasks from '@/components/MyTasks';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8">

          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Dashboard</span>
                <span className="text-xl">✨</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Welcome back, System Administrator!</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                Super Admin
              </span>
            </div>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 hover:scale-105 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Case
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Active Cases"
              value={6}
              icon={
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" opacity="0.5"/>
                </svg>
              }
              iconBgColor="bg-gradient-to-br from-blue-100 to-blue-200"
            />
            <StatCard
              title="Today's Services"
              value={1}
              icon={
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z" opacity="0.5"/>
                </svg>
              }
              iconBgColor="bg-gradient-to-br from-purple-100 to-purple-200"
            />
            <StatCard
              title="Pending Payments"
              value={0}
              icon={
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" opacity="0.5"/>
                </svg>
              }
              iconBgColor="bg-gradient-to-br from-green-100 to-green-200"
            />
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <QuickActions />
            <RecentActivity />
          </div>

          {/* Upcoming Services and My Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingServices />
            <MyTasks />
          </div>
        </main>
      </div>

    </div>
  );
}
