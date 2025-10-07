// src/app/pitch/page.tsx

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eleutherios - Transform Conversations into Complete Workflows',
  description: 'Natural language coordination platform that enables multi-stakeholder coordination through simple rules. Healthcare and housing demos available.',
  openGraph: {
    title: 'Eleutherios - Coordination Platform',
    description: 'Transform static conversations into dynamic workflows with integrated services and payments',
    url: 'https://eleutherios-mvp.vercel.app/pitch',
    siteName: 'Eleutherios',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eleutherios - Coordination Platform',
    description: 'Natural language coordination platform for healthcare, housing, and professional services',
  },
};

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Eleutherios
            </Link>
            <div className="flex gap-6">
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors">
                Live Demos
              </Link>
              <Link href="/pitch#contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Eleutherios
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Transform Conversations into Complete Workflows
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Natural Language Coordination Platform | 2025
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              View Live Demos
            </Link>
            <Link href="#overview" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
              Read Pitch
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600">Proven Workflows</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$75</div>
              <div className="text-gray-600">Healthcare Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$2,600</div>
              <div className="text-gray-600">Housing Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">10</div>
              <div className="text-gray-600">Demo Components</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">20%</div>
              <div className="text-gray-600">Platform Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="overview" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Multi-stakeholder coordination is broken
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-4">Healthcare</h3>
              <p className="text-gray-600">
                Doctor-patient conversations can't easily include pharmacists or specialists
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold mb-4">Government</h3>
              <p className="text-gray-600">
                MSD and Kāinga Ora work in silos despite shared clients
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-4">Business</h3>
              <p className="text-gray-600">
                Consultations require separate tools for legal, financial, and technical expertise
              </p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">
              <strong>Result:</strong> Coordination overhead, service gaps, poor outcomes
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Solution: Natural Language Coordination
          </h2>
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 mb-8">
              Type simple rules to instantly expand capabilities:
            </p>
            <div className="bg-gray-100 rounded-lg p-6 font-mono text-lg text-purple-600 max-w-3xl mx-auto">
              rule add pharmacy → Policy('PrescriptionFulfillment')<br/>
              rule add kāinga_ora → Policy('HousingCoordination')
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Policy</h3>
              <p className="text-green-700">Defines coordination rules</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Forum</h3>
              <p className="text-blue-700">Collaboration space</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Service</h3>
              <p className="text-purple-700">Activates capabilities</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Data</h3>
              <p className="text-orange-700">Ensures transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Two Proven Coordination Workflows
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h3 className="text-2xl font-semibold mb-2">Healthcare Coordination</h3>
                <p className="text-green-100">Doctor-Patient-Pharmacy workflow with payments</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="text-green-600">•</span>
                    Doctor + Patient → "add pharmacy" → Pharmacist joins
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600">•</span>
                    $75 consultation with 80/20 revenue split
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600">•</span>
                    Complete prescription workflow activated
                  </li>
                </ul>
                <Link href="/demo/healthcare" className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block">
                  Try Healthcare Demo
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h3 className="text-2xl font-semibold mb-2">Housing Coordination</h3>
                <p className="text-blue-100">MSD-Applicant-Kāinga Ora workflow with support</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="text-blue-600">•</span>
                    MSD + Applicant → "add kāinga_ora" → Housing Officer joins
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-600">•</span>
                    $2,600 support services activated
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-600">•</span>
                    Multi-agency government coordination
                  </li>
                </ul>
                <Link href="/demo/housing" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block">
                  Try Housing Demo
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 inline-block">
              <p className="text-yellow-800 text-lg font-medium">
                Same coordination pattern works across domains
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Cross-Domain Market Opportunity
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Immediate Markets</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">🏥</span>
                  <div>
                    <strong>Healthcare:</strong> Doctor-patient-pharmacy coordination
                    <div className="text-gray-600">$4.5T global market</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">🏛️</span>
                  <div>
                    <strong>Government:</strong> Multi-agency coordination
                    <div className="text-gray-600">Housing, social services</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">💼</span>
                  <div>
                    <strong>Professional Services:</strong> Consultant-specialist workflows
                    <div className="text-gray-600">Legal, financial, technical</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Business Model</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">Platform fee: 20% of transactions</div>
                  <div className="text-gray-600">Sustainable coordination value</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">Provider revenue: 80%</div>
                  <div className="text-gray-600">Attracts service providers</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">Value creation</div>
                  <div className="text-gray-600">Reduced overhead, faster outcomes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Dynamic Evolution vs. Static Platforms
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Traditional Platforms</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-600">Eleutherios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Fixed feature sets</td>
                  <td className="px-6 py-4 text-blue-600">Dynamic capability expansion</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Technical configuration</td>
                  <td className="px-6 py-4 text-blue-600">Natural language rules</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Siloed services</td>
                  <td className="px-6 py-4 text-blue-600">Integrated workflows</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Manual coordination</td>
                  <td className="px-6 py-4 text-blue-600">Automated stakeholder addition</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Single-domain focus</td>
                  <td className="px-6 py-4 text-blue-600">Cross-domain coordination pattern</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 inline-block">
              <p className="text-blue-800 text-lg font-medium">
                Network effects: Successful coordination patterns become reusable templates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Government Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Clear Value for Public Sector
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">Demonstrated Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <strong>Reduced admin overhead:</strong> No duplicate data entry between agencies
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <strong>Faster service delivery:</strong> Real-time coordination vs. phone/email chains
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <strong>Complete transparency:</strong> Full audit trails for accountability
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <strong>Better outcomes:</strong> Comprehensive support addressing multiple needs
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">Compliance Built-in</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">🔒</span>
                  <div>Privacy Act compliance</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">⚖️</span>
                  <div>Social Security Act adherence</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">📋</span>
                  <div>Complete decision logging</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">🔐</span>
                  <div>Multi-party access controls</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Ask */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Seeking Partnerships and Pilot Programs
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Healthcare Providers</h3>
              <p>Doctor-pharmacy coordination workflows</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Government Agencies</h3>
              <p>MSD-Kāinga Ora integration pilots</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Professional Services</h3>
              <p>Consultant-specialist coordination</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-xl font-medium">
              Timeline: 3-month pilots, 6-month scale, 12-month market expansion
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Contact & Demo Access
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Demo Access</h3>
            <p className="text-blue-800 mb-4">
              <strong>eleutherios-mvp.vercel.app/demo</strong>
            </p>
            <ul className="text-blue-700 space-y-2">
              <li>• Healthcare coordination workflow (5 steps)</li>
              <li>• Housing coordination workflow (5 steps)</li>
              <li>• Interactive rule execution</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Details</h3>
              <p className="text-gray-600">github.com/aletheon/eleutherios-mvp</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Pilot Interest</h3>
              <p className="text-gray-600">Ready for Q1 2025 deployment</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-2xl font-medium text-blue-600">
              Transform static conversations into dynamic coordination
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-8 mb-4">
            <Link href="/demo" className="hover:text-blue-400 transition-colors">Live Demos</Link>
            <Link href="/pitch" className="hover:text-blue-400 transition-colors">Pitch Deck</Link>
            <Link href="https://github.com/aletheon/eleutherios-mvp" className="hover:text-blue-400 transition-colors">GitHub</Link>
          </div>
          <p className="text-gray-400">© 2025 Eleutherios. Transform coordination through natural language.</p>
        </div>
      </footer>
    </div>
  );
}