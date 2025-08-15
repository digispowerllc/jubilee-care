// File: middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { chainMiddlewares } from '@/lib/middleware/middlewareChain'
import { securityHeadersConfig, withSecurityHeaders } from '@/lib/middleware/securityHeaders'
import { withRequestLogging } from '@/lib/middleware/requestLogging'
import { withRateLimiter } from '@/lib/middleware/rateLimiting'
import { withPublicPaths } from '@/lib/middleware/withPublicPaths'
import { withCors } from '@/lib/middleware/withCors'

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|health).*)',
  ],
}

export async function middleware(request: NextRequest): Promise<Response> {
  try {
    const result = await chainMiddlewares(request, [
      // 1. CORS headers first
      withCors,

      // 2. Security headers
      (req) => withSecurityHeaders(req, securityHeadersConfig),

      // 3. Request logging
      async (req) => {
        await withRequestLogging(req);
        return NextResponse.next();
      },

      // 4. Rate limiting
      (req) => withRateLimiter(req),

      // 5. Public paths handling
      withPublicPaths,


    ])

    return result
  } catch (error) {
    console.error('Middleware chain error:', error)
    const response = new Response('Internal Server Error', { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}