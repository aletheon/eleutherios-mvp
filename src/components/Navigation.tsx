'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Type definitions for better TypeScript support
interface Policy {
  id: string;
  title: string;
  category: string;
  authorId: string;
}

interface Service {
  id: string;
  title: string;
  status: string;
  ownerId: string;
}

interface Forum {
  id: string;
  title: string;
  status: string;
  createdBy: string;
}

export function Navigation() {
  const { user, signOut } = useAuth();
  const { activitiesPanelOpen, setActivitiesPanelOpen, unreadCount } = useDashboard();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [userPolicies, setUserPolicies] = useState<Policy[]>([]);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [userForums, setUserForums] = useState<Forum[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user]);

  const fetchUserContent = async () => {
    try {
      const token = await user?.getIdToken();
      
      // Fetch policies
      const policiesResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json?auth=${token}`
      );
      if (policiesResponse.ok) {
        const policiesData = await policiesResponse.json();
        if (policiesData) {
          const userPoliciesList: Policy[] = Object.entries(policiesData)
            .filter(([id, policy]: [string, any]) => policy.authorId === user?.uid)
            .map(([id, policy]: [string, any]) => ({ id, ...policy }));
          setUserPolicies(userPoliciesList);
        }
      }

      // Fetch services
      const servicesResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services.json?auth=${token}`
      );
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        if (servicesData) {
          const userServicesList: Service[] = Object.entries(servicesData)
            .filter(([id, service]: [string, any]) => service.ownerId === user?.uid)
            .map(([id, service]: [string, any]) => ({ id, ...service }));
          setUserServices(userServicesList);
        }
      }

      // Fetch forums
      const forumsResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums.json?auth=${token}`
      );
      if (forumsResponse.ok) {
        const forumsData = await forumsResponse.json();
        if (forumsData) {
          const userForumsList: Forum[] = Object.entries(forumsData)
            .filter(([id, forum]: [string, any]) => forum.createdBy === user?.uid)
            .map(([id, forum]: [string, any]) => ({ id, ...forum }));
          setUserForums(userForumsList);
        }
      }
    } catch (error) {
      console.error('Error fetching user content:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth');
    }
  };

  const handleActivitiesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActivitiesPanelOpen(!activitiesPanelOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side navigation */}
          <div className="flex items-center gap-4">
            {/* Home/Newsfeed Link */}
            <Link 
              href="/newsfeed" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Home"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </Link>
            
            {/* Activities Button */}
            <button
              type="button"
              onClick={handleActivitiesClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Activities"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Center navigation */}
          <div className="flex items-center gap-4">
            {/* Forums Link */}
            <Link 
              href="/forums" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Forums"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </Link>

            {/* Services Link */}
            <Link 
              href="/services" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Services"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            </Link>

            {/* Policies Link */}
            <Link 
              href="/policies" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              title="Policies"
            >
              <span className="material-icons" style={{ fontSize: '24px', lineHeight: 1, verticalAlign: 'middle' }}>account_balance</span>
            </Link>

            {/* Users Link */}
            <Link 
              href="/users" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              title="Users"
            >
              <span className="material-icons" style={{ fontSize: '24px', lineHeight: 1, verticalAlign: 'middle' }}>people_alt</span>
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center gap-4">
            {/* Cart Link */}
            <Link 
              href="/cart" 
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title="User Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                  {/* User Info Section */}
                  <div className="px-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-medium text-gray-900">{user?.email || 'Unknown User'}</p>
                  </div>

                  {/* Activity Counts */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Activities</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policies</span>
                        <span className="text-gray-900">({userPolicies.length})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Forums</span>
                        <span className="text-gray-900">({userForums.length})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services</span>
                        <span className="text-gray-900">({userServices.length})</span>
                      </div>
                    </div>
                  </div>

                  {/* User Policies Section */}
                  {userPolicies.length > 0 && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">My Policies</h3>
                      <div className="space-y-2">
                        {userPolicies.slice(0, 3).map((policy) => (
                          <Link
                            key={policy.id}
                            href={`/policies/${policy.id}`}
                            className="block p-2 rounded hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                            <div className="text-xs text-gray-500">{policy.category}</div>
                          </Link>
                        ))}
                        {userPolicies.length > 3 && (
                          <Link
                            href="/policies"
                            className="block text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            View all {userPolicies.length} policies
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Forums Section */}
                  {userForums.length > 0 && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">My Forums</h3>
                      <div className="space-y-2">
                        {userForums.slice(0, 3).map((forum) => (
                          <Link
                            key={forum.id}
                            href={`/forums/${forum.id}`}
                            className="block p-2 rounded hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <div className="text-sm font-medium text-gray-900">{forum.title}</div>
                            <div className="text-xs text-gray-500">{forum.status}</div>
                          </Link>
                        ))}
                        {userForums.length > 3 && (
                          <Link
                            href="/forums"
                            className="block text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            View all {userForums.length} forums
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other Stats */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Favorites</span>
                        <span className="text-gray-900">(0)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Following</span>
                        <span className="text-gray-900">(0)</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Menu Items */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="space-y-1 text-sm">
                      <Link 
                        href="/payments" 
                        className="block text-gray-600 hover:text-gray-900"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Payments
                      </Link>
                      <Link 
                        href="/receipts" 
                        className="block text-gray-600 hover:text-gray-900"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Receipts
                      </Link>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="px-4 py-3">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}