import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type Middleware = (request: NextRequest) => Promise<NextResponse | void | Response>;

export async function chainMiddlewares(
  request: NextRequest,
  middlewares: Middleware[]
): Promise<NextResponse | Response> {
  let response: NextResponse | void | Response = NextResponse.next();
  
  for (const middleware of middlewares) {
    const result = await middleware(request);
    if (result) {
      response = result;
      // If middleware returns a response, break the chain
      if (response instanceof NextResponse || response instanceof Response) {
        break;
      }
    }
  }
  
  return response || NextResponse.next();
}