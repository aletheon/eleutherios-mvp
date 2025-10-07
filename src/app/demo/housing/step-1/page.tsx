import { HousingDemoStep1 } from '../../../../components/demo/HousingDemoStep1';
import Link from 'next/link';

export default function HousingStep1Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/demo/housing" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Housing Demo Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 1: Initial Housing Application Forum
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Jordan Williams, a single parent, starts a housing application conversation with their MSD Case Worker. 
            This shows the basic forum state before any coordination expansion.
          </p>
        </div>

        {/* Demo Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <HousingDemoStep1 />
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">What's Happening</h2>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Initial participants:</strong> Housing applicant and MSD Case Worker</p>
            <p>• <strong>Current services:</strong> Basic housing application and case management</p>
            <p>• <strong>Forum capabilities:</strong> Standard discussion and document sharing</p>
            <p>• <strong>Next step:</strong> Case worker will expand coordination to include Kāinga Ora</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Link 
            href="/demo/housing" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Demo Overview
          </Link>
          <Link 
            href="/demo/housing/step-2" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next: Add Kāinga Ora →
          </Link>
        </div>
      </div>
    </div>
  );
}