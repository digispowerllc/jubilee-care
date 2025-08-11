import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

interface SecurityHeadersConfig {
  frameOptions?: string
  contentTypeOptions?: string
  referrerPolicy?: string
  permissionsPolicy?: string
  csp?: Record<string, string[]>
  strictTransportSecurity?: string
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
      'https://*.vercel.app',
      `'nonce-${crypto.randomUUID()}'` // Dynamic nonce for inline scripts
    ],
    scriptSrcElem: [
      "'self'",
      'https://*.vercel.app'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Next.js styles
      'https://fonts.googleapis.com'
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://*.vercel.app'
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com'
    ],
    connectSrc: [
      "'self'",
      'https://*.vercel.app'
    ],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    workerSrc: ["'self'"],
    manifestSrc: ["'self'"]
  }
}

export function withSecurityHeaders(
  request: NextRequest,
  config: SecurityHeadersConfig = securityHeadersConfig
): NextResponse {
  const response = NextResponse.next()

  // Standard security headers
  response.headers.set('X-Frame-Options', config.frameOptions!)
  response.headers.set('X-Content-Type-Options', config.contentTypeOptions!)
  response.headers.set('Referrer-Policy', config.referrerPolicy!)
  response.headers.set('Permissions-Policy', config.permissionsPolicy!)
  response.headers.set('Strict-Transport-Security', config.strictTransportSecurity!)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // CSP Header
  if (config.csp) {
    const directives = Object.entries(config.csp)
      .map(([key, value]) => `${key} ${value.join(' ')}`)
      .join('; ')
    response.headers.set('Content-Security-Policy', directives)
  }

  return response
}