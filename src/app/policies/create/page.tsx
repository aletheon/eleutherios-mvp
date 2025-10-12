// src/app/policies/create/page.tsx
'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function CreatePolicyPage() {
  return (
    <DashboardLayout>
      {/* Back to Policies Link */}
      <div className="mb-6">
        <Link href="/policies" className="text-blue-600 hover:text-blue-700 flex items-center">
          <span className="material-icons mr-2">arrow_back</span>
          Back to Policies
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Policy</h1>
      </div>

      {/* Create Policy Form */}
      <div className="max-w-4xl">
        {/* Policy Information Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Social Housing, Tenancy Takeover, Housing Policy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="housing">Housing</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="employment">Employment</option>
                <option value="social-services">Social Services</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the purpose and scope of this policy..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Forum Rules Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Forum Rules (EleuScript)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                placeholder="e.g., CreateCoordinationForum"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forum Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Emergency Housing Coordination"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stakeholders
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Caseworker, Housing Officer, Person"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe what this rule does..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Add Forum Rule
          </button>
        </div>

        {/* EleuScript Preview Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">EleuScript Preview</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="text-purple-400">policy</div>
            <span className="text-blue-400"> YourPolicyName </span>
            <span className="text-white">{"{"}</span>
            <br />
            <div className="ml-4 text-gray-500">// Your rules will appear here as you add them</div>
            <br />
            <span className="text-white">{"}"}</span>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            After creating this policy, you'll be able to invite other policymakers (like MSD case workers or homeless individuals) to 
            collaborate. The EleuScript rules you've added will enable automatic forum creation and stakeholder coordination.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Create Policy
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}