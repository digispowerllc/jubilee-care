import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Middleware = (request: NextRequest) => Promise<NextResponse | null | void>;

export async function chainMiddlewares(
    request: NextRequest,
    middlewares: Middleware[]
): Promise<NextResponse> {
    for (const middleware of middlewares) {
        const result = await middleware(request);
        if (result instanceof NextResponse) {
            return result;
        }
    }
    return NextResponse.next();
}