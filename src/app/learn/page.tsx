'use client';

import { useState } from 'react';

export default function LearnEleuScript() {
  const [ruleInput, setRuleInput] = useState('');

  const executeRule = (rule: string) => {
    if (rule) {
      // Handle macro shortcuts
      if (rule === 'urgent_housing') {
        const feedback = `✅ Macro Expansion!

urgent_housing expands to:

rule "secure housing" -> Service("HousingPlacement",
  priority="urgent",
  type="temporary_to_permanent", 
  location_preference="current_area"
)

This macro saves typing the full service definition every time you need urgent housing placement. Perfect for social workers handling multiple cases!`;
        alert(feedback);
      } else if (rule === 'gp_consult') {
        const feedback = `✅ Macro Expansion!

gp_consult expands to:

batch [
  rule "create consultation" -> Forum("GP Consultation", stakeholders=["Patient", "GP"]),
  rule "activate payment" -> Service("StripePayment", amount=75, split=[80,20]),
  rule "enable prescription" -> Policy("PrescriptionWorkflow")
]

This macro sets up a complete healthcare consultation with payment processing and prescription capabilities in one command!`;
        alert(feedback);
      } else if (rule === 'legal_formation') {
        const feedback = `✅ Macro Expansion!

legal_formation expands to:

batch [
  rule "add accountant" -> Policy("BusinessFormation"),
  rule "activate tax optimization" -> Service("TaxStructure"),
  rule "enable billing" -> Service("MultiPartyPayment", amount=4500, split=[66.7,26.7,6.7]),
  rule "generate docs" -> Service("DocumentGeneration")
]

This macro handles the complete business formation process that law firms run dozens of times per month!`;
        alert(feedback);
      } else if (rule.includes('batch')) {
        const feedback = `✅ Valid batch command!

Sequential Rule Execution:
• All rules execute in the specified order
• Each rule must complete before the next begins
• Perfect for complex workflows requiring specific sequences
• Backend processes each step and maintains state between rules

${rule.includes('BusinessFormation') ? `Business Formation Workflow:
1. Add accountant → Accountant joins forum, tax expertise available
2. Activate billing → Multi-party payment processing ready  
3. Generate docs → Corporate documents, EIN application, banking setup
Result: Complete business formation from start to finish

` : ''}This demonstrates the platform's ability to handle sophisticated multi-step professional workflows!`;
        alert(feedback);
      } else if (rule.includes('rule') && rule.includes('->') && (rule.includes('Policy') || rule.includes('Service'))) {
        let feedback = "✅ Valid cooperation rule!\n\n";
        
        if (rule.includes('accountant') || rule.includes('BusinessFormation')) {
          feedback += "Legal Services Cooperation:\n• Connects your Clio/practice management with accountant's QuickBooks\n• Enables business formation workflow across existing systems\n• Integrates multi-party billing through your current payment processor\n• Your tools work together, no software replacement needed\n\n";
        } else if (rule.includes('pharmacy') || rule.includes('Prescription')) {
          feedback += "Healthcare Cooperation:\n• Links your EMR system with pharmacy fulfillment network\n• Enables prescription workflow through existing infrastructure\n• Integrates consultation billing with your current payment system\n• Your practice tools communicate seamlessly\n\n";
        } else if (rule.includes('specialist') || rule.includes('Implementation')) {
          feedback += "Consulting Cooperation:\n• Connects your CRM with specialist's project management tools\n• Enables implementation workflow across existing platforms\n• Integrates multi-party billing through your current systems\n• Your business tools work together without replacement\n\n";
        } else if (rule.includes('billing') || rule.includes('MultiPartyPayment')) {
          feedback += "Billing Integration:\n• Connects existing payment systems for multi-party splits\n• Enables transparent billing across all stakeholders\n• Integrates with your current accounting software\n• Automated revenue sharing without manual calculations\n\n";
        } else if (rule.includes('calendar') || rule.includes('Scheduling')) {
          feedback += "Calendar Cooperation:\n• Connects multiple calendar systems for unified scheduling\n• Enables cross-stakeholder meeting coordination\n• Integrates with existing calendar platforms\n• Automated availability matching and booking\n\n";
        }
        
        feedback += "Want to see this in action? Try our interactive demos below!";
        alert(feedback);
      } else {
        alert(`💡 Rule formats:

Single rule: rule "descriptive name" -> Policy(PolicyId)
Batch rules: batch [rule "name1" -> Policy(Policy1), rule "name2" -> Service(Service1)]
Macros: urgent_housing, gp_consult, legal_formation

Try clicking one of the examples above!`);
      }
    } else {
      alert('Please enter a cooperation rule to execute!');
    }
  };

  const useExampleAndExecute = (exampleRule: string) => {
    setRuleInput(exampleRule);
    executeRule(exampleRule);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeRule(ruleInput);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with immediate rule practice */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Learn EleuScript</h1>
            <p className="text-xl opacity-90">Type simple rules to expand multi-party workflows with integrated payments</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="mb-5 text-xl">Try it now - Type a rule:</h3>
            <input 
              type="text" 
              className="bg-white/20 border-2 border-white/30 text-white p-4 rounded-lg w-full text-lg font-mono mb-4 placeholder-white/70"
              placeholder='rule "add accountant" -> Policy(BusinessFormation)'
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:-translate-y-1"
              onClick={() => executeRule(ruleInput)}
            >
              Execute Rule
            </button>
            
            <div className="mt-6">
              <h4 className="mb-4 text-lg">Or click to try these examples:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "add accountant" -> Policy(BusinessFormation)')}
                >
                  <strong>Legal:</strong> Add Business Accountant
                </button>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "add pharmacy" -> Policy(Prescription)')}
                >
                  <strong>Healthcare:</strong> Add Pharmacy
                </button>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "add specialist" -> Policy(Implementation)')}
                >
                  <strong>Consulting:</strong> Add Technical Specialist
                </button>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "activate billing" -> Service(MultiPartyPayment)')}
                >
                  <strong>Billing:</strong> Multi-Party Payment Split
                </button>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "add translator" -> Policy(International)')}
                >
                  <strong>International:</strong> Add Language Specialist
                </button>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all transform hover:-translate-y-1"
                  onClick={() => useExampleAndExecute('rule "activate calendar" -> Service(MultiPartyScheduling)')}
                >
                  <strong>Scheduling:</strong> Multi-Party Calendar
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="mb-4 text-lg">Advanced: Multiple Rules in Sequence</h4>
                <button 
                  className="bg-white/20 border-2 border-white/30 p-4 rounded-lg text-left text-sm hover:bg-white/30 transition-all w-full"
                  onClick={() => useExampleAndExecute('batch [rule "add accountant" -> Policy(BusinessFormation), rule "activate billing" -> Service(MultiPartyPayment), rule "generate docs" -> Service(DocumentGeneration)]')}
                >
                  <strong>Batch Processing:</strong> Complete Business Formation Workflow
                  <br />
                  <small className="opacity-80">Adds accountant → activates billing → generates documents in sequence</small>
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="mb-4 text-lg">Macros: Save Time with Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all"
                    onClick={() => useExampleAndExecute('urgent_housing')}
                  >
                    <strong>Macro:</strong> urgent_housing
                    <br />
                    <small className="opacity-80">Expands to full housing placement service</small>
                  </button>
                  <button 
                    className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all"
                    onClick={() => useExampleAndExecute('gp_consult')}
                  >
                    <strong>Macro:</strong> gp_consult
                    <br />
                    <small className="opacity-80">Expands to complete healthcare consultation</small>
                  </button>
                  <button 
                    className="bg-white/20 border-2 border-white/30 p-3 rounded-lg text-left text-sm hover:bg-white/30 transition-all"
                    onClick={() => useExampleAndExecute('legal_formation')}
                  >
                    <strong>Macro:</strong> legal_formation
                    <br />
                    <small className="opacity-80">Expands to business formation workflow</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-5 text-gray-900">See Real Coordination in Action</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Watch complete workflows from professional conversation to integrated billing</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-purple-500 hover:-translate-y-2 transition-all shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Legal Services Coordination</h3>
              <p className="text-gray-600 mb-5">Business formation with lawyer-accountant coordination. Complete $4,500 workflow with integrated billing and tax optimization.</p>
              <a href="/demo/legal-coordination" className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all inline-block">
                Try Legal Demo
              </a>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-purple-500 hover:-translate-y-2 transition-all shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Healthcare Coordination</h3>
              <p className="text-gray-600 mb-5">Doctor-pharmacy prescription coordination with integrated consultation billing and delivery scheduling.</p>
              <a href="/demo/healthcare-coordination" className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all inline-block">
                Try Healthcare Demo
              </a>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-purple-500 hover:-translate-y-2 transition-all shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Housing Coordination</h3>
              <p className="text-gray-600 mb-5">Multi-agency housing assistance with MSD, Kainga Ora, and support services. $2,600 coordination value.</p>
              <a href="/demo/housing" className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all inline-block">
                Try Housing Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PFSD Protocol Explanation */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-5 text-gray-900">How the PFSD Protocol Works</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">The four-step process that makes natural language coordination possible</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center hover:-translate-y-2 transition-all shadow-lg relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                📋
              </div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Policy</h4>
              <p className="text-gray-600 text-sm">Defines rules, permissions, and stakeholder access for governance</p>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-300 hidden md:block">→</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center hover:-translate-y-2 transition-all shadow-lg relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                💬
              </div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Forum</h4>
              <p className="text-gray-600 text-sm">Dynamic conversation space that evolves capabilities based on typed rules</p>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-300 hidden md:block">→</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center hover:-translate-y-2 transition-all shadow-lg relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                ⚡
              </div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Service</h4>
              <p className="text-gray-600 text-sm">Connects your existing tools (CRM, billing, calendar) through coordination rules</p>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-300 hidden md:block">→</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center hover:-translate-y-2 transition-all shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                📊
              </div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Data</h4>
              <p className="text-gray-600 text-sm">Complete audit trail of decisions and transactions for transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Program */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-4">Start Your Coordination Pilot</h2>
          <p className="text-xl mb-8">Test real coordination value with your client work in 30 days</p>
          
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 max-w-lg mx-auto">
            <div className="text-4xl font-bold mb-3">$550</div>
            <div className="opacity-90 mb-6">$500 setup + $50 per coordination</div>
            <div className="mb-6 text-left">
              <div className="mb-2">✓ Platform configuration for your workflows</div>
              <div className="mb-2">✓ Personal onboarding and guidance</div>
              <div className="mb-2">✓ 1-2 real client projects with coordination</div>
              <div className="mb-2">✓ Success measurement and optimization</div>
            </div>
            <a href="/pricing/pilot-program" className="bg-red-500 hover:bg-red-600 text-white py-4 px-8 rounded-lg font-semibold transition-all inline-block">
              Start Your Pilot Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}