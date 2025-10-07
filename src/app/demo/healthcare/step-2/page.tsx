import Link from 'next/link';

// src/app/demo/healthcare/step-2/page.tsx
import DoctorTypingPharmacyRule from '@/components/demo/HealthcareDemoStep2';

export default function Step2Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Step 2: Doctor Typing Pharmacy Rule</h1>
              <p className="text-gray-600 text-sm">EleuScript rule detection and syntax highlighting</p>
            </div>
            <div className="flex gap-2">
              <Link href="/demo/healthcare/step-1" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Previous</Link>
              <Link href="/demo/healthcare/step-3" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Step →</Link>
            </div>
          </div>
        </div>

        <DoctorTypingPharmacyRule />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Happening Here</h3>
          <p className="text-gray-700 mb-4">
            The doctor realizes they need to prescribe medication, so they type a simple rule directly into the chat: "rule add pharmacy → Policy('PrescriptionFulfillment')". Notice the purple highlighting - Eleutherios detects this as an EleuScript rule that will create a new policy and expand the forum's capabilities to include prescription services.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
            <p className="text-purple-800 text-sm">
              <strong>PFSD:</strong> Policy evolution through natural language - new sub-policy will be created
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/demo/healthcare/step-1" className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            ← Previous: Basic Forum
          </Link>
          <Link href="/demo/healthcare/step-3" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next: Forum Expands →
          </Link>
        </div>
      </div>
    </div>
  );
}