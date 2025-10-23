import { NextResponse } from 'next/server';

/**
 * GET /.well-known/openid-configuration
 * OpenID Connect discovery endpoint
 * https://openid.net/specs/openid-connect-discovery-1_0.html
 */
export async function GET() {
  // Get base URL from environment or construct it
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const configuration = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/auth/authorize`,
    token_endpoint: `${baseUrl}/api/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/auth/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/api/auth/register`,

    // Supported response types
    response_types_supported: [
      'code',
      'token',
      'id_token',
      'code token',
      'code id_token',
      'token id_token',
      'code token id_token',
    ],

    // Supported subject types
    subject_types_supported: ['public'],

    // Supported ID token signing algorithms
    id_token_signing_alg_values_supported: ['RS256'],

    // Supported scopes
    scopes_supported: [
      'openid',
      'profile',
      'email',
      'address',
      'phone',
      'offline_access',
    ],

    // Supported claims
    claims_supported: [
      'sub',
      'iss',
      'aud',
      'exp',
      'iat',
      'auth_time',
      'nonce',
      'name',
      'email',
      'email_verified',
      'picture',
      'role',
      'certScore',
    ],

    // Supported token endpoint authentication methods
    token_endpoint_auth_methods_supported: [
      'client_secret_basic',
      'client_secret_post',
    ],

    // Supported grant types
    grant_types_supported: [
      'authorization_code',
      'implicit',
      'refresh_token',
    ],

    // Additional endpoints
    end_session_endpoint: `${baseUrl}/api/auth/logout`,
    revocation_endpoint: `${baseUrl}/api/auth/revoke`,
    introspection_endpoint: `${baseUrl}/api/auth/introspect`,

    // Service documentation
    service_documentation: 'https://docs.eleutherios.io',

    // UI locales supported
    ui_locales_supported: ['en-US'],

    // Claims locales supported
    claims_locales_supported: ['en-US'],

    // Code challenge methods supported (for PKCE)
    code_challenge_methods_supported: ['S256', 'plain'],
  };

  return NextResponse.json(configuration, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
