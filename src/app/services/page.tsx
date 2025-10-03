'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ServicesPage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);

  const mockServices = [
    {
      id: 'stripe-payment',
      title: 'Stripe Payment Service',
      description: 'Secure payment processing for housing and healthcare services',
      provider: 'System',
      price: 'Free',
      category: 'Payment',
      status: 'active'
    },
    {
      id: 'housing-grants',
      title: 'Emergency Housing Grants',
      description: 'Financial assistance for temporary accommodation',
      provider: 'Housing Department',
      price: '$500-2000',
      category: 'Housing',
      status: 'active'
    },
    {
      id: 'healthcare-enrollment',
      title: 'Healthcare Enrollment',
      description: 'Assistance with healthcare system registration and access',
      provider: 'Health Services',
      price: 'Free',
      category: 'Healthcare',
      status: 'active'
    },
    {
      id: 'food-assistance',
      title: 'Food Bank Services',
      description: 'Weekly food distribution and nutrition support',
      provider: 'Community Food Bank',
      price: 'Free',
      category: 'Food Security',
      status: 'active'
    }
  ];

  // Mock activities data
  const activities = [
    { id: '1', type: 'forum', title: 'Emergency Housing', status: 'active' },
    { id: '2', type: 'policy', title: 'Healthcare Policy', status: 'pending' },
    { id: '3', type: 'service', title: 'Food Bank', status: 'completed' }
  ];

  // Mock users for activities panel
  const users = [
    { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Marcus Johnson', avatar: '👨‍⚕️', status: 'busy' },
    { id: '3', name: 'Elena Rodriguez', avatar: '👩‍🏫', status: 'away' }
  ];

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum': return '💬';
      case 'policy': return '📋';
      case 'service': return '🔧';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'housing': return 'bg-green-100 text-green-800';
      case 'healthcare': return 'bg-red-100 text-red-800';
      case 'food security': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'payment': return '💳';
      case 'housing': return '🏠';
      case 'healthcare': return '🏥';
      case 'food security': return '🍽️';
      default: return '🔧';
    }
  };

  return (
    <>
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        {/* Toggle Area */}
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
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
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.type === 'forum' ? 'Active discussion' : 
                           activity.type === 'policy' ? 'Review pending' : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">Active Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex justify-center py-2">
                  <div className="text-2xl">{user.avatar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon - Left Edge */}
      <div 
        className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${
          isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'
        }`}
      >
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-96' : 'left-36'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          {/* Center Navigation Icons */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link href="/services" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Shopping Cart and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            <div className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">account_circle</span>
              <span className="text-sm font-medium">RK</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16 p-6 min-h-screen bg-gray-50`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-2">
                Services represent the functional components that deliver value within the PFSD model. They can be connected to Policies and instantiate behavior.
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <span className="material-icons text-lg">add</span>
              <span>Create Service</span>
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getCategoryIcon(service.category)}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{service.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-green-600">{service.price}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/services/${service.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </Link>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Service Categories */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">💳</div>
                <h4 className="font-medium text-gray-900">Payment</h4>
                <p className="text-xs text-gray-500">Secure transactions</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900">Housing</h4>
                <p className="text-xs text-gray-500">Accommodation support</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🏥</div>
                <h4 className="font-medium text-gray-900">Healthcare</h4>
                <p className="text-xs text-gray-500">Medical services</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🍽️</div>
                <h4 className="font-medium text-gray-900">Food Security</h4>
                <p className="text-xs text-gray-500">Nutrition support</p>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Services</h3>
            <p className="text-blue-800 text-sm">
              Services are analogue or digital agents (human, API, IoT, AI) that can be consumed by 
              Policies. They may be free or paid, and include attributes like Price, Size, Color, and 
              Quantity. Services connect to Policies and instantiate behavior when activated.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}