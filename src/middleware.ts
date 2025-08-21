// File: src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { chainMiddlewares } from "@/lib/middleware/middlewareChain";
import { withRequestLogging } from "@/lib/middleware/requestLogging";
import { withRateLimiter } from "@/lib/middleware/rateLimiting";
import { withAuthRedirect } from "@/lib/middleware/withAuthRedirect";
import { withSession } from "@/lib/middleware/withSession";
import { withPublicPaths } from "@/lib/middleware/withPublicPaths";
import { withCors } from "@/lib/middleware/withCors";

// ========= Matcher Config =========
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|health).*)",
  ],
};

// ========= Security Headers Middleware =========
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

async function withSecurityHeaders(): Promise<NextResponse> {
  const res = NextResponse.next();
  const nonce = generateNonce();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // CSP
  const csp = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'report-sample'",
      `'nonce-${nonce}'`,
      "https://*.vercel.app",
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https://ui-avatars.com",
      "https://res.cloudinary.com",
      "https://*.cloudinary.com/",
    ],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "https://*.vercel.app"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
  };

  const directives = Object.entries(csp)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
  res.headers.set("Content-Security-Policy", directives);

  return res;
}

// ========= Middleware Chain =========
export async function middleware(request: NextRequest): Promise<Response> {
  try {
    return await chainMiddlewares(request, [
      withCors,
      withSecurityHeaders,
      async (req) => {
        await withRequestLogging(req);
        return NextResponse.next();
      },
      withRateLimiter,
      withPublicPaths,
      withAuthRedirect, // logged-in users can’t see signin/signup
      withSession, // blocks private paths if no valid session
    ]);
  } catch (error) {
    console.error("Middleware chain error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
