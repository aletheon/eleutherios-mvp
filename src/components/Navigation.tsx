// src/components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activitiesPanelOpen, setActivitiesPanelOpen] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Add effect to communicate panel state changes
  useEffect(() => {
    // Store the state and dispatch custom event
    localStorage.setItem('activitiesPanelOpen', activitiesPanelOpen.toString());
    window.dispatchEvent(new Event('activitiesPanelChange'));
  }, [activitiesPanelOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoClick = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300 && activitiesPanelOpen) {
      // Double click - close panel
      setActivitiesPanelOpen(false);
    } else {
      // Single click - open panel
      setActivitiesPanelOpen(true);
    }
    
    setLastClickTime(currentTime);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // If user is not authenticated, show minimal navigation for auth pages
  if (!user) {
    return (
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center text-white">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="material-icons text-blue-600 text-lg">scatter_plot</span>
                </div>
                <span className="text-xl font-bold">Eleutherios</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Full navigation for authenticated users
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo with activities toggle */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center mr-3 relative">
                <span className="material-icons text-blue-600 text-sm absolute">circle</span>
              </div>
              <span className="text-xl font-bold">Eleutherios</span>
            </button>
          </div>

          {/* Center - Main navigation icons */}
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-white hover:text-blue-200 flex flex-col items-center p-2 rounded-md transition-colors group"
              title="Home"
            >
              <span className="material-icons text-2xl">home</span>
            </Link>
            
            <Link
              href="/forums/coordination"
              className="text-white hover:text-blue-200 flex flex-col items-center p-2 rounded-md transition-colors group"
              title="Forums"
            >
              <span className="material-icons text-2xl">forum</span>
            </Link>

            <Link
              href="/services"
              className="text-white hover:text-blue-200 flex flex-col items-center p-2 rounded-md transition-colors group"
              title="Services"
            >
              <span className="material-icons text-2xl">settings</span>
            </Link>

            <Link
              href="/policies"
              className="text-white hover:text-blue-200 flex flex-col items-center p-2 rounded-md transition-colors group"
              title="Policies"
            >
              <span className="material-icons text-2xl">account_balance</span>
            </Link>

            <Link
              href="/users"
              className="text-white hover:text-blue-200 flex flex-col items-center p-2 rounded-md transition-colors group"
              title="Users"
            >
              <span className="material-icons text-2xl">people_alt</span>
            </Link>
          </div>

          {/* Right side - Shopping cart and user menu */}
          <div className="flex items-center space-x-4">
            {/* Shopping cart */}
            <button
              type="button"
              className="text-white hover:text-blue-200 p-2 rounded-md transition-colors"
              title="Shopping Cart"
            >
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-blue-500 rounded-full"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-600 text-sm font-bold">
                  {user.profile?.name ? getUserInitials(user.profile.name) : getUserInitials(user.email || 'U')}
                </div>
              </button>

              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user.profile?.name || user.email}</div>
                      <div className="text-gray-500">{user.profile?.role || 'User'}</div>
                    </div>
                    
                    <Link
                      href={`/users/${user.uid}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="material-icons text-sm mr-2">person</span>
                      Your Profile
                    </Link>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="material-icons text-sm mr-2">dashboard</span>
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="material-icons text-sm mr-2">settings</span>
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="material-icons text-sm mr-2">logout</span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activities Panel - Collapsed Thumbnails */}
      {!activitiesPanelOpen && (
        <div className="fixed top-16 left-0 w-16 bg-white shadow-lg border-r border-gray-200 z-40 h-screen">
          <div className="p-2 space-y-3">
            {/* Forum Thumbnail */}
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
              <span className="material-icons text-blue-600 text-sm">forum</span>
            </div>
            
            {/* Policy Thumbnail */}
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors">
              <span className="material-icons text-purple-600 text-sm">account_balance</span>
            </div>
            
            {/* Service Thumbnail */}
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-200 transition-colors">
              <span className="material-icons text-green-600 text-sm">miscellaneous_services</span>
            </div>
            
            {/* Activity Indicator */}
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Activities Panel - Expanded */}
      {activitiesPanelOpen && (
        <div className="absolute top-16 left-0 w-80 bg-white shadow-lg border-r border-gray-200 z-40 h-screen">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Activities</h3>
              <button 
                onClick={() => setActivitiesPanelOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Recent Forums */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Forums</h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                    <span className="material-icons text-blue-600 mr-3">forum</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Coordination Forum</p>
                      <p className="text-xs text-blue-700">3 new messages</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                    <span className="material-icons text-blue-600 mr-3">forum</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Housing Discussion</p>
                      <p className="text-xs text-blue-700">1 new update</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Policies */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Policies</h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                    <span className="material-icons text-purple-600 mr-3">account_balance</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Social Housing Policy</p>
                      <p className="text-xs text-purple-700">Updated 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                    <span className="material-icons text-purple-600 mr-3">account_balance</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Healthcare Access</p>
                      <p className="text-xs text-purple-700">Draft created</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Services */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Services</h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                    <span className="material-icons text-green-600 mr-3">miscellaneous_services</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Housing Assistance</p>
                      <p className="text-xs text-green-700">1 pending request</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CERT Score Summary */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your CERT Score</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Score</span>
                  <span className="text-lg font-bold text-blue-600">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(userMenuOpen || activitiesPanelOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setUserMenuOpen(false);
            setActivitiesPanelOpen(false);
          }}
        />
      )}
    </nav>
  );
};