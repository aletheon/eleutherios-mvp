'use client';

import React, { useState, useEffect } from 'react';
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
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load activities panel state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('activitiesExpanded');
    if (savedState) {
      setIsActivitiesExpanded(JSON.parse(savedState));
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
    localStorage.setItem('activitiesExpanded', JSON.stringify(isActivitiesExpanded));
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('activitiesPanelToggle', {
      detail: { expanded: isActivitiesExpanded }
    }));
  }, [isActivitiesExpanded]);

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const handleLogoDoubleClick = () => {
    setIsActivitiesExpanded(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
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
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        {/* Logo/Toggle Area */}
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
          onDoubleClick={handleLogoDoubleClick}
        >
          {isActivitiesExpanded ? (
            <div className="flex items-center space-x-2 px-4">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 bg-white rounded border border-gray-300 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <span className="font-semibold text-gray-800">Eleutherios</span>
            </div>
          ) : (
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Activities Content */}
        <div className="flex-1 overflow-y-auto">
          {isActivitiesExpanded ? (
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
              {activities.slice(0, 3).map((activity, index) => (
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
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-80' : 'left-16'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
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
              <div className="relative">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="material-icons text-2xl">account_circle</span>
                  <span className="text-sm font-medium hidden md:block">{user.displayName || user.email}</span>
                </button>
                {/* Add dropdown menu here if needed */}
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

      {/* Content Spacer */}
      <div 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16`}
      >
        {/* This ensures content doesn't overlap with navigation */}
      </div>
    </>
  );
};

export default Navigation;