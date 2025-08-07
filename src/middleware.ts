import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from './app/actions/auth';

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

export async function middleware(request: NextRequest) {
  // Check if the requested path is in the public paths array
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a public path, just continue
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected paths, check authentication
  if (await isAuthenticated()) {
    return NextResponse.next();
  }

  // Redirect to signin with the original path as a redirect parameter
  const signinUrl = new URL('/agent/signin', request.url);
  signinUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(signinUrl);
}