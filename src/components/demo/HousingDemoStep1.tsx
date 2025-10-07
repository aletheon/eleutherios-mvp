"use client"

import React, { useState } from 'react';

export default function ForumExpandedWithKO() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Jordan Williams',
      role: 'Housing Applicant',
      timestamp: '2025-10-07 09:21',
      message: 'Yes, I\'m on JobSeeker and get Working for Families for my daughter. No immediate safety issues, but I can\'t keep imposing on friends much longer. My daughter needs stability for school.',
      avatar: '👤'
    },
    {
      id: 2,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:24',
      message: 'Based on your circumstances, you qualify for Priority B housing assistance. Let me bring Kāinga Ora into this coordination so we can get you properly registered and start looking at housing options.',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-07 09:25',
      message: 'HousingCoordination policy created successfully. Kāinga Ora Housing Officer has been added to the forum. Housing registry services are now active.',
      avatar: '⚡',
      isSystem: true
    },
    {
      id: 4,
      sender: 'Michael Chen',
      role: 'KO Housing Officer',
      timestamp: '2025-10-07 09:26',
      message: 'Hi Jordan and Sarah! I\'m Michael from Kāinga Ora Wellington. I\'ve joined to help coordinate Jordan\'s housing application. I can see you\'re Priority B - let me check current availability and get you properly registered.',
      avatar: '🏠',
      isNew: true
    },
    {
      id: 5,
      sender: 'Michael Chen',
      role: 'KO Housing Officer',
      timestamp: '2025-10-07 09:28',
      message: 'Jordan, I can see you need a 2-bedroom property in the Wellington area. We currently have some options available. Can you tell me about any specific location preferences or accessibility needs?',
      avatar: '🏠',
      isNew: true
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Forum Header - Updated */}
      <div className="bg-green-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Housing Application Forum</h1>
            <p className="text-green-100">Applicant: Jordan Williams | Application ID: #HA-2025-1007</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">Policy: HousingCoordination v1.0</div>
            <div className="text-sm text-green-100">Updated: Oct 7, 2025 09:25</div>
            <div className="text-xs text-green-200">Parent: BasicHousingApplication</div>
          </div>
        </div>
      </div>

      {/* Policy Expansion Alert */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-green-400 text-lg">✅</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Forum Expanded Successfully:</strong> HousingCoordination sub-policy created
            </p>
            <div className="mt-1 text-xs text-green-600">
              New stakeholder added: Kāinga Ora • Housing registry services activated • Priority B assessment confirmed
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Stakeholders Panel */}
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
          {/* New Kāinga Ora Officer */}
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 relative">
            <span className="text-lg">🏠</span>
            <div>
              <div className="text-sm font-medium">Michael Chen</div>
              <div className="text-xs text-gray-500">Kāinga Ora Housing Officer</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {/* New badge */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </div>
          </div>
        </div>
      </div>

      {/* Housing Status Panel */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Housing Application Status</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Priority Level</div>
            <div className="text-green-600 font-semibold">Priority B - Confirmed</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Housing Register</div>
            <div className="text-green-600 font-semibold">Active Registration</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Property Type</div>
            <div className="text-blue-600 font-semibold">2-Bedroom Unit</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Location</div>
            <div className="text-blue-600 font-semibold">Wellington Region</div>
          </div>
        </div>
      </div>

      {/* Expanded Services Panel */}
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
            <span className="text-sm">Eligibility Assessment</span>
          </div>
          {/* New services */}
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm font-medium">Housing Registry</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">NEW</span>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm font-medium">Property Matching</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">NEW</span>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            <span className="text-sm font-medium">Support Services</span>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">PENDING</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isNew ? 'bg-green-50 -mx-4 px-4 py-2 rounded-lg' : ''}`}>
            <div className="text-2xl flex-shrink-0">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{message.sender}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  message.isSystem ? 'text-blue-700 bg-blue-100' :
                  message.isNew ? 'text-green-700 bg-green-100' :
                  'text-gray-500 bg-gray-100'
                }`}>
                  {message.role}
                </span>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
                {message.isNew && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    JOINED
                  </span>
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.isSystem ? 'bg-blue-50 border-l-4 border-blue-400' :
                message.isNew ? 'bg-green-100' :
                'bg-gray-100'
              }`}>
                <p className="text-gray-800">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
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
        <div className="text-xs text-gray-500 mt-2">
          Forum expanded successfully! Kāinga Ora officer added and housing services activated.
        </div>
      </div>

      {/* Policy Hierarchy Display */}
      <div className="bg-gray-50 border-t p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Policy Hierarchy</h4>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            BasicHousingApplication v1.0
          </div>
          <span className="text-gray-400">→</span>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
            HousingCoordination v1.0
          </div>
          <span className="text-xs text-gray-500 ml-2">(Sub-policy created 09:25)</span>
        </div>
      </div>
    </div>
  );
}

export { ForumExpandedWithKO as HousingDemoStep1 };