// lib/stripe/config.ts - Vercel deployment safe
import Stripe from 'stripe';

// Create Stripe instance only when needed, not at module load
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    
    stripeInstance = new Stripe(secretKey);
  }
  
  return stripeInstance;
};

// Client-side Stripe configuration
export const stripeConfig = {
  get publishableKey() {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }
};