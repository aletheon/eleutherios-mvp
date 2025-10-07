import Link from 'next/link';

// src/app/demo/healthcare/step-5/page.tsx
import PolicyEvolutionAuditTrail from '@/components/demo/HealthcareDemoStep5';

export default function Step5Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Step 5: Complete Audit Trail</h1>
              <p className="text-gray-600 text-sm">Full governance transparency and compliance logging</p>
            </div>
            <div className="flex gap-2">
              <Link href="/demo/healthcare/step-4" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Previous</Link>
              <Link href="/demo/healthcare" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Demo Complete</Link>
            </div>
          </div>
        </div>

        <PolicyEvolutionAuditTrail />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Happening Here</h3>
          <p className="text-gray-700 mb-4">
            Every single action is transparently logged in the audit trail. You can see the complete timeline: forum creation at 14:30, pharmacist addition at 14:39, payment activation at 14:43. This demonstrates the "Data" component of PFSD - complete governance transparency showing how policies evolved, who made decisions, and what services were activated.
          </p>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <p className="text-gray-800 text-sm">
              <strong>PFSD:</strong> Data transparency - complete audit trail of policy evolution and stakeholder decisions
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Demo Complete</h3>
          <p className="text-blue-800 mb-4">
            You've seen how Eleutherios transforms static forums into dynamic coordination environments. 
            The sequence shows how stakeholders can organically expand coordination capabilities through 
            conversation rather than being locked into predetermined system constraints.
          </p>
          <div className="flex gap-3">
            <Link href="/demo/healthcare" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Full Demo
            </Link>
            <Link href="/demo/healthcare/step-1" className="px-6 py-3 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
              Restart Demo
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/demo/healthcare/step-4" className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            ← Previous: Payment Activation
          </Link>
          <Link href="/demo/healthcare" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
            Demo Complete ✓
          </Link>
        </div>
      </div>
    </div>
  );
}