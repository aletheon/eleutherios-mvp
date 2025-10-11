// test/payment-parser.test.ts
import { EleuScriptPaymentParser } from "@/lib/eleuScript/payment-parser";

// Quick test function you can run
export function testPaymentParser() {
  const testCases = [
    // Valid cases
    'rule paySeller -> Service("StripePayment", { payerId: user.userId, payeeId: seller.userId, amount: $5.00 })',
    'rule tip -> Service("StripePayment", { payerId: customer123, payeeId: driver456, amount: $2.50 })',
    'rule buyItem -> Service("StripePayment", { payerId: buyer789, payeeId: shop101, amount: $15.99, currency: USD })',
    
    // Invalid cases (should return null)
    'rule invalid -> Service("StripePayment", { payerId: user.userId })', // missing payeeId and amount
    'just a regular chat message',
    'rule wrongService -> Service("NotStripePayment", { amount: $5.00 })',
  ];

  console.log('Testing EleuScript Payment Parser...\n');
  
  testCases.forEach((testCase, index) => {
    const result = EleuScriptPaymentParser.parsePaymentRule(testCase);
    console.log(`Test ${index + 1}:`);
    console.log(`Input: ${testCase}`);
    console.log(`Result:`, result);
    console.log('---');
  });
}

// Simple integration test for your chat component
export function testChatIntegration() {
  const chatMessages = [
    "Hey, how's it going?",
    "rule paySeller -> Service(\"StripePayment\", { payerId: user123, payeeId: seller456, amount: $10.00 })",
    "That payment went through!",
    "rule tip -> Service(\"StripePayment\", { payerId: customer789, payeeId: driver101, amount: $3.00 })"
  ];

  console.log('Testing chat message detection...\n');
  
  chatMessages.forEach((message, index) => {
    const isPaymentRule = message.startsWith('rule ') && message.includes('StripePayment');
    const parsed = isPaymentRule ? EleuScriptPaymentParser.parsePaymentRule(message) : null;
    
    console.log(`Message ${index + 1}: ${message}`);
    console.log(`Is payment rule: ${isPaymentRule}`);
    console.log(`Parsed result:`, parsed);
    console.log('---');
  });
}

// Run this in your browser console or create a simple test page
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testPaymentParser = testPaymentParser;
  (window as any).testChatIntegration = testChatIntegration;
}