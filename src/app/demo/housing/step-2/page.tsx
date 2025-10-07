import { HousingDemoStep2 } from '../../../../components/demo/HousingDemoStep2';
import Link from 'next/link';

export default function HousingStep2Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/demo/housing" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Housing Demo Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 2: Case Worker Adds Kāinga Ora
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            The MSD Case Worker identifies that Jordan needs priority housing placement and types a natural language rule 
            to expand the forum capabilities. Watch how a simple command transforms the coordination.
          </p>
        </div>

        {/* Demo Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <HousingDemoStep2 />
        </div>

        {/* Explanation */}
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-3">The EleuScript Rule</h2>
          <div className="text-green-800 space-y-2">
            <p>• <strong>Rule typed:</strong> "rule add kāinga_ora → Policy('PriorityHousing')"</p>
            <p>• <strong>Natural language:</strong> No technical skills required to expand capabilities</p>
            <p>• <strong>Instant evolution:</strong> Forum capabilities expand automatically</p>
            <p>• <strong>Multi-agency coordination:</strong> MSD and Kāinga Ora now working together</p>
          </div>
        </div>

        {/* Technical Note */}
        <div className="bg-amber-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-3">Behind the Scenes</h2>
          <div className="text-amber-800 space-y-2">
            <p>• Policy('PriorityHousing') defines new stakeholders and capabilities</p>
            <p>• Kāinga Ora Housing Officer automatically invited to join</p>
            <p>• Housing assessment and priority registration services activated</p>
            <p>• All changes logged for government transparency and compliance</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Link 
            href="/demo/housing/step-1" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous: Initial Forum
          </Link>
          <Link 
            href="/demo/housing/step-3" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next: Multi-Agency Forum →
          </Link>
        </div>
      </div>
    </div>
  );
}