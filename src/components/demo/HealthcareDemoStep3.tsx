"use client"

import React, { useState } from 'react';

export default function ForumExpandedWithPharmacist() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:30',
      message: 'Hello Alex, thank you for joining the consultation forum. I see from your notes that you\'ve been experiencing some chest discomfort. Can you tell me more about when this started?',
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      sender: 'Alex Thompson',
      role: 'Patient',
      timestamp: '2025-10-06 14:32',
      message: 'Hi Dr. Chen, thanks for seeing me. The chest discomfort started about 3 days ago, mainly when I\'m walking upstairs or doing physical activity. It feels like a tight pressure.',
      avatar: '👤'
    },
    {
      id: 3,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:34',
      message: 'I understand. Have you experienced any shortness of breath, dizziness, or pain radiating to your arm or jaw along with the chest pressure?',
      avatar: '👩‍⚕️'
    },
    {
      id: 4,
      sender: 'Alex Thompson',
      role: 'Patient',
      timestamp: '2025-10-06 14:35',
      message: 'Yes, some shortness of breath when climbing stairs. No dizziness or arm pain though.',
      avatar: '👤'
    },
    {
      id: 5,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:38',
      message: 'Based on your symptoms, I\'d like to prescribe some medication for you and run a few tests. Let me add our pharmacy partner to coordinate your prescription.',
      avatar: '👩‍⚕️'
    },
    {
      id: 6,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-06 14:39',
      message: 'PrescriptionFulfillment policy created successfully. Pharmacist has been added to the forum. Prescription services are now active.',
      avatar: '⚡',
      isSystem: true
    },
    {
      id: 7,
      sender: 'Maria Rodriguez',
      role: 'Pharmacist',
      timestamp: '2025-10-06 14:40',
      message: 'Hello Dr. Chen and Alex! I\'m Maria from Wellington Central Pharmacy. I\'ve joined the consultation to assist with prescription fulfillment. Dr. Chen, please send through the prescription details when ready.',
      avatar: '💊',
      isNew: true
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Forum Header - Updated */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Medical Consultation Forum</h1>
            <p className="text-blue-100">Patient: Alex Thompson | Case ID: #MC-2025-1006</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Policy: PrescriptionFulfillment v1.0</div>
            <div className="text-sm text-blue-100">Updated: Oct 6, 2025 14:39</div>
            <div className="text-xs text-blue-200">Parent: BasicConsultationPolicy</div>
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
              <strong>Forum Expanded Successfully:</strong> PrescriptionFulfillment sub-policy created
            </p>
            <div className="mt-1 text-xs text-green-600">
              New stakeholder added: Pharmacist • Prescription services activated • Parent policy linked
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Stakeholders Panel */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Stakeholders</h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">👩‍⚕️</span>
            <div>
              <div className="text-sm font-medium">Dr. Sarah Chen</div>
              <div className="text-xs text-gray-500">General Practitioner</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">👤</span>
            <div>
              <div className="text-sm font-medium">Alex Thompson</div>
              <div className="text-xs text-gray-500">Patient</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          {/* New Pharmacist */}
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 relative">
            <span className="text-lg">💊</span>
            <div>
              <div className="text-sm font-medium">Maria Rodriguez</div>
              <div className="text-xs text-gray-500">Wellington Central Pharmacy</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {/* New badge */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Services Panel */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Services</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Consultation Chat</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">File Upload</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm">Appointment Booking</span>
          </div>
          {/* New services */}
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm font-medium">Prescription Processing</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">NEW</span>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            <span className="text-sm font-medium">Payment Processing</span>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">PENDING</span>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg border-2 border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm font-medium">Pharmacy Delivery</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">NEW</span>
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
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Forum expanded successfully! Pharmacist added and prescription services activated.
        </div>
      </div>

      {/* Policy Hierarchy Display */}
      <div className="bg-gray-50 border-t p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Policy Hierarchy</h4>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            BasicConsultationPolicy v1.0
          </div>
          <span className="text-gray-400">→</span>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
            PrescriptionFulfillment v1.0
          </div>
          <span className="text-xs text-gray-500 ml-2">(Sub-policy created 14:39)</span>
        </div>
      </div>
    </div>
  );
}