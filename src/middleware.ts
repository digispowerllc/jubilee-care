import type { NextRequest } from 'next/server';
import { chainMiddlewares } from '@/lib/middleware/middlewareChain';

// Import middlewares
import { withSecurityHeaders } from '@/lib/middleware/securityHeaders';
import { securityHeadersConfig } from '@/lib/middleware/securityHeaders';
import { withRequestLogging } from '@/lib/middleware/requestLogging';
import { withRateLimiter } from '@/lib/middleware/rateLimiting';
import { withPublicPaths } from '@/lib/middleware/withPublicPaths';

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
// This matcher applies the middleware to all paths except for API authentication routes, Next.js static files, images, and common public files like favicon and robots.txt.
export async function middleware(request: NextRequest) {
  return chainMiddlewares(request, [
    (req) => withSecurityHeaders(req, securityHeadersConfig), // 🛡️ Production security headers
    withRequestLogging,                                      // 📜 Request logging
    withRateLimiter,                                        // 🚫 Rate limiting
    withPublicPaths                                         // 🆓 Public paths
  ]);
}