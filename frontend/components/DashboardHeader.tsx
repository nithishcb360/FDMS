'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, UserResponse } from '@/lib/api';

export default function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/signin');
          return;
        }
        const userData = await getCurrentUser(token);
        setUser(userData);
      } catch (error: any) {
        // Silently handle 401 errors (expired/invalid token)
        if (error?.response?.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/signin');
        } else {
          console.error('Failed to fetch user:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  // Determine if back button should be shown (not on dashboard)
  const showBackButton = pathname !== '/dashboard';

  if (loading) {
    return (
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        ) : (
          <button className="lg:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          {/* Superadmin Buttons */}
          {user?.is_superuser && (
            <>
              {/* Manage Tabs Button */}
              <button
                onClick={() => router.push('/tabs')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="font-medium">Manage Tabs</span>
              </button>

              {/* Users & Roles Button */}
              <button
                onClick={() => router.push('/users-roles')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">Users & Roles</span>
              </button>
            </>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full hover:from-indigo-100 hover:to-purple-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user?.full_name || user?.email || 'User'}</div>
              </div>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-900">{user?.full_name || user?.email || 'User'}</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                  {user?.is_superuser && (
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Super Admin
                    </span>
                  )}
                  {!user?.is_superuser && (
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      User
                    </span>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">Settings</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
