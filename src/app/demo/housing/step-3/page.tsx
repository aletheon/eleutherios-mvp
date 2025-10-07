import { HousingDemoStep3 } from '../../../../components/demo/HousingDemoStep3';
import Link from 'next/link';

export default function HousingStep3Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/demo/housing" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Housing Demo Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 3: Multi-Agency Forum Active
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            The forum has automatically evolved into a multi-agency coordination space. Kāinga Ora Housing Officer 
            has joined and Priority B housing registration is now activated. Three agencies now working together.
          </p>
        </div>

        {/* Demo Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <HousingDemoStep3 />
        </div>

        {/* Stakeholder Analysis */}
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-3">Active Stakeholders</h2>
          <div className="text-purple-800 space-y-2">
            <p>• <strong>Jordan Williams:</strong> Housing applicant with documented needs</p>
            <p>• <strong>Sarah Chen (MSD):</strong> Case worker coordinating social services</p>
            <p>• <strong>Michael Roberts (Kāinga Ora):</strong> Housing Officer managing placement</p>
            <p>• <strong>Priority B Status:</strong> Urgent housing need classification activated</p>
          </div>
        </div>

        {/* Coordination Benefits */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">Coordination Benefits</h2>
          <div className="text-indigo-800 space-y-2">
            <p>• <strong>Real-time communication:</strong> All agencies in same conversation</p>
            <p>• <strong>Shared documentation:</strong> No duplicate data entry across departments</p>
            <p>• <strong>Coordinated decision-making:</strong> Faster assessment and placement</p>
            <p>• <strong>Complete visibility:</strong> All stakeholders see full context</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Link 
            href="/demo/housing/step-2" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous: Add Kāinga Ora
          </Link>
          <Link 
            href="/demo/housing/step-4" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next: Support Services →
          </Link>
        </div>
      </div>
    </div>
  );
}