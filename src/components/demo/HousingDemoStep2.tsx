"use client"

import React, { useState } from 'react';

export default function CaseWorkerTypingKORule() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:15',
      message: 'Good morning Jordan. Thank you for coming in today. I understand you\'re currently without stable housing and need to get onto our housing register. Can you tell me about your current situation?',
      avatar: '👩‍💼'
    },
    {
      id: 2,
      sender: 'Jordan Williams',
      role: 'Housing Applicant',
      timestamp: '2025-10-07 09:17',
      message: 'Hi Sarah. I\'ve been staying at friends\' places for the past 2 months after my rental ended. I have a 6-year-old daughter who stays with me on weekends. We really need somewhere stable.',
      avatar: '👤'
    },
    {
      id: 3,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:19',
      message: 'I understand how stressful this must be for you both. Let me help you get registered and assess your priority level. Do you have income support currently, and are there any immediate safety concerns?',
      avatar: '👩‍💼'
    },
    {
      id: 4,
      sender: 'Jordan Williams',
      role: 'Housing Applicant',
      timestamp: '2025-10-07 09:21',
      message: 'Yes, I\'m on JobSeeker and get Working for Families for my daughter. No immediate safety issues, but I can\'t keep imposing on friends much longer. My daughter needs stability for school.',
      avatar: '👤'
    },
    {
      id: 5,
      sender: 'Sarah Mitchell',
      role: 'MSD Case Worker',
      timestamp: '2025-10-07 09:24',
      message: 'Based on your circumstances, you qualify for Priority B housing assistance. Let me bring Kāinga Ora into this coordination so we can get you properly registered and start looking at housing options.',
      avatar: '👩‍💼'
    }
  ]);

  const [currentInput] = useState('rule add housing_provider -> Policy("HousingCoordination", stakeholders=["Applicant", "MSD_CaseWorker", "KO_HousingOfficer"])');

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
            <div className="text-sm text-green-100">Policy: BasicHousingApplication v1.0</div>
            <div className="text-sm text-green-100">Created: Oct 7, 2025 09:15</div>
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
        </div>
      </div>

      {/* Current Services */}
      <div className="bg-gray-50 border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Services</h3>
        <div className="flex gap-3">
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Application Processing</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Document Upload</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm">Eligibility Assessment</span>
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
              <strong>Rule:</strong> add housing_provider → Policy("HousingCoordination")<br/>
              <strong>Action:</strong> Will add Kāinga Ora Housing Officer and activate housing services
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
              <span className="text-transparent">rule add housing_provider -&gt; Policy("HousingCoordination", stakeholders=["Applicant", "MSD_CaseWorker", "</span>
              <span className="bg-purple-200 text-purple-800 font-semibold">KO_HousingOfficer</span>
              <span className="text-transparent">"])</span>
            </div>
          </div>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <span>⚡</span>
            Execute Rule
          </button>
        </div>
        <div className="text-xs text-purple-600 mt-2 font-medium">
          ⚡ EleuScript Rule Detected: Press Execute to create HousingCoordination policy
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
            <div className="font-medium text-purple-700">HousingCoordination</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">New Stakeholder</div>
            <div className="font-medium text-purple-700">KO_HousingOfficer</div>
          </div>
        </div>
      </div>

      {/* Priority Assessment Display */}
      <div className="bg-orange-50 border-t border-orange-200 p-4">
        <h4 className="text-sm font-semibold text-orange-800 mb-2">Priority Assessment</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Household Composition</div>
            <div className="text-orange-700">Single parent + 1 child</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Housing Status</div>
            <div className="text-red-600">Temporary accommodation</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Income Support</div>
            <div className="text-green-600">Confirmed (JobSeeker + WFF)</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Estimated Priority</div>
            <div className="text-orange-600 font-semibold">Priority B (High Need)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CaseWorkerTypingKORule as HousingDemoStep2 };