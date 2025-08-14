// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Edge-compliant nonce generator
function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

interface SecurityHeadersConfig {
  frameOptions?: string
  contentTypeOptions?: string
  referrerPolicy?: string
  permissionsPolicy?: string
  strictTransportSecurity?: string
  csp?: Record<string, string[]>
}

// Create default config with nonce generated at runtime
export const securityHeadersConfig: SecurityHeadersConfig = (() => {
  const nonce = generateNonce()
  return {
    frameOptions: 'DENY',
    contentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()',
    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'report-sample'",
        `'nonce-${nonce}'`,
        'https://*.vercel.app'
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://ui-avatars.com', 'https://res.cloudinary.com', 'https://*.cloudinary.com/'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://*.vercel.app'],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
})()


export function withSecurityHeaders(
  request: NextRequest,
  config: SecurityHeadersConfig = securityHeadersConfig
): NextResponse {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', config.frameOptions || 'DENY')
  response.headers.set('X-Content-Type-Options', config.contentTypeOptions || 'nosniff')
  response.headers.set('Referrer-Policy', config.referrerPolicy || 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', config.permissionsPolicy || 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set('Strict-Transport-Security', config.strictTransportSecurity || 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Build CSP header
  if (config.csp) {
    const directives = Object.entries(config.csp)
      .map(([key, value]) => `${key} ${value.join(' ')}`)
      .join('; ')
    response.headers.set('Content-Security-Policy', directives)
  }

  return response
}

// Middleware entry point
export function middleware(request: NextRequest) {
  return withSecurityHeaders(request)
}
