'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  id: string;
  type: 'forum' | 'policy' | 'service';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'pending' | 'completed';
}

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [panelWidth, setPanelWidth] = useState(0); // 0 = closed, max = 320
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // Load activities panel state from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('activitiesPanelWidth');
    if (savedWidth) {
      setPanelWidth(parseInt(savedWidth, 10));
    }

    // Load mock activities (replace with real data)
    setActivities([
      {
        id: '1',
        type: 'forum',
        title: 'Emergency Housing Coordination',
        description: 'Active discussion about temporary accommodation',
        timestamp: '2 hours ago',
        status: 'active'
      },
      {
        id: '2',
        type: 'policy',
        title: 'Healthcare Access Policy',
        description: 'Review pending for policy amendments',
        timestamp: '5 hours ago',
        status: 'pending'
      },
      {
        id: '3',
        type: 'service',
        title: 'Food Bank Services',
        description: 'Weekly delivery completed successfully',
        timestamp: '1 day ago',
        status: 'completed'
      }
    ]);
  }, []);

  // Save activities panel state to localStorage
  useEffect(() => {
    localStorage.setItem('activitiesPanelWidth', panelWidth.toString());

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('activitiesPanelToggle', {
      detail: { width: panelWidth }
    }));
  }, [panelWidth]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogoClick = () => {
    // Toggle between closed (0) and open (280)
    setPanelWidth(panelWidth === 0 ? 280 : 0);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = panelWidth;
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const delta = e.clientX - dragStartX.current;
    const newWidth = Math.max(0, Math.min(320, dragStartWidth.current + delta));
    setPanelWidth(newWidth);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getUserInitials = () => {
    if (!user?.profile?.name) return '?';
    const names = user.profile.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum':
        return '💬';
      case 'policy':
        return '📋';
      case 'service':
        return '🔧';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isActiveRoute = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname?.startsWith(route)) return true;
    return false;
  };

  return (
    <>
      {/* Main Navigation Bar - Full Width */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-50">
        <div className="h-full flex items-center justify-between px-6">
          {/* Left Side - Logo/Toggle Button */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-white/80 hover:text-white hover:bg-white/10"
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <span className="font-semibold text-white">Eleutherios</span>
            <span className="material-icons text-lg">
              {panelWidth > 0 ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}
            </span>
          </button>

          {/* Center Navigation Icons */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute('/')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-icons text-2xl">home</span>
                <span className="text-xs font-medium">Home</span>
              </Link>

              <Link 
                href="/forums" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute('/forums') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link 
                href="/services" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute('/services') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link 
                href="/policies" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute('/policies') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link 
                href="/users" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute('/users') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Shopping Cart and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="material-icons text-2xl">account_circle</span>
                  <span className="text-sm font-medium uppercase">{getUserInitials()}</span>
                  <span className="material-icons text-lg">
                    {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[200]" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}>
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.profile?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="material-icons text-lg mr-3">person</span>
                        Profile
                      </Link>

                      <Link
                        href="/policies"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="material-icons text-lg mr-3">account_balance</span>
                        My Policies ({user?.profile?.activities?.policies?.length || 0})
                      </Link>

                      <Link
                        href="/services"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="material-icons text-lg mr-3">build</span>
                        My Services ({user?.profile?.activities?.services?.length || 0})
                      </Link>

                      <Link
                        href="/forums"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="material-icons text-lg mr-3">forum</span>
                        My Forums ({user?.profile?.activities?.forums?.length || 0})
                      </Link>

                      <Link
                        href="/cart"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="material-icons text-lg mr-3">shopping_cart</span>
                        Shopping Cart ({user?.profile?.shoppingCart?.length || 0})
                      </Link>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <span className="material-icons text-lg mr-3">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Activities Panel - Below Navigation */}
      {panelWidth > 0 && (
        <div
          className="fixed left-0 top-16 bg-white border-r border-gray-200 z-40 transition-all"
          style={{
            width: `${panelWidth}px`,
            height: 'calc(100vh - 4rem)',
            transitionDuration: isDragging ? '0ms' : '300ms'
          }}
        >
          {/* Activities Content */}
          <div className="h-full overflow-y-auto">
            {panelWidth > 150 ? (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activities</h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="text-lg">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4">
                {activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex justify-center py-2">
                    <div className="relative">
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drag Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
            onMouseDown={handleDragStart}
            style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-12 bg-gray-400 hover:bg-blue-600 rounded-l-lg flex items-center justify-center">
              <div className="w-0.5 h-6 bg-white rounded"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content Spacer */}
      <div
        className="transition-all pt-16"
        style={{
          marginLeft: `${panelWidth}px`,
          transitionDuration: isDragging ? '0ms' : '300ms'
        }}
      >
        {/* This ensures content doesn't overlap with navigation */}
      </div>
    </>
  );
};

export default Navigation;