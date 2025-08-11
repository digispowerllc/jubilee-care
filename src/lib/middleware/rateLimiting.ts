import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rateLimit';

export async function withRateLimiter(request: NextRequest): Promise<NextResponse> {
    const ip = request.headers.get('x-real-ip') || '127.0.0.1';
    const { isRateLimited, limit, remaining } = await rateLimiter.check(ip);

    const response = isRateLimited
        ? new NextResponse('Too many requests', { status: 429 })
        : NextResponse.next();

    // Add rate limit headers to all responses
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 15 * 60 * 1000).toISOString());
    response.headers.set('X-RateLimit-Used', (limit - remaining).toString());
    response.headers.set('X-RateLimit-Policy', '15 minutes');
    response.headers.set('X-RateLimit-Bypass', isRateLimited ? 'true' : 'false');
    response.headers.set('X-RateLimit-Client-IP', ip);
    console.log(`Rate limiting applied for IP: ${ip}`, {
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        'X-RateLimit-Used': (limit - remaining).toString(),
        'X-RateLimit-Policy': '15 minutes',
        'X-RateLimit-Bypass': isRateLimited ? 'true' : 'false',
        'X-RateLimit-Client-IP': ip,
    });

    return response;
}