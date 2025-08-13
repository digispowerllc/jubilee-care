// File: src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSearchableHash } from "@/lib/security/dataProtection";
import { z } from "zod";
import { generateResetToken } from "@/lib/auth-utils";
import { sendPasswordResetEmail } from "@/lib/email-utils";
import { rateLimit } from "@/lib/middleware/rateLimit";
import { getClientIp } from "@/lib/client-ip";
import { writeToLogger } from "@/lib/logger";
import { subHours } from "date-fns";

// ===== Security Config =====
const SECURITY_CONFIG = {
  BASE_LOCK_HOURS: 3,       // first-time lockout length
  PENALTY_MONTHS: 1,        // extra months added per retry while locked
  MAX_LOCK_DAYS: 365,       // cap lockout to 1 year
  ACCOUNT_LOCKOUT: {
    MAX_ATTEMPTS: 3,
    WINDOW_HOURS: 1,
  },
  RATE_LIMIT: {
    WINDOW_MS: 1000 * 60 * 60, // 1 hour IP rate limit
    MAX_ATTEMPTS: 10,
  },
  RESET_TOKEN: {
    EXPIRY_HOURS: 1,
  },
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
  ].filter(Boolean).join(" ");
};

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .max(100, "Email too long")
    .transform((email) => email.toLowerCase().trim()),
});

export async function POST(req: Request) {
  let body: { email: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_request", message: "Invalid request body" },
      { status: 400 }
    );
  }

  const ip = getClientIp(req) || "unknown";

  try {
    const parseResult = forgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "invalid_email_format", message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const emailHash = await generateSearchableHash(email);

    const agentProfile = await prisma.agentProfile.findUnique({
      where: { emailHash },
      select: { id: true, email: true, accountLockedUntil: true, lockoutCount: true },
    });

    const successResponse = {
      success: true,
      message: "If an account exists with this email, you'll receive a reset link shortly",
    };

    if (!agentProfile) {
      // Always return success to avoid email enumeration
      return NextResponse.json(successResponse, { status: 200 });
    }

    // ===== Persistent Lockout Check =====
    if (agentProfile.accountLockedUntil && new Date() < agentProfile.accountLockedUntil) {
      let newLockoutUntil = agentProfile.accountLockedUntil;
      let newLockoutCount = agentProfile.lockoutCount ?? 0;

      // Every retry adds months to the lock, capped at 1 year
      newLockoutCount += 1;
      const addedMs = SECURITY_CONFIG.PENALTY_MONTHS * 30 * 24 * 60 * 60 * 1000;
      newLockoutUntil = new Date(
        Math.min(
          newLockoutUntil.getTime() + addedMs,
          Date.now() + SECURITY_CONFIG.MAX_LOCK_DAYS * 24 * 60 * 60 * 1000
        )
      );

      await prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: { accountLockedUntil: newLockoutUntil, lockoutCount: newLockoutCount },
      });

      const remaining = newLockoutUntil.getTime() - Date.now();
      return NextResponse.json(
        {
          success: false,
          error: "account_temporarily_locked",
          message: `Account is temporarily locked. Try again in ${formatTimeRemaining(remaining)}.`,
        },
        { status: 429 }
      );
    }

    // ===== IP Rate Limiting Only if Not DB Locked =====
    const rateLimitResult = await rateLimit({
      interval: SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
      limit: SECURITY_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
      uniqueId: ip,
      namespace: "ip",
    });

    if (!rateLimitResult.success) return NextResponse.json(successResponse, { status: 200 });

    // ===== Check Recent Attempts for New Lockout =====
    const attemptWindowStart = subHours(new Date(), SECURITY_CONFIG.ACCOUNT_LOCKOUT.WINDOW_HOURS);
    const recentAttempts = await prisma.passwordResetEvent.count({
      where: { agentId: agentProfile.id, createdAt: { gte: attemptWindowStart } },
    });

    if (recentAttempts >= SECURITY_CONFIG.ACCOUNT_LOCKOUT.MAX_ATTEMPTS) {
      const newLockoutUntil = new Date(Date.now() + SECURITY_CONFIG.BASE_LOCK_HOURS * 60 * 60 * 1000);

      await prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: { accountLockedUntil: newLockoutUntil, lockoutCount: (agentProfile.lockoutCount ?? 0) + 1 },
      });

      const remaining = newLockoutUntil.getTime() - Date.now();
      return NextResponse.json(
        {
          success: false,
          error: "account_temporarily_locked",
          message: `Too many reset attempts. Your account is locked for ${formatTimeRemaining(remaining)}.`,
        },
        { status: 429 }
      );
    }

    // ===== Generate Token and Send Email =====
    // Generate token
    const { token: resetToken, expiresAt } = await generateResetToken(agentProfile.id);
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/agent/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await prisma.$transaction([
      prisma.passwordResetEvent.create({
        data: { agentId: agentProfile.id, ipAddress: ip, userAgent: req.headers.get("user-agent") || undefined },
      }),
      prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: { lastPasswordResetAt: new Date() },
      }),
    ]);

    await sendPasswordResetEmail({
      email,
      name: email.split("@")[0].toUpperCase(),
      resetLink,
      expiryHours: SECURITY_CONFIG.RESET_TOKEN.EXPIRY_HOURS,
      ipAddress: ip,
    });

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    writeToLogger("error", `Forgot password error: ${error}`);
    return NextResponse.json(
      { success: false, error: "server_error", message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}