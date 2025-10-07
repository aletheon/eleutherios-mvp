import Link from 'next/link';

// src/app/demo/healthcare/step-1/page.tsx
import BasicDoctorPatientForum from '@/components/demo/HealthcareDemoStep1';

export default function Step1Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Navigation Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Step 1: Basic Doctor-Patient Forum</h1>
              <p className="text-gray-600 text-sm">Initial medical consultation forum with doctor and patient</p>
            </div>
            <div className="flex gap-2">
              <Link href="/demo/healthcare" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Overview</Link>
              <Link href="/demo/healthcare/step-2" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Step →</Link>
            </div>
          </div>
        </div>

        {/* Demo Component */}
        <BasicDoctorPatientForum />

        {/* Explanation */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Happening Here</h3>
          <p className="text-gray-700 mb-4">
            Eleutherios is built upon the PFSD (Policy, Forum, Service, Data) protocol to enable stakeholders to have a dynamic coordination conversation in real-time. In this example there is a doctor and patient discussing chest symptoms in a secure consultation forum with basic chat and file sharing capabilities.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-800 text-sm">
              <strong>PFSD:</strong> BasicConsultationPolicy → Forum instantiation with defined stakeholders and permissions
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mt-6 flex justify-between">
          <Link href="/demo/healthcare" className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            ← Back to Overview
          </Link>
          <Link href="/demo/healthcare/step-2" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next: Doctor Types Rule →
          </Link>
        </div>
      </div>
    </div>
  );
}
