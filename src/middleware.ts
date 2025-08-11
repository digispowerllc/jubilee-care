// middleware.ts
import type { NextRequest } from 'next/server'
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
      withCors,
      (req) => withSecurityHeaders(req, securityHeadersConfig),
      async (req) => {
        await withRequestLogging(req);
        // Pass through to next middleware, returning the request as a NextResponse
        // or you can return NextResponse.next() if that's the convention in your chain
        // Assuming NextResponse.next() is correct:
        const { NextResponse } = await import('next/server');
        return NextResponse.next();
      },
      withRateLimiter,
      withPublicPaths
    ])
    
    return result
  } catch (error) {
    console.error('Middleware chain error:', error)
    const response = new Response('Internal Server Error', { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}