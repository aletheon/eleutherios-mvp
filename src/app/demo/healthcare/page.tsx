// src/app/demo/healthcare/page.tsx

import Link from 'next/link';

export default function HealthcareDemoPage() {
  const demoSteps = [
    {
      step: 1,
      title: "Basic Doctor-Patient Forum",
      description: "Initial medical consultation forum with doctor and patient, showing basic chat and file upload capabilities. Demonstrates Policy → Forum instantiation.",
      screenshot: "/screenshots/step-1-basic-forum.png" // You'll add these
    },
    {
      step: 2,
      title: "Doctor Typing Pharmacy Rule",
      description: "Doctor types EleuScript rule to add pharmacy services. Shows purple syntax highlighting and real-time rule detection.",
      screenshot: "/screenshots/step-2-typing-rule.png"
    },
    {
      step: 3,
      title: "Forum Expanded with Pharmacist",
      description: "Pharmacist automatically added, new services activated, policy hierarchy updated. Demonstrates Forum → Service expansion.",
      screenshot: "/screenshots/step-3-forum-expanded.png"
    },
    {
      step: 4,
      title: "Payment Service Activated", 
      description: "Stripe payment processing enabled for consultation fees with multi-party splits. Shows Service integration capabilities.",
      screenshot: "/screenshots/step-4-payment-activated.png"
    },
    {
      step: 5,
      title: "Complete Audit Trail",
      description: "Full governance transparency showing policy evolution timeline. Demonstrates Data transparency and compliance.",
      screenshot: "/screenshots/step-5-audit-trail.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eleutherios Healthcare Coordination Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how people can expand coordination capabilities through conversation - 
            transforming a simple doctor-patient chat into a complete healthcare workflow 
            with pharmacist coordination and integrated payments.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>PFSD Protocol:</strong> Policy defines coordination rules → Forum provides 
              the space → Services activate capabilities → Data ensures transparency
            </p>
          </div>
        </div>

        {/* Demo Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoSteps.map((step) => (
            <Link 
              key={step.step}
              href={`/demo/healthcare/step-${step.step}`}
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
                  Screenshot Preview
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
                href={`/demo/healthcare/step-${step.step}`}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Step {step.step}: {step.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            What You'll See in This Demo
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Natural Language Control</h4>
              <p className="text-gray-600 text-sm">
                Type simple rules like "add pharmacy" to instantly expand forum capabilities 
                without technical configuration.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Real-time Evolution</h4>
              <p className="text-gray-600 text-sm">
                Watch forums grow more sophisticated as coordination needs emerge, 
                adding stakeholders and services dynamically.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Integrated Payments</h4>
              <p className="text-gray-600 text-sm">
                See Stripe payment processing activate automatically with multi-party 
                splits for consultation fees.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Complete Transparency</h4>
              <p className="text-gray-600 text-sm">
                Every governance decision logged with timestamps, actors, and technical 
                details for full accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            This demo shows Eleutherios coordination capabilities. 
            Contact us to see how this applies to your use case.
          </p>
        </div>
      </div>
    </div>
  );
}