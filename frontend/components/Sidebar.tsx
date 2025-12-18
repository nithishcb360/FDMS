'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => {
    if (!mounted) return false;
    return pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">✟</span>
            </div>
            <h1 className="text-xl font-bold">FDMS</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">System Administrator</div>
              <div className="px-2 py-0.5 bg-yellow-500 text-slate-900 text-xs font-bold rounded inline-block mt-1">
                Super Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-2">
          {/* Dashboard */}
          <a href="/dashboard" className={`flex items-center px-4 py-2.5 font-medium text-sm ${isActive('/dashboard') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`} suppressHydrationWarning>
            <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Dashboard
          </a>

          {/* Cases */}
          <div>
            <button onClick={() => toggleSection('cases')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                Cases
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('cases') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('cases') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/cases" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/cases') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                  Cases
                </a>
                <a href="/next-of-kin" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/next-of-kin') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  Next of Kin
                </a>
                <a href="/notes" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/notes') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Notes
                </a>
                <a href="/assignments" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/assignments') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/></svg>
                  Assignments
                </a>
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <button onClick={() => toggleSection('services')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                Services
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('services') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('services') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/services/schedules" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/service-schedules') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                  Service Schedules
                </a>
                <a href="/services/arrangements" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/arrangements') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>
                  Arrangements
                </a>
                <a href="/services/venue-bookings" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/venue-bookings') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Venue Bookings
                </a>
                <a href="/services/add-ons" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/service-addons') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>
                  Service Add-ons
                </a>
              </div>
            )}
          </div>

          {/* Operations */}
          <div>
            <button onClick={() => toggleSection('operations')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </svg>
                Operations
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('operations') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('operations') && (
              <div className="bg-slate-800/50 py-1">
                {/* Inventory */}
                <button onClick={() => toggleSection('inventory')} className="w-full flex items-center justify-between px-4 py-2 pl-8 hover:bg-slate-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2z"/></svg>
                    Inventory
                  </div>
                  <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.includes('inventory') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                {expandedSections.includes('inventory') && (
                  <div className="bg-slate-900/50">
                    <a href="/inventory/products" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/inventory/products') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>
                      Products
                    </a>
                    <a href="/inventory/categories" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/inventory/categories') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                      Categories
                    </a>
                    <a href="/inventory/suppliers" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/inventory/suppliers') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>
                      Suppliers
                    </a>
                    <a href="/inventory/purchase-orders" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/inventory/purchase-orders') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                      Purchase Orders
                    </a>
                    <a href="/inventory/stock-movements" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/inventory/stock-movements') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11z M12 22l5.5-9h-11z"/></svg>
                      Stock Movements
                    </a>
                  </div>
                )}

                {/* Fleet */}
                <button onClick={() => toggleSection('fleet')} className="w-full flex items-center justify-between px-4 py-2 pl-8 hover:bg-slate-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                    Fleet
                  </div>
                  <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.includes('fleet') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                {expandedSections.includes('fleet') && (
                  <div className="bg-slate-900/50">
                    <a href="/fleet/vehicles" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/fleet/vehicles') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                      Vehicles
                    </a>
                    <a href="/fleet/assignments" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/fleet/assignments') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/></svg>
                      Assignments
                    </a>
                    <a href="/fleet/maintenance" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/fleet/maintenance') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
                      Maintenance
                    </a>
                    <a href="/fleet/fuel-logs" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/fleet/fuel-logs') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg>
                      Fuel Logs
                    </a>
                  </div>
                )}

                {/* Staff */}
                <button onClick={() => toggleSection('staff')} className="w-full flex items-center justify-between px-4 py-2 pl-8 hover:bg-slate-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    Staff
                  </div>
                  <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.includes('staff') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                {expandedSections.includes('staff') && (
                  <div className="bg-slate-900/50">
                    <a href="/staff/members" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/staff/members') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      Staff Members
                    </a>
                    <a href="/staff/tasks" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/staff/tasks') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                      Tasks
                    </a>
                    <a href="/staff/schedules" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/staff/schedules') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                      Schedules
                    </a>
                    <a href="/staff/time-logs" className={`flex items-center px-4 py-2 pl-14 text-xs ${isActive('/staff/time-logs') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                      <svg className="w-2.5 h-2.5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                      Time Logs
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Finance */}
          <div>
            <button onClick={() => toggleSection('finance')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                Finance
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('finance') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('finance') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/finance/invoices" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/finance/invoices') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Invoices
                </a>
                <a href="/finance/payments" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/finance/payments') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                  Payments
                </a>
                <a href="/finance/expenses" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/finance/expenses') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                  Expenses
                </a>
                <a href="/finance/transactions" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/finance/transactions') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                  Transactions
                </a>
              </div>
            )}
          </div>

          {/* CRM */}
          <div>
            <button onClick={() => toggleSection('crm')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"/>
                </svg>
                CRM
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('crm') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('crm') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/crm/families" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/crm/families') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/></svg>
                  Families
                </a>
                <a href="/crm/communications" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/crm/communications') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                  Communications
                </a>
                <a href="/crm/followups" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/crm/followups') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  Follow-ups
                </a>
                <a href="/crm/preneed" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/crm/preneed') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Pre-need Plans
                </a>
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <button onClick={() => toggleSection('documents')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                Documents
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('documents') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('documents') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/documents" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/all-documents') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                  All Documents
                </a>
                <a href="/documents/types" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/document-types') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
                  Document Types
                </a>
                <a href="/documents/templates" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/templates') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                  Templates
                </a>
              </div>
            )}
          </div>

          {/* Reports & Analytics */}
          <div>
            <button onClick={() => toggleSection('reports')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Reports & Analytics
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('reports') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('reports') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/all-reports" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/all-reports') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                  All Reports
                </a>
                <a href="/schedules" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/schedules') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
                  Schedules
                </a>
                <a href="/dashboards" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/dashboards') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                  Dashboards
                </a>
                <a href="/metrics-kpis" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/metrics-kpis') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                  Metrics & KPIs
                </a>
                <a href="/alerts" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/alerts') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                  Alerts
                </a>
              </div>
            )}
          </div>

          {/* Settings */}
          <div>
            <button onClick={() => toggleSection('settings')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-700 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
                Settings
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.includes('settings') ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {expandedSections.includes('settings') && (
              <div className="bg-slate-800/50 py-1">
                <a href="/branches" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/branches') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
                  Branches
                </a>
                <a href="/service-types" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/service-types') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                  Service Types
                </a>
                <a href="/service-packages" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/service-packages') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>
                  Service Packages
                </a>
                <a href="/venue-types" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/venue-types') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Venue Types
                </a>
                <a href="/tax-codes" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/tax-codes') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
                  Tax Codes
                </a>
                <a href="/payment-modes" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/payment-modes') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                  Payment Modes
                </a>
                <a href="/religious-rites" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/religious-rites') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Religious Rites
                </a>
                <a href="/document-types" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/document-types') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Document Types
                </a>
                <a href="/expense-categories" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/expense-categories') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                  Expense Categories
                </a>
                <a href="/roles-permissions" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/roles-permissions') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                  Roles & Permissions
                </a>
                <a href="/user-management" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/user-management') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  User Management
                </a>
                <a href="/system-settings" className={`flex items-center px-4 py-2 pl-11 text-sm ${isActive('/system-settings') ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-700 text-white'}`}>
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                  System Settings
                </a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
