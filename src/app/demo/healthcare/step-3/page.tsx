import Link from 'next/link';

// src/app/demo/healthcare/step-3/page.tsx
import ForumExpandedWithPharmacist from '@/components/demo/HealthcareDemoStep3';

export default function Step3Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Step 3: Forum Expanded with Pharmacist</h1>
              <p className="text-gray-600 text-sm">Real-time capability expansion and stakeholder addition</p>
            </div>
            <div className="flex gap-2">
              <Link href="/demo/healthcare/step-2" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Previous</Link>
              <Link href="/demo/healthcare/step-4" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Step →</Link>
            </div>
          </div>
        </div>

        <ForumExpandedWithPharmacist />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Happening Here</h3>
          <p className="text-gray-700 mb-4">
            The moment the doctor executed that rule, the forum automatically evolved. A pharmacist from Wellington Central Pharmacy joined the conversation, new services like prescription processing activated, and the policy hierarchy updated to show we now have a PrescriptionFulfillment sub-policy. The forum grew more sophisticated based on real coordination needs.
          </p>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-800 text-sm">
              <strong>PFSD:</strong> Forum → Service expansion - new stakeholder coordination enabled with prescription capabilities
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/demo/healthcare/step-2" className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            ← Previous: Rule Input
          </Link>
          <Link href="/demo/healthcare/step-4" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next: Payment Activation →
          </Link>
        </div>
      </div>
    </div>
  );
}