import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface SecurityHeadersConfig {
  frameOptions?: string
  contentTypeOptions?: string
  referrerPolicy?: string
  permissionsPolicy?: string
  strictTransportSecurity?: string
  csp?: Record<string, string[]>
}

export const securityHeadersConfig: SecurityHeadersConfig = {
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
      `'nonce-${uuidv4()}'`,
      'https://*.vercel.app'
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'blob:'],
    fontSrc: ["'self'", 'data:'],
    connectSrc: ["'self'"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}

export function withSecurityHeaders(
  request: NextRequest,
  config: SecurityHeadersConfig = securityHeadersConfig
): NextResponse {
  const response = NextResponse.next()

  // Set security headers
  response.headers.set('X-Frame-Options', config.frameOptions || 'DENY')
  response.headers.set('X-Content-Type-Options', config.contentTypeOptions || 'nosniff')
  response.headers.set('Referrer-Policy', config.referrerPolicy || 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', config.permissionsPolicy || 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set('Strict-Transport-Security', config.strictTransportSecurity || 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Build CSP header if configured
  if (config.csp) {
    const directives = Object.entries(config.csp)
      .map(([key, value]) => `${key} ${value.join(' ')}`)
      .join('; ')
    response.headers.set('Content-Security-Policy', directives)
  }

  return response
}