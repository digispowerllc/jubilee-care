import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from './app/actions/auth';
import { chainMiddlewares } from './lib/middleware/middlewareChain';

// List of public paths that don't require authentication
const publicPaths = [
  '/',                  // Homepage
  '/agent/signup',      // Signup page
  '/agent/signin',      // Signin page
  '/api',               // API routes
  '/_next/static',      // Static files
  '/_next/image',       // Next.js images
  '/favicon.ico'        // Favicon
];

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - public paths (in the array above)
     */
    '/((?!.+\\.[\\w]+$|_next).*)',
  ],
};


// 1. Authentication Middleware
async function authMiddleware(request: NextRequest): Promise<NextResponse | void> {
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return;
  }

  if (!(await isAuthenticated())) {
    const signinUrl = new URL('/agent/signin', request.url);
    signinUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }
}

// Rate limiting middleware
async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-real-ip');
  if (await isRateLimited(ip)) {
    return new NextResponse('Too many requests', { status: 429 });
  }
}

// Request logging middleware
async function loggingMiddleware(request: NextRequest) {
  console.log(`${request.method} ${request.nextUrl.pathname}`);
}

// 2. Add more middlewares as needed...
// async function loggingMiddleware(request: NextRequest) {...}
// async function rateLimitMiddleware(request: NextRequest) {...}

// Main middleware function
export async function middleware(request: NextRequest) {
  return chainMiddlewares(request, [
    authMiddleware,
    rateLimitMiddleware,
    loggingMiddleware
    // Add other middlewares here in execution order
    // loggingMiddleware,
    // rateLimitMiddleware
  ]);
}

// Simple in-memory rate limiter (for demonstration only)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

async function isRateLimited(ip: string | null): Promise<boolean> {
  if (!ip) return false; // Can't rate limit if IP is missing

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  entry.count += 1;
  entry.lastRequest = now;

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  rateLimitMap.set(ip, entry);
  return false;
}

