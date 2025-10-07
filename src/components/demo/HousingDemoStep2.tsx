"use client"

import React, { useState } from 'react';

export function CaseWorkerTypingKORule() {
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
    }
  ]);

  const [currentRule, setCurrentRule] = useState('rule add housing_provider -> Policy("HousingCoordination", stakeholder="KO_HousingOfficer")');
  const [showRuleDetection, setShowRuleDetection] = useState(true);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Forum Header */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Housing Application Forum</h1>
            <p className="text-blue-100">Applicant: Jordan Williams | Application ID: #HA-2025-1007</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Policy: BasicHousingApplication v1.0</div>
            <div className="text-sm text-blue-100">Created: Oct 7, 2025 09:15</div>
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

      {/* Services Panel */}
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

      {/* EleuScript Rule Detection Alert */}
      {showRuleDetection && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-purple-400 text-lg">⚡</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                <strong>EleuScript Rule Detected:</strong> Policy creation rule recognized - will create sub-policy and expand forum capabilities
              </p>
              <div className="mt-1 text-xs text-purple-600">
                <strong>Rule:</strong> add housing_provider → Policy('HousingCoordination') <br/>
                <strong>Action:</strong> Will add Kāinga Ora Housing Officer and activate housing services
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Input with Fixed Stakeholder Indicator */}
      <div className="border-t p-4">
        {/* Stakeholder Indicator - Now Above Input */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm text-gray-600">Typing as:</span>
          <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
            <span className="text-sm">👩‍💼</span>
            <span className="text-sm font-medium text-blue-900">Sarah Mitchell</span>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">MSD Case Worker</span>
          </div>
        </div>

        {/* Input Field - Now Fully Visible */}
        <div className="flex gap-2">
          <input
            type="text"
            value={currentRule}
            onChange={(e) => setCurrentRule(e.target.value)}
            placeholder="Type your message or EleuScript rule..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
          />
          <button className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 font-medium">
            Execute Rule
          </button>
        </div>

        {/* Rule Detection Hint */}
        <div className="text-xs text-purple-600 mt-2 flex items-center gap-1">
          <span>⚡</span>
          <span>EleuScript Rule Detected: Press Execute to create HousingCoordination policy</span>
        </div>
      </div>

      {/* Rule Analysis Panel */}
      <div className="bg-gray-50 border-t p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Rule Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-600">RULE TARGET</div>
            <div className="text-purple-600 font-semibold">Policy</div>
          </div>
          <div>
            <div className="font-medium text-gray-600">POLICY NAME</div>
            <div className="text-purple-600 font-semibold">HousingCoordination</div>
          </div>
          <div>
            <div className="font-medium text-gray-600">NEW STAKEHOLDER</div>
            <div className="text-purple-600 font-semibold">KO_HousingOfficer</div>
          </div>
        </div>

        {/* Priority Assessment */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-gray-700 mb-1">Priority Assessment</h5>
            <div className="space-y-1 text-xs">
              <div><strong>Household Composition:</strong> <span className="text-orange-600">Single parent + 1 child</span></div>
              <div><strong>Income Support:</strong> <span className="text-green-600">Confirmed (JobSeeker + WFF)</span></div>
            </div>
          </div>
          <div>
            <div className="space-y-1 text-xs">
              <div><strong>Housing Status:</strong> <span className="text-orange-600">Temporary accommodation</span></div>
              <div><strong>Estimated Priority:</strong> <span className="text-orange-600">Priority B (High Need)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CaseWorkerTypingKORule as HousingDemoStep2 };