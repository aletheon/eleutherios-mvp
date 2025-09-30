import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the userId
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/profile?error=stripe_connection_failed', request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/profile?error=invalid_callback', request.url));
  }

  try {
    // Exchange authorization code for access token
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_secret: process.env.STRIPE_SECRET_KEY!,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description);
    }

    const stripeAccountId = data.stripe_user_id;

    // For now, redirect back to profile with success parameters
    // In the next step, we'll update this to save to Firebase
    return NextResponse.redirect(
      new URL(`/profile?stripe_connected=true&account_id=${stripeAccountId}&user_id=${state}`, request.url)
    );
  } catch (error) {
    console.error('Stripe OAuth error:', error);
    return NextResponse.redirect(new URL('/profile?error=stripe_oauth_failed', request.url));
  }
}