"use client"

import React, { useState } from 'react';

export default function BasicDoctorPatientForum() {
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
    }
  ]);

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
          💡 Tip: Type "rule" to create policies or activate services
        </div>
      </div>
    </div>
  );
}