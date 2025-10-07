// src/app/demo/page.tsx

import Link from 'next/link';

export default function MainDemoPage() {
  const healthcareSteps = [
    {
      step: 1,
      title: "Doctor-Patient Forum",
      description: "Initial medical consultation with basic chat capabilities",
      path: "/demo/healthcare/step-1"
    },
    {
      step: 2,
      title: "Adding Pharmacy",
      description: "Doctor types rule to expand coordination capabilities",
      path: "/demo/healthcare/step-2"
    },
    {
      step: 3,
      title: "Multi-Stakeholder Forum",
      description: "Pharmacist joins, prescription services activate",
      path: "/demo/healthcare/step-3"
    },
    {
      step: 4,
      title: "Payment Integration",
      description: "Stripe processing with multi-party revenue splits",
      path: "/demo/healthcare/step-4"
    },
    {
      step: 5,
      title: "Healthcare Audit Trail",
      description: "Complete transparency and compliance logging",
      path: "/demo/healthcare/step-5"
    }
  ];

  const housingSteps = [
    {
      step: 1,
      title: "Housing Application",
      description: "Applicant and MSD case worker initial coordination",
      path: "/demo/housing/step-1"
    },
    {
      step: 2,
      title: "Adding Kāinga Ora",
      description: "Case worker expands forum to include housing agency",
      path: "/demo/housing/step-2"
    },
    {
      step: 3,
      title: "Multi-Agency Forum",
      description: "Priority B housing status and coordinated assessment",
      path: "/demo/housing/step-3"
    },
    {
      step: 4,
      title: "Support Services",
      description: "Bond assistance and transport coordination activated",
      path: "/demo/housing/step-4"
    },
    {
      step: 5,
      title: "Government Transparency",
      description: "Complete audit trail for inter-agency coordination",
      path: "/demo/housing/step-5"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eleutherios Coordination Platform Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Transform static conversations into dynamic workflows with integrated services and payments. 
            Type simple rules to instantly expand coordination capabilities across healthcare, housing, 
            and social services.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>PFSD Protocol:</strong> Policy defines coordination rules → Forum provides 
              the space → Services activate capabilities → Data ensures transparency
            </p>
          </div>
        </div>

        {/* Key Innovation Highlight */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Natural Language Coordination</h2>
            <p className="text-lg mb-6">
              Type "add pharmacy" and watch a simple doctor-patient chat evolve into a complete healthcare workflow. 
              Type "add kāinga_ora" and see multi-agency housing coordination activate instantly.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-sm">
              rule add pharmacy → Policy('PrescriptionFulfillment')
            </div>
          </div>
        </div>

        {/* Two Demo Workflows */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Healthcare Coordination */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <h2 className="text-2xl font-semibold mb-2">Healthcare Coordination</h2>
              <p className="text-green-100">
                Doctor-Patient-Pharmacy workflow with integrated payments
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {healthcareSteps.map((step) => (
                  <Link
                    key={step.step}
                    href={step.path}
                    className="block bg-gray-50 hover:bg-green-50 p-3 rounded-lg border hover:border-green-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                      </div>
                      <div className="text-green-600 text-sm">→</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-2">Key Features</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• $75 consultation with 80/20 revenue split</li>
                  <li>• Real-time prescription coordination</li>
                  <li>• Multi-stakeholder communication</li>
                  <li>• Complete audit transparency</li>
                </ul>
              </div>
              <Link
                href="/demo/healthcare"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block font-medium"
              >
                Start Healthcare Demo
              </Link>
            </div>
          </div>

          {/* Housing Coordination */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-semibold mb-2">Housing Coordination</h2>
              <p className="text-blue-100">
                MSD-Applicant-Kāinga Ora workflow with support services
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {housingSteps.map((step) => (
                  <Link
                    key={step.step}
                    href={step.path}
                    className="block bg-gray-50 hover:bg-blue-50 p-3 rounded-lg border hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                      </div>
                      <div className="text-blue-600 text-sm">→</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• $2,600 in multi-agency support services</li>
                  <li>• Priority B housing registration</li>
                  <li>• Inter-agency coordination (MSD + KO)</li>
                  <li>• Government transparency compliance</li>
                </ul>
              </div>
              <Link
                href="/demo/housing"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
              >
                Start Housing Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Capabilities */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Platform Capabilities Demonstrated
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural Language Rules</h4>
              <p className="text-sm text-gray-600">
                Type simple commands to expand forum capabilities without technical skills
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dynamic Evolution</h4>
              <p className="text-sm text-gray-600">
                Forums automatically grow sophisticated as coordination needs emerge
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Integrated Payments</h4>
              <p className="text-sm text-gray-600">
                Multi-party payment processing with automatic revenue splits
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Complete Transparency</h4>
              <p className="text-sm text-gray-600">
                Full audit trails for governance accountability and compliance
              </p>
            </div>
          </div>
        </div>

        {/* Use Case Comparison */}
        <div className="bg-gray-100 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Cross-Domain Coordination Pattern
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Healthcare Stakeholders</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>Doctor (service provider)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>Patient (service recipient)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>Pharmacist (service provider)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Housing Stakeholders</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span>Housing Applicant (service recipient)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span>MSD Case Worker (coordinator)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span>Kāinga Ora Officer (service provider)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <strong>Same coordination pattern</strong> - different stakeholders, services, and payment flows. 
              Platform adapts to any multi-party coordination scenario.
            </p>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Technical Foundation
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Tailwind CSS styling</li>
                <li>• Real-time component updates</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Backend Services</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Firebase real-time database</li>
                <li>• Stripe payment processing</li>
                <li>• EleuScript rule engine</li>
                <li>• Service validation system</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Governance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete audit logging</li>
                <li>• Policy inheritance system</li>
                <li>• Multi-party compliance</li>
                <li>• Transparent decision trails</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm mb-4">
            These demos show Eleutherios coordination capabilities across healthcare and housing scenarios.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/demo/healthcare" 
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Healthcare Demo
            </Link>
            <span>•</span>
            <Link 
              href="/demo/housing" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Housing Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}