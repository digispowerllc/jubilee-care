// ========= Security Headers Middleware =========
import { NextResponse } from "next/server";
import { cspConfig } from "../security/cspConfig";

export async function withSecurityHeaders(): Promise<NextResponse> {
  const res = NextResponse.next();

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

  const directives = Object.entries(cspConfig)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
  res.headers.set("Content-Security-Policy", directives);

  return res;
}
