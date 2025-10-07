import { HousingDemoStep5 } from '../../../../components/demo/HousingDemoStep5';
import Link from 'next/link';

export default function HousingStep5Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/demo/housing" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Housing Demo Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 5: Complete Audit Trail & Transparency
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Every coordination action, rule execution, service activation, and payment is logged with complete 
            transparency. This ensures government accountability and compliance with Privacy Act and Social Security Act requirements.
          </p>
        </div>

        {/* Demo Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <HousingDemoStep5 />
        </div>

        {/* Governance Benefits */}
        <div className="bg-violet-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-violet-900 mb-3">Government Accountability</h2>
          <div className="text-violet-800 space-y-2">
            <p>• <strong>Complete audit trail:</strong> Every decision and action logged with timestamps</p>
            <p>• <strong>Multi-agency transparency:</strong> Full visibility into coordination processes</p>
            <p>• <strong>Compliance tracking:</strong> Privacy Act and Social Security Act adherence</p>
            <p>• <strong>Performance metrics:</strong> Measurable outcomes for service delivery</p>
          </div>
        </div>

        {/* Privacy and Security */}
        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Privacy Protection</h2>
          <div className="text-slate-800 space-y-2">
            <p>• <strong>Data minimization:</strong> Only necessary information shared between agencies</p>
            <p>• <strong>Access controls:</strong> Role-based permissions for sensitive information</p>
            <p>• <strong>Audit logging:</strong> Complete record of who accessed what information when</p>
            <p>• <strong>Consent tracking:</strong> Clear record of Jordan's permissions and preferences</p>
          </div>
        </div>

        {/* Coordination Evolution Summary */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Coordination Journey Summary</h2>
          <div className="text-blue-800 space-y-3">
            <div className="border-l-4 border-blue-300 pl-4">
              <p><strong>Step 1:</strong> Initial housing application (Jordan + MSD Case Worker)</p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p><strong>Step 2:</strong> Natural language rule adds Kāinga Ora coordination</p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p><strong>Step 3:</strong> Multi-agency forum with Priority B housing status</p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p><strong>Step 4:</strong> Support services activated ($2,600 in assistance)</p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p><strong>Step 5:</strong> Complete audit trail for government transparency</p>
            </div>
          </div>
        </div>

        {/* Platform Value Proposition */}
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-3">Platform Value Demonstrated</h2>
          <div className="text-green-800 space-y-2">
            <p>• <strong>Coordination efficiency:</strong> 5 agencies working in single forum</p>
            <p>• <strong>Reduced administrative overhead:</strong> No duplicate data entry or handoffs</p>
            <p>• <strong>Faster service delivery:</strong> Real-time coordination and decision-making</p>
            <p>• <strong>Improved outcomes:</strong> Comprehensive support addressing multiple needs</p>
            <p>• <strong>Government transparency:</strong> Complete audit trail for public accountability</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Link 
            href="/demo/housing/step-4" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous: Support Services
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/demo/housing" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Demo Overview
            </Link>
            <Link 
              href="/demo/healthcare" 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Healthcare Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}