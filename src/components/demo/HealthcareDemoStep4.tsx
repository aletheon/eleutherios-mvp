"use client"

import React, { useState } from 'react';

export default function PaymentServiceActivated() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:38',
      message: 'Based on your symptoms, I\'d like to prescribe some medication for you and run a few tests. Let me add our pharmacy partner to coordinate your prescription.',
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-06 14:39',
      message: 'PrescriptionFulfillment policy created successfully. Pharmacist has been added to the forum. Prescription services are now active.',
      avatar: '⚡',
      isSystem: true
    },
    {
      id: 3,
      sender: 'Maria Rodriguez',
      role: 'Pharmacist',
      timestamp: '2025-10-06 14:40',
      message: 'Hello Dr. Chen and Alex! I\'m Maria from Wellington Central Pharmacy. I\'ve joined the consultation to assist with prescription fulfillment. Dr. Chen, please send through the prescription details when ready.',
      avatar: '💊'
    },
    {
      id: 4,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:42',
      message: 'Thank you Maria. Alex, I\'m prescribing Lisinopril 10mg for blood pressure management. The prescription will need to be filled and there\'s a consultation fee of $75. Let me activate payment processing.',
      avatar: '👩‍⚕️'
    },
    {
      id: 5,
      sender: 'Dr. Sarah Chen',
      role: 'Doctor',
      timestamp: '2025-10-06 14:43',
      message: 'rule activate payment -> Service("StripePayment", amount=75, currency="NZD", recipients=["doctor", "platform"])',
      avatar: '👩‍⚕️',
      isEleuScript: true
    },
    {
      id: 6,
      sender: 'System',
      role: 'System',
      timestamp: '2025-10-06 14:43',
      message: 'Payment service activated successfully! Stripe payment processing is now available. Payment intent created for $75 NZD.',
      avatar: '💳',
      isSystem: true,
      isPayment: true
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
            <div className="text-sm text-blue-100">Policy: PrescriptionFulfillment v1.0</div>
            <div className="text-sm text-blue-100">Updated: Oct 6, 2025 14:43</div>
            <div className="text-xs text-blue-200">Parent: BasicConsultationPolicy</div>
          </div>
        </div>
      </div>

      {/* Payment Activation Alert */}
      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-emerald-400 text-lg">💳</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-emerald-700">
              <strong>Payment Service Activated:</strong> Stripe payment processing enabled for consultation fees
            </p>
            <div className="mt-1 text-xs text-emerald-600">
              Amount: $75 NZD • Recipients: Dr. Chen (80%), Platform (20%) • Payment intent: pi_1J5K2L3M4N5O6P7Q
            </div>
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
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span className="text-lg">💊</span>
            <div>
              <div className="text-sm font-medium">Maria Rodriguez</div>
              <div className="text-xs text-gray-500">Wellington Central Pharmacy</div>
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
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Prescription Processing</span>
          </div>
          {/* Payment service highlighted */}
          <div className="bg-emerald-50 px-3 py-2 rounded-lg border-2 border-emerald-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <span className="text-sm font-medium">Stripe Payment Processing</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm">Pharmacy Delivery</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${
            message.isPayment ? 'bg-emerald-50 -mx-4 px-4 py-2 rounded-lg' : ''
          }`}>
            <div className="text-2xl flex-shrink-0">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{message.sender}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  message.isSystem ? 'text-blue-700 bg-blue-100' :
                  message.isPayment ? 'text-emerald-700 bg-emerald-100' :
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
                message.isSystem && message.isPayment ? 'bg-emerald-50 border-l-4 border-emerald-400' :
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

      {/* Payment Processing Panel */}
      <div className="bg-emerald-50 border-t border-emerald-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">Payment Ready</h3>
            <p className="text-sm text-emerald-600">Consultation fee payment is ready for processing</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-700">$75.00 NZD</div>
            <div className="text-sm text-emerald-600">Consultation Fee</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Split</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Dr. Sarah Chen (80%)</span>
                <span className="font-medium">$60.00</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (20%)</span>
                <span className="font-medium">$15.00</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Method: Card/Bank Transfer</div>
              <div>Currency: NZD</div>
              <div>Intent: pi_1J5K2L3M4N5O6P7Q</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
            <span>💳</span>
            Process Payment
          </button>
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            Review Details
          </button>
        </div>
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
        <div className="text-xs text-emerald-600 mt-2 font-medium">
          💳 Payment service activated! Stripe processing ready for $75 consultation fee.
        </div>
      </div>
    </div>
  );
}