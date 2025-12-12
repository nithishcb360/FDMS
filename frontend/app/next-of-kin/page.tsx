'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AddNextOfKinModal from '@/components/AddNextOfKinModal';
import { casesApi, CaseData } from '@/lib/api/cases';
import { nextOfKinApi, NextOfKinData as ApiNextOfKinData } from '@/lib/api/next-of-kin';

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

export default function NextOfKinPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('All Relationships');
  const [caseFilter, setCaseFilter] = useState('All Cases');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nextOfKinList, setNextOfKinList] = useState<NextOfKinData[]>([]);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [editingKin, setEditingKin] = useState<NextOfKinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
    fetchNextOfKin();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const fetchNextOfKin = async () => {
    try {
      setLoading(true);
      const data = await nextOfKinApi.getAll();
      // Transform API data to match UI format
      const transformedData: NextOfKinData[] = data.map((item) => ({
        id: item.id!,
        name: `${item.first_name} ${item.last_name}`,
        email: item.email || '',
        relationship: item.relationship,
        case: item.case_number,
        contact: item.phone,
        isPrimary: item.is_primary_contact,
        isAuthorized: item.is_authorized_decision_maker,
        notifications: item.receive_notifications,
      }));
      setNextOfKinList(transformedData);
    } catch (error) {
      console.error('Error fetching next of kin:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalContacts = nextOfKinList.length;
  const primaryContacts = nextOfKinList.filter(k => k.isPrimary).length;
  const authorizedContacts = nextOfKinList.filter(k => k.isAuthorized).length;
  const notificationsEnabled = nextOfKinList.filter(k => k.notifications).length;

  const handleAddNextOfKin = async (data: any) => {
    try {
      const apiData: ApiNextOfKinData = {
        case_number: data.case,
        first_name: data.firstName,
        last_name: data.lastName,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        street_address: data.streetAddress,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        is_primary_contact: data.isPrimaryContact,
        is_authorized_decision_maker: data.isAuthorizedDecisionMaker,
        receive_notifications: data.receiveNotifications,
        notes: data.notes,
      };

      await nextOfKinApi.create(apiData);
      await fetchNextOfKin(); // Refresh the list
    } catch (error) {
      console.error('Error adding next of kin:', error);
      alert('Failed to add next of kin contact');
    }
  };

  const handleEditKin = async (kin: NextOfKinData) => {
    try {
      // Fetch full details from API
      const fullData = await nextOfKinApi.getById(kin.id);

      // Transform to form data
      const editData = {
        id: fullData.id,
        case: fullData.case_number,
        relationship: fullData.relationship,
        firstName: fullData.first_name,
        lastName: fullData.last_name,
        phone: fullData.phone,
        email: fullData.email || '',
        streetAddress: fullData.street_address || '',
        city: fullData.city || '',
        state: fullData.state || '',
        zipCode: fullData.zip_code || '',
        isPrimaryContact: fullData.is_primary_contact,
        isAuthorizedDecisionMaker: fullData.is_authorized_decision_maker,
        receiveNotifications: fullData.receive_notifications,
        notes: fullData.notes || '',
      };

      setEditingKin(editData as any);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching next of kin details:', error);
      alert('Failed to load contact details');
    }
  };

  const handleUpdateNextOfKin = async (data: any) => {
    try {
      const apiData: Partial<ApiNextOfKinData> = {
        case_number: data.case,
        first_name: data.firstName,
        last_name: data.lastName,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        street_address: data.streetAddress,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        is_primary_contact: data.isPrimaryContact,
        is_authorized_decision_maker: data.isAuthorizedDecisionMaker,
        receive_notifications: data.receiveNotifications,
        notes: data.notes,
      };

      await nextOfKinApi.update(data.id, apiData);
      await fetchNextOfKin(); // Refresh the list
      setIsEditModalOpen(false);
      setEditingKin(null);
    } catch (error) {
      console.error('Error updating next of kin:', error);
      alert('Failed to update next of kin contact');
    }
  };

  const handleDeleteKin = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await nextOfKinApi.delete(id);
        await fetchNextOfKin(); // Refresh the list
      } catch (error) {
        console.error('Error deleting next of kin:', error);
        alert('Failed to delete next of kin contact');
      }
    }
  };

  // Filter logic
  const filteredNextOfKin = nextOfKinList.filter(kin => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      kin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kin.contact.toLowerCase().includes(searchQuery.toLowerCase());

    // Relationship filter
    const matchesRelationship = relationshipFilter === 'All Relationships' ||
      kin.relationship === relationshipFilter;

    // Case filter
    const matchesCase = caseFilter === 'All Cases' ||
      kin.case === caseFilter;

    return matchesSearch && matchesRelationship && matchesCase;
  });

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Child':
        return 'bg-amber-500 text-white';
      case 'Spouse':
        return 'bg-orange-500 text-white';
      case 'Sibling':
        return 'bg-purple-500 text-white';
      case 'Parent':
        return 'bg-green-500 text-white';
      case 'Other Family':
        return 'bg-blue-500 text-white';
      case 'Friend':
        return 'bg-cyan-500 text-white';
      case 'Legal Representative':
        return 'bg-indigo-500 text-white';
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
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.case_number}>
                      {caseItem.case_number} - {caseItem.first_name} {caseItem.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRelationshipFilter('All Relationships');
                    setCaseFilter('All Cases');
                  }}
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredNextOfKin.length > 0
                  ? `Showing ${filteredNextOfKin.length} of ${nextOfKinList.length} contacts`
                  : nextOfKinList.length > 0
                  ? 'No contacts match the current filters'
                  : 'No contacts added yet'}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-sm font-medium flex items-center gap-2"
              >
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        Loading contacts...
                      </td>
                    </tr>
                  ) : filteredNextOfKin.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        {nextOfKinList.length > 0
                          ? 'No contacts match the current filters. Try adjusting your search criteria.'
                          : 'No contacts added yet. Click "Add Next of Kin" to create one.'}
                      </td>
                    </tr>
                  ) : (
                    filteredNextOfKin.map((kin) => (
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
                          <button
                            onClick={() => handleEditKin(kin)}
                            title="Edit"
                            className="p-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteKin(kin.id, kin.name)}
                            title="Delete"
                            className="p-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </main>
      </div>

      {/* Add Next of Kin Modal */}
      <AddNextOfKinModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNextOfKin}
      />

      {/* Edit Next of Kin Modal */}
      <AddNextOfKinModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingKin(null);
        }}
        onSave={handleUpdateNextOfKin}
        editData={editingKin as any}
        isEditMode={true}
      />
    </div>
  );
}
