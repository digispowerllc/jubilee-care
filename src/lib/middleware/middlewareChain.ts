// lib/middleware/middlewareChain.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type Middleware = (
  request: NextRequest,
  response?: NextResponse
) => Promise<NextResponse> | NextResponse

export async function chainMiddlewares(
  request: NextRequest,
  middlewares: Middleware[]
): Promise<NextResponse> {
  let response: NextResponse | undefined = undefined

  for (const middleware of middlewares) {
    try {
      // Handle both async and sync middleware functions
      const middlewareResult = middleware(request, response)
      response = middlewareResult instanceof Promise 
        ? await middlewareResult 
        : middlewareResult
      
      // Ensure we always have a response object
      if (!response) {
        response = NextResponse.next()
      }
    } catch (error) {
      console.error('Middleware error:', error)
      return new NextResponse('Middleware Error', { status: 500 })
    }
  }

  return response || NextResponse.next()
}