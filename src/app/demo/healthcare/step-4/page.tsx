import Link from 'next/link';

// src/app/demo/healthcare/step-4/page.tsx
import PaymentServiceActivated from '@/components/demo/HealthcareDemoStep4';

export default function Step4Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Step 4: Payment Service Activated</h1>
              <p className="text-gray-600 text-sm">Stripe integration with multi-party payment splits</p>
            </div>
            <div className="flex gap-2">
              <Link href="/demo/healthcare/step-3" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Previous</Link>
              <Link href="/demo/healthcare/step-5" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next Step →</Link>
            </div>
          </div>
        </div>

        <PaymentServiceActivated />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Happening Here</h3>
          <p className="text-gray-700 mb-4">
            Now the doctor needs to charge for the consultation, so they type another rule to activate Stripe payment processing for $75. The system automatically configures an 80/20 split between doctor and platform. What started as a simple chat has become a complete healthcare workflow with integrated payments - all through natural language rules.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
            <p className="text-emerald-800 text-sm">
              <strong>PFSD:</strong> Service integration - payment processing activated within coordination workflow
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/demo/healthcare/step-3" className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            ← Previous: Forum Expansion
          </Link>
          <Link href="/demo/healthcare/step-5" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next: Audit Trail →
          </Link>
        </div>
      </div>
    </div>
  );
}