'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';

interface NextOfKinData {
  id: number;
  name: string;
  email: string;
  relationship: string;
  case: string;
  contact: string;
  isPrimary: boolean;
  isAuthorized: boolean;
  notifications: boolean;
}

// Sample data
const sampleData: NextOfKinData[] = [
  {
    id: 1,
    name: 'Mark Anderson',
    email: 'mark.anderson@email.com',
    relationship: 'Child',
    case: '555-0110',
    contact: '555-0110',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 2,
    name: 'Nancy Taylor',
    email: 'nancy.taylor@email.com',
    relationship: 'Spouse',
    case: '555-0109',
    contact: '555-0109',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 3,
    name: 'Steven Moore',
    email: 'steven.moore@email.com',
    relationship: 'Sibling',
    case: '555-0108',
    contact: '555-0108',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 4,
    name: 'Carol Wilson',
    email: 'carol.wilson@email.com',
    relationship: 'Spouse',
    case: '555-0107',
    contact: '555-0107',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 5,
    name: 'Richard Miller',
    email: 'richard.miller@email.com',
    relationship: 'Child',
    case: '555-0106',
    contact: '555-0106',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 6,
    name: 'Karen Davis',
    email: 'karen.davis@email.com',
    relationship: 'Child',
    case: '555-0105',
    contact: '555-0105',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 7,
    name: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    relationship: 'Spouse',
    case: '555-0104',
    contact: '555-0104',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 8,
    name: 'Jennifer Williams',
    email: 'jennifer.williams@email.com',
    relationship: 'Spouse',
    case: '555-0103',
    contact: '555-0103',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
  {
    id: 9,
    name: 'Susan Johnson',
    email: 'susan.johnson@email.com',
    relationship: 'Child',
    case: '555-0102',
    contact: '555-0102',
    isPrimary: true,
    isAuthorized: true,
    notifications: true,
  },
];

export default function NextOfKinPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('All Relationships');
  const [caseFilter, setCaseFilter] = useState('All Cases');

  const totalContacts = sampleData.length;
  const primaryContacts = sampleData.filter(k => k.isPrimary).length;
  const authorizedContacts = sampleData.filter(k => k.isAuthorized).length;
  const notificationsEnabled = sampleData.filter(k => k.notifications).length;

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Child':
        return 'bg-amber-500 text-white';
      case 'Spouse':
        return 'bg-orange-500 text-white';
      case 'Sibling':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <h1 className="text-2xl font-bold text-gray-900">Next of Kin</h1>
            </div>
            <p className="text-gray-600 text-sm">Manage family contacts and decision makers</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primary Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{primaryContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Authorized</p>
                  <p className="text-2xl font-bold text-gray-900">{authorizedContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notificationsEnabled}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Name, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={relationshipFilter}
                  onChange={(e) => setRelationshipFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option>All Relationships</option>
                  <option>Child</option>
                  <option>Spouse</option>
                  <option>Sibling</option>
                  <option>Parent</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case</label>
                <select
                  value={caseFilter}
                  onChange={(e) => setCaseFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option>All Cases</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 text-sm font-medium flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Showing 1 to 9 of 9 contacts</p>
              <button className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-sm font-medium flex items-center gap-2">
                <span>+</span>
                Add Next of Kin
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Relationship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Primary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Authorized</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleData.map((kin) => (
                    <tr key={kin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{kin.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {kin.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRelationshipColor(kin.relationship)}`}>
                          {kin.relationship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {kin.case}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {kin.contact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kin.isPrimary && (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white text-xs font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Primary
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kin.isAuthorized && (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-blue-500 text-white text-xs font-medium">
                            Yes
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kin.notifications && (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-cyan-500 text-white text-xs font-medium">
                            Enabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
