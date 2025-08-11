import type { NextRequest } from 'next/server'
import { chainMiddlewares } from '@/lib/middleware/middlewareChain'
import { securityHeadersConfig } from '@/lib/middleware/securityHeaders'
import { withRequestLogging } from '@/lib/middleware/requestLogging'
import { withRateLimiter } from '@/lib/middleware/rateLimiting'
import { withPublicPaths } from '@/lib/middleware/withPublicPaths'
import { withAuthentication } from '@/lib/middleware/authentication'

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API auth routes (api/auth)
     * - Static files (_next/static, _next/image)
     * - Public files (favicon.ico, robots.txt)
     * - Health check endpoint
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|health).*)',
  ],
}

export async function middleware(request: NextRequest) {
  try {
    return await chainMiddlewares(request, [
      // 1️⃣ Apply security headers first
      (req) => withSecurityHeaders(req, securityHeadersConfig),
      
      // 2️⃣ Log the request
      withRequestLogging,
      
      // 3️⃣ Apply rate limiting
      withRateLimiter,
      
      // 4️⃣ Handle public paths
      withPublicPaths,
      
      // 5️⃣ Authentication check (added new)
      withAuthentication
    ])
  } catch (error) {
    console.error('Middleware chain error:', error)
    // Return a generic error response
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function withSecurityHeaders(req: NextRequest, securityHeadersConfig: SecurityHeadersConfig): Promise<void | import("next/server").NextResponse<unknown> | Response> {
  throw new Error('Function not implemented.')
}
