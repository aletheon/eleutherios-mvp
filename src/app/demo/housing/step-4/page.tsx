import { HousingDemoStep4 } from '../../../../components/demo/HousingDemoStep4';
import Link from 'next/link';

export default function HousingStep4Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/demo/housing" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Housing Demo Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 4: Support Services Activated
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            With housing placement confirmed, additional support services automatically activate. Bond assistance, 
            transport coordination, and emergency payments are now integrated into the workflow with multi-party 
            payment processing.
          </p>
        </div>

        {/* Demo Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <HousingDemoStep4 />
        </div>

        {/* Financial Integration */}
        <div className="bg-emerald-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-emerald-900 mb-3">Integrated Financial Support</h2>
          <div className="text-emerald-800 space-y-2">
            <p>• <strong>Bond assistance:</strong> $2,400 processing through MSD systems</p>
            <p>• <strong>Transport support:</strong> $200 for moving and appointment transport</p>
            <p>• <strong>Platform coordination:</strong> 20% fee for coordination services ($520)</p>
            <p>• <strong>Multi-party processing:</strong> Payments split between agencies automatically</p>
          </div>
        </div>

        {/* Service Evolution */}
        <div className="bg-cyan-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-cyan-900 mb-3">Dynamic Service Evolution</h2>
          <div className="text-cyan-800 space-y-2">
            <p>• <strong>Automatic activation:</strong> Services added based on identified needs</p>
            <p>• <strong>Financial coordination:</strong> Payments processed across multiple agencies</p>
            <p>• <strong>Complete workflow:</strong> From housing application to move-in support</p>
            <p>• <strong>Real-time processing:</strong> No delays between approval and payment</p>
          </div>
        </div>

        {/* Business Model Demo */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibent text-orange-900 mb-3">Platform Business Model</h2>
          <div className="text-orange-800 space-y-2">
            <p>• <strong>Value creation:</strong> Coordination reduces administrative overhead</p>
            <p>• <strong>Government savings:</strong> Faster processing, reduced duplicate work</p>
            <p>• <strong>Service provider revenue:</strong> 80% of fees go directly to service providers</p>
            <p>• <strong>Platform sustainability:</strong> 20% coordination fee supports platform development</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Link 
            href="/demo/housing/step-3" 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous: Multi-Agency Forum
          </Link>
          <Link 
            href="/demo/housing/step-5" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next: Audit Trail →
          </Link>
        </div>
      </div>
    </div>
  );
}