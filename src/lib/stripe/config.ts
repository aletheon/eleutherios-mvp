// lib/stripe/config.ts - Alternative approach
import Stripe from 'stripe';

// Server-side Stripe instance without explicit API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Client-side Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
};

// Or if you need to specify version, try this format:
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-04-10' as any, // Type assertion to bypass strict typing
// });