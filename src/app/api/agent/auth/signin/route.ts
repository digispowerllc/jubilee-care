// File: src/app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSearchableHash, verifyProtectedData } from "@/lib/security/dataProtection";
import { createSession } from "@/lib/auth-utils"; // adjust path
import { z } from "zod";

// ===== Security Config =====
const SECURITY_CONFIG = {
  BASE_LOCK_HOURS: 3,       // base lockout for failed reset attempts
  PENALTY_DAYS: 3,          // extra days per persistent lock retry
  MAX_LOCK_DAYS: 365,       // maximum lockout = 1 year
};

// ===== Helpers =====
const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return "0s";
  const sec = Math.floor(ms / 1000);
  const years = Math.floor(sec / (365 * 24 * 60 * 60));
  const months = Math.floor((sec % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
  const days = Math.floor((sec % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((sec % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((sec % (60 * 60)) / 60);
  const seconds = sec % 60;

  return [
    years ? `${years}y` : null,
    months ? `${months}mo` : null,
    days ? `${days}d` : null,
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    seconds ? `${seconds}s` : null,
  ]
    .filter(Boolean)
    .join(" ");
};

// ===== Schema =====
const signInSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required").refine(val => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\+?[\d\s-]{10,}$/.test(val);
    return isEmail || isPhone;
  }, "Must be a valid email or phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = signInSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: parseResult.error.flatten() }, { status: 400 });
    }

    const { identifier, password } = parseResult.data;
    const identifierHash = await generateSearchableHash(identifier);

    const agentProfile = await prisma.agentProfile.findFirst({
      where: { OR: [{ emailHash: identifierHash }, { phoneHash: identifierHash }] },
      select: {
        id: true,
        agentId: true,
        passwordHash: true,
        accountLockedUntil: true,
        lockoutCount: true,
      },
    });

    if (!agentProfile) {
      return NextResponse.json({ success: false, error: "Invalid email/phone or password" }, { status: 401 });
    }

    // ===== Persistent lockout logic =====
    if (agentProfile.accountLockedUntil && new Date() < agentProfile.accountLockedUntil) {
      const newLockoutCount = (agentProfile.lockoutCount ?? 0) + 1;
      const penaltyMs = SECURITY_CONFIG.PENALTY_DAYS * newLockoutCount * 24 * 60 * 60 * 1000;
      const newLockoutUntil = new Date(
        Math.min(Date.now() + penaltyMs, Date.now() + SECURITY_CONFIG.MAX_LOCK_DAYS * 24 * 60 * 60 * 1000)
      );

      await prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: { accountLockedUntil: newLockoutUntil, lockoutCount: newLockoutCount },
      });

      await prisma.agent.update({
        where: { id: agentProfile.agentId },
        data: { lastLoginAt: new Date(), lastLoginAttemptIp: req.headers.get("x-forwarded-for") || undefined },
      })

      const remaining = newLockoutUntil.getTime() - Date.now();
      return NextResponse.json({
        success: false,
        error: "account_temporarily_locked",
        message: `Account is temporarily locked. Try again in ${formatTimeRemaining(remaining)}.`,
      }, { status: 429 });
    }

    // ===== Verify password =====
    const passwordMatch = await verifyProtectedData(password, agentProfile.passwordHash, "system-code");
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid email/phone or password" }, { status: 401 });
    }

    // ✅ Authentication successful
    const sessionToken = await createSession(agentProfile.agentId, {
      ip: req.headers.get("x-forwarded-for") || undefined,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/agent/profile",
    });

    response.cookies.set({
      name: "agent_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json({ success: false, error: "Login failed. Please try again." }, { status: 500 });
  }
}

