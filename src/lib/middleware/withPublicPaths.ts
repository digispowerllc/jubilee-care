import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/auth',
    '/_next/static',
    '_next/image',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
];

export async function withPublicPaths(request: NextRequest): Promise<NextResponse> {
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname === path ||
        request.nextUrl.pathname.startsWith(path)
    );

    // console.log(`Checking public paths for: ${request.nextUrl.pathname}`);

    if (isPublicPath) {
        // console.log(`Public path accessed: ${request.nextUrl.pathname}`);
        return NextResponse.next();
    }
    // Default response if not a public path
    return NextResponse.next();
}