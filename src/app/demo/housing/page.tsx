// src/app/demo/housing/page.tsx

import Link from 'next/link';

export default function HousingDemoPage() {
  const demoSteps = [
    {
      step: 1,
      title: "Initial Housing Application Forum",
      description: "Jordan Williams (single parent) starts housing application with MSD Case Worker. Shows basic forum capabilities before coordination expansion.",
      screenshot: "/screenshots/housing-step-1-initial-forum.png"
    },
    {
      step: 2,
      title: "Case Worker Adds Kāinga Ora",
      description: "MSD Case Worker types EleuScript rule to bring Kāinga Ora into coordination. Shows multi-agency rule execution in real-time.",
      screenshot: "/screenshots/housing-step-2-add-ko.png"
    },
    {
      step: 3,
      title: "Multi-Agency Forum Active",
      description: "Kāinga Ora Housing Officer joins, Priority B housing status activated. Demonstrates inter-agency coordination capabilities.",
      screenshot: "/screenshots/housing-step-3-multi-agency.png"
    },
    {
      step: 4,
      title: "Support Services Activated", 
      description: "Bond assistance ($2,400), transport coordination, and emergency payments integrated. Shows comprehensive service integration.",
      screenshot: "/screenshots/housing-step-4-support-services.png"
    },
    {
      step: 5,
      title: "Government Transparency Audit",
      description: "Complete audit trail of inter-agency coordination decisions. Demonstrates Privacy Act and Social Security Act compliance.",
      screenshot: "/screenshots/housing-step-5-audit-trail.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eleutherios Housing Coordination Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how natural language rules transform a basic housing application into 
            sophisticated multi-agency coordination with MSD, Kāinga Ora, and integrated 
            support services worth $2,600.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>Government Coordination:</strong> MSD Case Worker types simple rule → 
              Kāinga Ora automatically joins → Support services activate with full audit transparency
            </p>
          </div>
        </div>

        {/* Key Stakeholders */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Stakeholders</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Jordan Williams</h4>
              <p className="text-sm text-purple-800">Single parent seeking stable housing for family, currently staying with friends</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Sarah Mitchell (MSD)</h4>
              <p className="text-sm text-green-800">Case Worker coordinating social services and housing assistance eligibility</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Michael Chen (Kāinga Ora)</h4>
              <p className="text-sm text-blue-800">Housing Officer managing Priority B applications and property placement</p>
            </div>
          </div>
        </div>

        {/* Demo Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoSteps.map((step) => (
            <Link 
              key={step.step}
              href={`/demo/housing/step-${step.step}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border hover:border-blue-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {step.description}
                </p>
                <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center text-gray-500 text-sm">
                  Housing Demo Preview
                  {/* You can replace this with actual screenshot images */}
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Interactive Demo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap gap-3">
            {demoSteps.map((step) => (
              <Link
                key={step.step}
                href={`/demo/housing/step-${step.step}`}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Step {step.step}: {step.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Housing Workflow Features */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Housing Coordination Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Multi-Agency Coordination</h4>
              <p className="text-gray-600 text-sm">
                MSD and Kāinga Ora work together in shared forum space with real-time 
                communication and coordinated decision-making.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Priority Assessment</h4>
              <p className="text-gray-600 text-sm">
                Automatic Priority B housing registration based on family circumstances 
                and housing need assessment.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Integrated Support Services</h4>
              <p className="text-gray-600 text-sm">
                Bond assistance ($2,400), transport coordination, and emergency payments 
                activate automatically based on eligibility.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Government Compliance</h4>
              <p className="text-gray-600 text-sm">
                Complete audit trails ensure Privacy Act and Social Security Act 
                compliance with full decision transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Integration */}
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            Support Services Integration ($2,600 Total)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Bond Assistance</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">$2,400</div>
              <p className="text-sm text-gray-600">Rental bond payment processed through MSD systems</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Transport Support</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">$200</div>
              <p className="text-sm text-gray-600">Moving assistance and appointment transport</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Platform Fee</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">$520</div>
              <p className="text-sm text-gray-600">20% coordination fee (80% to service providers)</p>
            </div>
          </div>
        </div>

        {/* Government Benefit */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Government Efficiency Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Reduced Administrative Overhead</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No duplicate data entry between MSD and Kāinga Ora</li>
                <li>• Real-time coordination reduces phone tag and emails</li>
                <li>• Shared documentation and decision history</li>
                <li>• Faster processing from application to housing placement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Improved Service Delivery</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Coordinated support services reduce service gaps</li>
                <li>• Complete visibility into applicant needs and progress</li>
                <li>• Automated eligibility and priority assessment</li>
                <li>• Better outcomes through multi-agency collaboration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cross-Demo Navigation */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Compare Coordination Patterns
          </h3>
          <p className="text-gray-600 mb-4">
            See how the same coordination principles work across different domains with 
            different stakeholders, services, and payment flows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/demo/healthcare"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Healthcare Coordination Demo
            </Link>
            <Link 
              href="/demo"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              All Platform Demos
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            This housing coordination demo shows how Eleutherios enables multi-agency 
            government collaboration with complete transparency and compliance.
          </p>
        </div>
      </div>
    </div>
  );
}