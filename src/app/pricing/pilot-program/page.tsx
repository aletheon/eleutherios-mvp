'use client';

import { useState } from 'react';

export default function PilotProgram() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    firmType: '',
    currentPainPoint: '',
    coordinationFrequency: '',
    expectedCoordinations: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your payment processing (Stripe) and CRM
    console.log('Pilot signup:', formData);
    alert('Thank you! We\'ll contact you within 24 hours to schedule your pilot onboarding.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold mb-6">Start Your Coordination Pilot</h1>
          <p className="text-xl mb-8 opacity-90">
            Test real coordination value with your client work in 30 days
          </p>
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 max-w-lg mx-auto">
            <div className="text-5xl font-bold mb-4">$550</div>
            <div className="text-lg opacity-90 mb-6">$500 setup + $50 per coordination</div>
            <div className="text-sm opacity-80">
              Immediate ROI through coordination efficiency gains
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Value Proposition */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              What You Get in Your 30-Day Pilot
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Platform Configuration</h3>
                  <p className="text-gray-600">We set up EleuScript rules specific to your practice workflows, whether business formation, litigation coordination, or consulting projects.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Founder-Led Onboarding</h3>
                  <p className="text-gray-600">Direct training session with our founder to ensure your team understands how to create rules and expand coordination capabilities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real Client Project Implementation</h3>
                  <p className="text-gray-600">Use the platform for 1-2 actual client matters requiring multi-party coordination. See immediate efficiency gains in billable hour optimization.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Success Measurement & Optimization</h3>
                  <p className="text-gray-600">We track coordination time savings, revenue impact, and client satisfaction improvements throughout your pilot.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Long-Term Commitment</h3>
                  <p className="text-gray-600">Complete flexibility to continue with monthly subscriptions or discontinue after pilot completion based on results.</p>
                </div>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Typical Pilot ROI</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pilot investment:</span>
                  <span className="font-semibold">$550</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordination time saved (2 projects):</span>
                  <span className="font-semibold">8-12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value at $300/hour billing:</span>
                  <span className="font-semibold">$2,400-3,600</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between">
                  <span className="text-gray-900 font-semibold">Net ROI in 30 days:</span>
                  <span className="text-green-600 font-bold">$1,850-3,050</span>
                </div>
              </div>
            </div>

            {/* Testimonial Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JM
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Partner, Mid-Size Law Firm</div>
                  <div className="text-sm text-gray-600">Business Formation Practice</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "EleuScript reduced our business formation coordination time by 60%. What used to take 5+ hours of back-and-forth with accountants now happens in 30 minutes. The integrated billing alone pays for itself."
              </p>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Pilot Today</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Firm/Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="firmType" className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Type *
                  </label>
                  <select
                    id="firmType"
                    name="firmType"
                    required
                    value={formData.firmType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select your practice type</option>
                    <option value="law-firm">Law Firm</option>
                    <option value="business-consulting">Business Consulting</option>
                    <option value="accounting">Accounting Firm</option>
                    <option value="healthcare">Healthcare Practice</option>
                    <option value="other">Other Professional Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="currentPainPoint" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Coordination Challenge *
                  </label>
                  <textarea
                    id="currentPainPoint"
                    name="currentPainPoint"
                    required
                    rows={3}
                    value={formData.currentPainPoint}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your biggest multi-party coordination challenge (e.g., lawyer-accountant coordination for business formations, consultant-specialist project coordination, etc.)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="coordinationFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                      Coordination Frequency
                    </label>
                    <select
                      id="coordinationFrequency"
                      name="coordinationFrequency"
                      value={formData.coordinationFrequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">How often do you coordinate?</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="occasionally">Occasionally</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expectedCoordinations" className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Pilot Usage
                    </label>
                    <select
                      id="expectedCoordinations"
                      name="expectedCoordinations"
                      value={formData.expectedCoordinations}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Coordinations in 30 days?</option>
                      <option value="1-2">1-2 coordinations</option>
                      <option value="3-5">3-5 coordinations</option>
                      <option value="6-10">6-10 coordinations</option>
                      <option value="10+">10+ coordinations</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Pilot Investment: $550</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• $500 setup fee (platform configuration + onboarding)</div>
                    <div>• $50 per coordination during pilot</div>
                    <div>• No long-term commitment required</div>
                    <div>• Payment processed via Stripe after onboarding call</div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  Schedule Pilot Onboarding Call
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to be contacted about your pilot program. 
                  No payment required until after your onboarding call.
                </p>
              </form>
            </div>

            {/* Security/Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Stripe Payments
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Delaware C-Corporation
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Professional References Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens after I submit this form?</h3>
              <p className="text-gray-600">We'll contact you within 24 hours to schedule a 30-minute onboarding call. During this call, we'll understand your specific coordination needs, configure your platform, and collect payment via Stripe. No payment is required until after this consultation.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How quickly can I start seeing results?</h3>
              <p className="text-gray-600">Most firms see immediate coordination efficiency gains within the first week. By day 14, you'll typically have completed your first coordinated workflow and can measure the time savings and revenue impact.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if the pilot doesn't work for my practice?</h3>
              <p className="text-gray-600">The pilot is designed to prove value within 30 days. If you don't see measurable coordination improvements, there's no obligation to continue with monthly subscriptions. The pilot investment helps ensure mutual commitment to success.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you integrate with our existing tools?</h3>
              <p className="text-gray-600">Yes, EleuScript connects your existing tools (Clio, QuickBooks, Outlook, etc.) rather than replacing them. We'll configure integrations based on your current tech stack during the onboarding process.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's included in the $50 per coordination fee?</h3>
              <p className="text-gray-600">Each coordination includes multi-party forum creation, stakeholder integration, service activation (billing, scheduling, document generation), and complete audit trail logging. There are no hidden transaction fees.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}