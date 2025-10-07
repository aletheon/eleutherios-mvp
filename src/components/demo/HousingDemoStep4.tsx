"use client"

import React, { useState } from 'react';

export default function SupportServicesActivated() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:24',
      message: 'Based on your circumstances, you qualify for Priority B housing assistance. Let me bring Kāinga Ora into this coordination so we can get you properly registered and start looking at housing options.',
      avatar: '👩‍💼'
    },
    {
      id: 2,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-07 09:25',
      message: 'HousingCoordination policy created successfully. Kāinga Ora Housing Officer has been added to the forum. Housing registry services are now active.',
      avatar: '⚡',
      isSystem: true
    },
    {
      id: 3,
      sender: 'Michael Chen',
      role: 'KO Housing Officer',
      timestamp: '2025-10-07 09:26',
      message: 'Hi Jordan and Sarah! I\'m Michael from Kāinga Ora Wellington. I\'ve joined to help coordinate Jordan\'s housing application. I can see you\'re Priority B - let me check current availability and get you properly registered.',
      avatar: '🏠'
    },
    {
      id: 4,
      sender: 'Jordan Williams',
      role: 'Housing Applicant',
      timestamp: '2025-10-07 09:29',
      message: 'Thanks Michael. I\'d prefer to stay in the Wellington area if possible, near my daughter\'s school in Newtown. I don\'t have a car so need to be near public transport. Also, I might need help with the bond - I don\'t have much savings.',
      avatar: '👤'
    },
    {
      id: 5,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:31',
      message: 'That\'s understandable Jordan. Let me activate our support services to help with transport, bond assistance, and transitional support. This will make sure you have everything you need when housing becomes available.',
      avatar: '👩‍💼'
    },
    {
      id: 6,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:32',
      message: 'rule activate support -> Service("TransitionalSupport", services=["bond_assistance", "transport_support", "emergency_payment"])',
      avatar: '👩‍💼',
      isEleuScript: true
    },
    {
      id: 7,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-07 09:32',
      message: 'Support services activated successfully! Bond assistance, transport coordination, and emergency payments are now available.',
      avatar: '💰',
      isSystem: true,
      isSupport: true
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Forum Header */}
      <div className="bg-green-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Housing Application Forum</h1>
            <p className="text-green-100">Applicant: Jordan Williams | Application ID: #HA-2025-1007</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">Policy: HousingCoordination v1.0</div>
            <div className="text-sm text-green-100">Updated: Oct 7, 2025 09:32</div>
            <div className="text-xs text-green-200">Parent: BasicHousingApplication</div>
          </div>
        </div>
      </div>

      {/* Support Services Activation Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">💰</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Support Services Activated:</strong> Transitional support package enabled for housing preparation
            </p>
            <div className="mt-1 text-xs text-blue-600">
              Bond assistance: Up to $2,400 • Transport support: Weekly bus pass • Emergency payment: $200 available
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholders Panel */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Stakeholders</h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">👩‍💼</span>
            <div>
              <div className="text-sm font-medium">Sarah Mitchell</div>
              <div className="text-xs text-gray-500">MSD Case Worker</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">👤</span>
            <div>
              <div className="text-sm font-medium">Jordan Williams</div>
              <div className="text-xs text-gray-500">Housing Applicant</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">🏠</span>
            <div>
              <div className="text-sm font-medium">Michael Chen</div>
              <div className="text-xs text-gray-500">Kāinga Ora Housing Officer</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Active Services Panel - Updated */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Services</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Application Processing</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Document Upload</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Housing Registry</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm">Property Matching</span>
          </div>
          {/* Support services highlighted */}
          <div className="bg-blue-50 px-3 py-2 rounded-lg border-2 border-blue-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm font-medium">Bond Assistance</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="bg-blue-50 px-3 py-2 rounded-lg border-2 border-blue-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm font-medium">Transport Support</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="bg-blue-50 px-3 py-2 rounded-lg border-2 border-blue-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm font-medium">Emergency Payments</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${
            message.isSupport ? 'bg-blue-50 -mx-4 px-4 py-2 rounded-lg' : ''
          }`}>
            <div className="text-2xl flex-shrink-0">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{message.sender}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  message.isSystem ? 'text-blue-700 bg-blue-100' :
                  message.isSupport ? 'text-blue-700 bg-blue-100' :
                  'text-gray-500 bg-gray-100'
                }`}>
                  {message.role}
                </span>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
                {message.isEleuScript && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                    ELEUSCRIPT
                  </span>
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.isSystem && message.isSupport ? 'bg-blue-50 border-l-4 border-blue-400' :
                message.isSystem ? 'bg-blue-50 border-l-4 border-blue-400' :
                message.isEleuScript ? 'bg-purple-50 border-l-4 border-purple-400 font-mono text-sm' :
                'bg-gray-100'
              }`}>
                <p className="text-gray-800">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Services Panel */}
      <div className="bg-blue-50 border-t border-blue-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Support Services Active</h3>
            <p className="text-sm text-blue-600">Assistance available to help with housing transition</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">$2,600</div>
            <div className="text-sm text-blue-600">Total Support Available</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Bond Assistance</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Maximum Amount</span>
                <span className="font-medium">$2,400</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time</span>
                <span className="font-medium">2-3 days</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Covers rental bond for 2BR property
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Transport Support</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Weekly Bus Pass</span>
                <span className="font-medium">$50/week</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">4 weeks</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Includes school zone transport
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Emergency Payment</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Immediate Available</span>
                <span className="font-medium">$200</span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span className="font-medium">Special Needs Grant</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                For immediate necessities
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            <span>💰</span>
            Request Support Services
          </button>
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            View Eligibility
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message or EleuScript rule..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800">
            Send
          </button>
        </div>
        <div className="text-xs text-blue-600 mt-2 font-medium">
          💰 Support services activated! Bond assistance and transport support ready to process.
        </div>
      </div>
    </div>
  );
}

export { SupportServicesActivated as HousingDemoStep4 };