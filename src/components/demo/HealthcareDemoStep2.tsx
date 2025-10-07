"use client"

import React, { useState } from 'react';

export default function DoctorTypingPharmacyRule() {
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
    }
  ]);

  const [currentInput] = useState('rule add pharmacy -> Policy("PrescriptionFulfillment", stakeholders=["Patient", "Doctor", "Pharmacist"])');

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Forum Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Medical Consultation Forum</h1>
            <p className="text-blue-100">Patient: Alex Thompson | Case ID: #MC-2025-1006</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Policy: BasicConsultationPolicy v1.0</div>
            <div className="text-sm text-blue-100">Created: Oct 6, 2025 14:30</div>
          </div>
        </div>
      </div>

      {/* Stakeholders Panel */}
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
        </div>
      </div>

      {/* Current Services */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Services</h3>
        <div className="flex gap-3">
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
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="text-2xl flex-shrink-0">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{message.sender}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {message.role}
                </span>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-gray-800">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EleuScript Detection Alert */}
      <div className="mx-4 mb-4 bg-purple-50 border-l-4 border-purple-400 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-purple-400 text-lg">⚡</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-purple-700">
              <strong>EleuScript Rule Detected:</strong> Policy creation rule recognized - will create sub-policy and expand forum capabilities
            </p>
            <div className="mt-2 text-xs text-purple-600">
              <strong>Rule:</strong> add pharmacy → Policy("PrescriptionFulfillment")<br/>
              <strong>Action:</strong> Will add Pharmacist stakeholder and activate prescription services
            </div>
          </div>
        </div>
      </div>

      {/* Message Input with EleuScript */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentInput}
              readOnly
              className="w-full p-3 border border-purple-300 rounded-lg bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* Purple highlighting overlay */}
            <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
              <span className="text-transparent">rule add pharmacy -&gt; Policy("PrescriptionFulfillment", stakeholders=["Patient", "Doctor", "</span>
              <span className="bg-purple-200 text-purple-800 font-semibold">Pharmacist</span>
              <span className="text-transparent">"])</span>
            </div>
          </div>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <span>⚡</span>
            Execute Rule
          </button>
        </div>
        <div className="text-xs text-purple-600 mt-2 font-medium">
          ⚡ EleuScript Rule Detected: Press Execute to create PrescriptionFulfillment policy
        </div>
      </div>

      {/* Rule Parsing Display */}
      <div className="bg-gray-50 border-t p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Rule Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Rule Target</div>
            <div className="font-medium text-purple-700">Policy</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Policy Name</div>
            <div className="font-medium text-purple-700">PrescriptionFulfillment</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">New Stakeholder</div>
            <div className="font-medium text-purple-700">Pharmacist</div>
          </div>
        </div>
      </div>
    </div>
  );
}