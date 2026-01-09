'use client';

import { useState, useEffect } from 'react';
import DynamicSidebar from '@/components/DynamicSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { tabsApi, TabSettingData } from '@/lib/api/tabs';
import { rolesApi, RoleData } from '@/lib/api/roles';

export default function TabsManagementPage() {
  const [tabs, setTabs] = useState<TabSettingData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [roleTabAssignments, setRoleTabAssignments] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchTabs(), fetchRoles()]);
    } catch (error) {
      console.error('Error initializing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabs = async () => {
    try {
      const data = await tabsApi.getAll();
      if (data.length === 0) {
        await initializeDefaultTabs();
      } else {
        setTabs(data);
      }
    } catch (error) {
      console.error('Error fetching tabs:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      if (data.length === 0) {
        await initializeDefaultRoles();
      } else {
        setRoles(data);
        // Fetch tab assignments for each role
        const assignments: Record<number, number[]> = {};
        for (const role of data) {
          const roleWithTabs = await rolesApi.getById(role.id!);
          assignments[role.id!] = roleWithTabs.tab_ids;
        }
        setRoleTabAssignments(assignments);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const initializeDefaultRoles = async () => {
    const defaultRoles = [
      { name: 'users', display_name: 'Users', description: 'Standard user access', is_active: true },
    ];

    try {
      for (const role of defaultRoles) {
        await rolesApi.create(role);
      }
      await fetchRoles();
    } catch (error) {
      console.error('Error initializing default roles:', error);
    }
  };

  const initializeDefaultTabs = async () => {
    const defaultTabs = [
      // Dashboard
      { name: 'dashboard', label: 'Dashboard', path: '/dashboard', is_enabled: true, sort_order: 1 },

      // Cases
      { name: 'cases', label: 'Cases', is_enabled: true, sort_order: 2 },
      { name: 'cases_list', label: 'Cases List', path: '/cases', parent: 'cases', is_enabled: true, sort_order: 3 },
      { name: 'next_of_kin', label: 'Next of Kin', path: '/next-of-kin', parent: 'cases', is_enabled: true, sort_order: 4 },
      { name: 'notes', label: 'Notes', path: '/notes', parent: 'cases', is_enabled: true, sort_order: 5 },
      { name: 'assignments', label: 'Assignments', path: '/assignments', parent: 'cases', is_enabled: true, sort_order: 6 },

      // Services
      { name: 'services', label: 'Services', is_enabled: true, sort_order: 7 },
      { name: 'service_schedules', label: 'Service Schedules', path: '/services/schedules', parent: 'services', is_enabled: true, sort_order: 8 },
      { name: 'arrangements', label: 'Arrangements', path: '/services/arrangements', parent: 'services', is_enabled: true, sort_order: 9 },
      { name: 'venue_bookings', label: 'Venue Bookings', path: '/services/venue-bookings', parent: 'services', is_enabled: true, sort_order: 10 },
      { name: 'service_addons', label: 'Service Add-ons', path: '/services/add-ons', parent: 'services', is_enabled: true, sort_order: 11 },

      // Operations
      { name: 'operations', label: 'Operations', is_enabled: true, sort_order: 12 },
      // Inventory (sub-section of Operations)
      { name: 'inventory', label: 'Inventory', parent: 'operations', is_enabled: true, sort_order: 13 },
      { name: 'inventory_products', label: 'Products', path: '/inventory/products', parent: 'inventory', is_enabled: true, sort_order: 14 },
      { name: 'inventory_categories', label: 'Categories', path: '/inventory/categories', parent: 'inventory', is_enabled: true, sort_order: 15 },
      { name: 'inventory_suppliers', label: 'Suppliers', path: '/inventory/suppliers', parent: 'inventory', is_enabled: true, sort_order: 16 },
      { name: 'inventory_purchase_orders', label: 'Purchase Orders', path: '/inventory/purchase-orders', parent: 'inventory', is_enabled: true, sort_order: 17 },
      { name: 'inventory_stock_movements', label: 'Stock Movements', path: '/inventory/stock-movements', parent: 'inventory', is_enabled: true, sort_order: 18 },
      // Fleet (sub-section of Operations)
      { name: 'fleet', label: 'Fleet', parent: 'operations', is_enabled: true, sort_order: 19 },
      { name: 'fleet_vehicles', label: 'Vehicles', path: '/fleet/vehicles', parent: 'fleet', is_enabled: true, sort_order: 20 },
      { name: 'fleet_assignments', label: 'Fleet Assignments', path: '/fleet/assignments', parent: 'fleet', is_enabled: true, sort_order: 21 },
      { name: 'fleet_maintenance', label: 'Maintenance', path: '/fleet/maintenance', parent: 'fleet', is_enabled: true, sort_order: 22 },
      { name: 'fleet_fuel_logs', label: 'Fuel Logs', path: '/fleet/fuel-logs', parent: 'fleet', is_enabled: true, sort_order: 23 },
      // Staff (sub-section of Operations)
      { name: 'staff', label: 'Staff', parent: 'operations', is_enabled: true, sort_order: 24 },
      { name: 'staff_members', label: 'Staff Members', path: '/staff/members', parent: 'staff', is_enabled: true, sort_order: 25 },
      { name: 'staff_tasks', label: 'Tasks', path: '/staff/tasks', parent: 'staff', is_enabled: true, sort_order: 26 },
      { name: 'staff_schedules', label: 'Staff Schedules', path: '/staff/schedules', parent: 'staff', is_enabled: true, sort_order: 27 },
      { name: 'staff_time_logs', label: 'Time Logs', path: '/staff/time-logs', parent: 'staff', is_enabled: true, sort_order: 28 },

      // Finance
      { name: 'finance', label: 'Finance', is_enabled: true, sort_order: 29 },
      { name: 'invoices', label: 'Invoices', path: '/finance/invoices', parent: 'finance', is_enabled: true, sort_order: 30 },
      { name: 'payments', label: 'Payments', path: '/finance/payments', parent: 'finance', is_enabled: true, sort_order: 31 },
      { name: 'expenses', label: 'Expenses', path: '/finance/expenses', parent: 'finance', is_enabled: true, sort_order: 32 },
      { name: 'transactions', label: 'Transactions', path: '/finance/transactions', parent: 'finance', is_enabled: true, sort_order: 33 },

      // CRM
      { name: 'crm', label: 'CRM', is_enabled: true, sort_order: 34 },
      { name: 'crm_families', label: 'Families', path: '/crm/families', parent: 'crm', is_enabled: true, sort_order: 35 },
      { name: 'crm_communications', label: 'Communications', path: '/crm/communications', parent: 'crm', is_enabled: true, sort_order: 36 },
      { name: 'crm_followups', label: 'Follow-ups', path: '/crm/followups', parent: 'crm', is_enabled: true, sort_order: 37 },
      { name: 'crm_preneed', label: 'Pre-need Plans', path: '/crm/preneed', parent: 'crm', is_enabled: true, sort_order: 38 },

      // Documents
      { name: 'documents', label: 'Documents', is_enabled: true, sort_order: 39 },
      { name: 'all_documents', label: 'All Documents', path: '/all-documents', parent: 'documents', is_enabled: true, sort_order: 40 },
      { name: 'document_types', label: 'Document Types', path: '/document-types', parent: 'documents', is_enabled: true, sort_order: 41 },
      { name: 'templates', label: 'Templates', path: '/templates', parent: 'documents', is_enabled: true, sort_order: 42 },

      // Reports & Analytics
      { name: 'reports', label: 'Reports & Analytics', is_enabled: true, sort_order: 43 },
      { name: 'all_reports', label: 'All Reports', path: '/all-reports', parent: 'reports', is_enabled: true, sort_order: 44 },
      { name: 'report_schedules', label: 'Schedules', path: '/schedules', parent: 'reports', is_enabled: true, sort_order: 45 },
      { name: 'dashboards', label: 'Dashboards', path: '/dashboards', parent: 'reports', is_enabled: true, sort_order: 46 },
      { name: 'metrics_kpis', label: 'Metrics & KPIs', path: '/metrics-kpis', parent: 'reports', is_enabled: true, sort_order: 47 },
      { name: 'alerts', label: 'Alerts', path: '/alerts', parent: 'reports', is_enabled: true, sort_order: 48 },

      // Settings
      { name: 'settings', label: 'Settings', is_enabled: true, sort_order: 49 },
      { name: 'settings_branches', label: 'Branches', path: '/settings/branches', parent: 'settings', is_enabled: true, sort_order: 50 },
      { name: 'settings_service_types', label: 'Service Types', path: '/settings/service-types', parent: 'settings', is_enabled: true, sort_order: 51 },
      { name: 'settings_service_packages', label: 'Service Packages', path: '/settings/service-packages', parent: 'settings', is_enabled: true, sort_order: 52 },
      { name: 'settings_venue_types', label: 'Venue Types', path: '/settings/venue-types', parent: 'settings', is_enabled: true, sort_order: 53 },
      { name: 'settings_tax_codes', label: 'Tax Codes', path: '/settings/tax-codes', parent: 'settings', is_enabled: true, sort_order: 54 },
      { name: 'settings_payment_modes', label: 'Payment Modes', path: '/settings/payment-modes', parent: 'settings', is_enabled: true, sort_order: 55 },
      { name: 'settings_religious_rites', label: 'Religious Rites', path: '/settings/religious-rites', parent: 'settings', is_enabled: true, sort_order: 56 },
      { name: 'settings_document_types', label: 'Document Types', path: '/settings/document-types', parent: 'settings', is_enabled: true, sort_order: 57 },
      { name: 'settings_expense_categories', label: 'Expense Categories', path: '/settings/expense-categories', parent: 'settings', is_enabled: true, sort_order: 58 },
      { name: 'settings_roles_permissions', label: 'Roles & Permissions', path: '/settings/roles-permissions', parent: 'settings', is_enabled: true, sort_order: 59 },
      { name: 'settings_user_management', label: 'User Management', path: '/settings/user-management', parent: 'settings', is_enabled: true, sort_order: 60 },
      { name: 'settings_system_settings', label: 'System Settings', path: '/settings/system-settings', parent: 'settings', is_enabled: true, sort_order: 61 },
    ];

    try {
      for (const tab of defaultTabs) {
        await tabsApi.create(tab);
      }
      await fetchTabs();
    } catch (error) {
      console.error('Error initializing default tabs:', error);
    }
  };

  const handleTabToggle = (tabId: number) => {
    if (selectedRole === null) return;

    setRoleTabAssignments(prev => {
      const currentTabs = prev[selectedRole] || [];
      const newTabs = currentTabs.includes(tabId)
        ? currentTabs.filter(id => id !== tabId)
        : [...currentTabs, tabId];

      return {
        ...prev,
        [selectedRole]: newTabs
      };
    });
  };

  const handleSave = async () => {
    if (selectedRole === null) return;

    try {
      setSaving(true);
      const tabIds = roleTabAssignments[selectedRole] || [];
      await rolesApi.assignTabs(selectedRole, tabIds);
      alert('Tab permissions saved successfully!');
    } catch (error) {
      console.error('Error saving tab permissions:', error);
      alert('Failed to save tab permissions');
    } finally {
      setSaving(false);
    }
  };

  const filteredTabs = tabs.filter(tab =>
    tab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate main sections (no parent or no path) from sub-items
  const mainSections = filteredTabs.filter(tab => !tab.parent && !tab.path);
  const allSubItems = filteredTabs.filter(tab => tab.parent || tab.path);

  // Group sub-items by their parent
  const groupedSubItems = allSubItems.reduce((acc, tab) => {
    const key = tab.parent || 'root';
    if (!acc[key]) acc[key] = [];
    acc[key].push(tab);
    return acc;
  }, {} as Record<string, TabSettingData[]>);

  const selectedRoleTabs = selectedRole ? (roleTabAssignments[selectedRole] || []) : [];

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Toggle main section - enable/disable all sub-items
  const handleMainSectionToggle = (mainTab: TabSettingData) => {
    if (selectedRole === null) return;

    const sectionSubItems = groupedSubItems[mainTab.name] || [];
    const subItemIds = sectionSubItems.map(item => item.id!);

    setRoleTabAssignments(prev => {
      const currentTabs = prev[selectedRole] || [];
      const mainTabId = mainTab.id!;

      // Check if main tab is currently selected
      const isMainSelected = currentTabs.includes(mainTabId);

      if (isMainSelected) {
        // Deselect main tab and all sub-items
        return {
          ...prev,
          [selectedRole]: currentTabs.filter(id => id !== mainTabId && !subItemIds.includes(id))
        };
      } else {
        // Select main tab and all sub-items
        const newTabs = new Set([...currentTabs, mainTabId, ...subItemIds]);
        return {
          ...prev,
          [selectedRole]: Array.from(newTabs)
        };
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicSidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Role-Based Tab Management</h1>
            </div>
            <p className="text-gray-600 text-sm">Assign sidebar tabs to different roles</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 bg-white rounded-lg shadow border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Role</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id!)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-sm">{role.display_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {roleTabAssignments[role.id!]?.length || 0} tabs
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <>
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search tabs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Tabs List */}
              <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {selectedRoleTabs.length} of {tabs.length} tabs selected
                  </p>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Permissions
                      </>
                    )}
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      Loading tabs...
                    </div>
                  ) : mainSections.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No tabs found
                    </div>
                  ) : (
                    mainSections.map((mainTab) => {
                      const isMainChecked = selectedRoleTabs.includes(mainTab.id!);
                      const isExpanded = expandedSections.includes(mainTab.name);
                      const subItems = groupedSubItems[mainTab.name] || [];
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={mainTab.id} className="border-b border-gray-200 last:border-b-0">
                          {/* Main Section Header */}
                          <div className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isMainChecked}
                                  onChange={() => handleMainSectionToggle(mainTab)}
                                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-base">{mainTab.label}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {mainTab.name} {hasSubItems && `• ${subItems.length} sub-items`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  mainTab.is_enabled
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {mainTab.is_enabled ? 'Active' : 'Inactive'}
                                </span>
                                {hasSubItems && (
                                  <button
                                    onClick={() => toggleSection(mainTab.name)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Sub-items */}
                          {hasSubItems && isExpanded && (
                            <div className="bg-white">
                              {subItems.map((subTab) => {
                                const isSubChecked = selectedRoleTabs.includes(subTab.id!);
                                const nestedSubItems = groupedSubItems[subTab.name] || [];
                                const hasNested = nestedSubItems.length > 0;
                                const isNestedExpanded = expandedSections.includes(subTab.name);

                                return (
                                  <div key={subTab.id}>
                                    <label className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50 transition-colors cursor-pointer border-t border-gray-100">
                                      <div className="flex items-center gap-3 flex-1">
                                        <input
                                          type="checkbox"
                                          checked={isSubChecked}
                                          onChange={() => handleTabToggle(subTab.id!)}
                                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <div className="flex-1">
                                          <h4 className="font-medium text-gray-800 text-sm">{subTab.label}</h4>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            {subTab.path || 'No path'} • {subTab.name}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                          subTab.is_enabled
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                          {subTab.is_enabled ? 'Active' : 'Inactive'}
                                        </span>
                                        {hasNested && (
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              toggleSection(subTab.name);
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                          >
                                            <svg className={`w-4 h-4 text-gray-600 transition-transform ${isNestedExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M7 10l5 5 5-5z"/>
                                            </svg>
                                          </button>
                                        )}
                                      </div>
                                    </label>

                                    {/* Nested sub-items (3rd level) */}
                                    {hasNested && isNestedExpanded && (
                                      <div className="bg-gray-50">
                                        {nestedSubItems.map((nestedTab) => {
                                          const isNestedChecked = selectedRoleTabs.includes(nestedTab.id!);
                                          return (
                                            <label key={nestedTab.id} className="flex items-center justify-between p-3 pl-20 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-200">
                                              <div className="flex items-center gap-3 flex-1">
                                                <input
                                                  type="checkbox"
                                                  checked={isNestedChecked}
                                                  onChange={() => handleTabToggle(nestedTab.id!)}
                                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <div className="flex-1">
                                                  <h5 className="font-medium text-gray-700 text-sm">{nestedTab.label}</h5>
                                                  <p className="text-xs text-gray-400 mt-0.5">
                                                    {nestedTab.path || 'No path'}
                                                  </p>
                                                </div>
                                              </div>
                                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                nestedTab.is_enabled
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-gray-100 text-gray-500'
                                              }`}>
                                                {nestedTab.is_enabled ? 'Active' : 'Inactive'}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {!selectedRole && !loading && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Role</h3>
              <p className="text-gray-600">Choose a role above to manage its tab permissions</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
