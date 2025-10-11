// lib/eleuscript/payment-parser.ts
import { PaymentRule } from "@/app/types/eleuscript";

export class EleuScriptPaymentParser {
  static parsePaymentRule(rule: string): PaymentRule | null {
    try {
      // Early return for invalid input
      if (!rule || rule.trim().length === 0) {
        return null;
      }

      // Match: rule paySeller -> Service("StripePayment", { payerId: user.userId, payeeId: user.userId, amount: $5.00 })
      const paymentPattern = /rule\s+(\w+)\s*->\s*Service\("StripePayment",\s*\{([^}]+)\}\)/;
      const matchResult = rule.match(paymentPattern);
      
      if (!matchResult || matchResult.length < 3) {
        return null;
      }

      const paramsString = matchResult[2];
      if (!paramsString) {
        return null;
      }

      const parameters = this.parseParameters(paramsString);
      
      // Check required fields are present
      if (!parameters.payerId || !parameters.payeeId || !parameters.amount) {
        return null;
      }

      const amount = this.parseAmount(parameters.amount);
      if (amount <= 0) {
        return null;
      }

      return {
        type: 'StripePayment',
        payerId: parameters.payerId,
        payeeId: parameters.payeeId,
        amount: amount,
        currency: parameters.currency || 'USD'
      };
    } catch (error) {
      console.error('Error parsing payment rule:', error);
      return null;
    }
  }

  private static parseParameters(paramsStr: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    try {
      // Match key: value pairs, handling both quoted and unquoted values
      const paramPattern = /(\w+):\s*([^,\}]+)/g;
      let match: RegExpExecArray | null;
      
      while ((match = paramPattern.exec(paramsStr)) !== null) {
        if (match && match.length >= 3) {
          const key = match[1]?.trim();
          const value = match[2]?.trim().replace(/["']/g, '');
          if (key && value) {
            params[key] = value;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing parameters:', error);
    }
    
    return params;
  }

  private static parseAmount(amountStr: string): number {
    try {
      // Handle $5.00 format
      if (amountStr.startsWith('$')) {
        const numericAmount = amountStr.replace(/[$,]/g, '');
        const parsed = parseFloat(numericAmount);
        return isNaN(parsed) ? 0 : parsed;
      }
      
      const parsed = parseFloat(amountStr);
      return isNaN(parsed) ? 0 : parsed;
    } catch (error) {
      console.error('Error parsing amount:', error);
      return 0;
    }
  }
}

// Simple export for backward compatibility
export function parsePaymentRule(rule: string): PaymentRule | null {
  return EleuScriptPaymentParser.parsePaymentRule(rule);
}