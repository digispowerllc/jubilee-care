// File: src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSearchableHash } from "@/lib/security/dataProtection";
import { z } from "zod";
import { generateResetToken } from "@/lib/auth-utils";
import { sendPasswordResetEmail } from "@/lib/email-utils";
import { rateLimit } from '@/lib/middleware/rateLimit';
import { getClientIp } from '@/lib/client-ip';
import { writeToLogger } from '@/lib/logger';
import { subHours } from 'date-fns';

// Security configuration
const SECURITY_CONFIG = {
  RATE_LIMIT: {
    WINDOW_MS: 60 * 60 * 5000, // 5 hour
    MAX_ATTEMPTS: 5,
  },
  RESET_TOKEN: {
    EXPIRY_HOURS: 1,
  },
  ACCOUNT_LOCKOUT: {
    MAX_ATTEMPTS: 3,
    WINDOW_HOURS: 1,
  }
};

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .max(100, "Email too long")
    .transform(email => email.toLowerCase().trim()),
});

export async function POST(req: Request) {
  const startTime = Date.now();
  let agentProfileId: string | null = null;

  try {
    // Rate limiting by IP
    const ip = getClientIp(req) || 'unknown';
    const rateLimitResult = await rateLimit({
      interval: SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
      limit: SECURITY_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
      uniqueId: ip,
      namespace: 'ip',
    });

    if (!rateLimitResult.success) {
      writeToLogger('warn', `Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          error: "rate_limit_exceeded",
          message: "Too many requests. Please try again later."
        },
        {
          status: 429,
          headers: { 'Retry-After': String((rateLimitResult.reset - Date.now()) / 1000) } // in seconds
        }
      );
    }

    // Validate request body
    const body = await req.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      writeToLogger('debug', 'Invalid email format received');
      return NextResponse.json(
        {
          success: false,
          error: "invalid_email_format",
          message: "Please provide a valid email address",
          details: parseResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const emailHash = await generateSearchableHash(email);

    // Security: Always return success to prevent email enumeration
    const successResponse = {
      success: true,
      message: "If an account exists with this email, you'll receive a reset link shortly",
    };

    // Find user without exposing existence
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { emailHash },
      select: {
        id: true,
        email: true,
        passwordResetAttempts: true,
        lastPasswordResetAt: true,
        accountLockedUntil: true,
      },
    });

    agentProfileId = agentProfile?.id || null;

    if (!agentProfile) {
      writeToLogger('debug', `Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(successResponse, { status: 200 });
    }

    // Check if account is temporarily locked
    if (agentProfile.accountLockedUntil && new Date() < agentProfile.accountLockedUntil) {
      writeToLogger('warn', `Account locked for user: ${agentProfile.id}`);
      return NextResponse.json(
        {
          success: false,
          error: "account_temporarily_locked",
          message: "Account is temporarily locked due to too many reset attempts."
        },
        { status: 429 }
      );
    }

    // Check reset attempt frequency
    const attemptWindowStart = subHours(new Date(), SECURITY_CONFIG.ACCOUNT_LOCKOUT.WINDOW_HOURS);
    const recentAttempts = await prisma.passwordResetEvent.count({
      where: {
        agentId: agentProfile.id,
        createdAt: { gte: attemptWindowStart }
      }
    });

    if (recentAttempts >= SECURITY_CONFIG.ACCOUNT_LOCKOUT.MAX_ATTEMPTS) {
      // Lock account for 1 hour
      const lockoutUntil = new Date(Date.now() + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS);

      await prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: { accountLockedUntil: lockoutUntil }
      });

      writeToLogger('warn', `Account locked due to too many reset attempts for user: ${agentProfile.id}`);
      return NextResponse.json(
        {
          success: false,
          error: "account_temporarily_locked",
          message: "Too many reset attempts. Account temporarily locked for 1 hour."
        },
        { status: 429 }
      );
    }

    // Generate secure reset token
    const { token: resetToken } = await generateResetToken(
      agentProfile.id
    );

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`;

    // Record the attempt
    await prisma.$transaction([
      prisma.passwordResetEvent.create({
        data: {
          agentId: agentProfile.id,
          ipAddress: ip,
          userAgent: req.headers.get('user-agent') || undefined,
        },
      }),
      prisma.agentProfile.update({
        where: { id: agentProfile.id },
        data: {
          lastPasswordResetAt: new Date(),
        },
      }),
    ]);

    // Send email (async with error handling)
    sendPasswordResetEmail({
      email: agentProfile.email,
      name: agentProfile.email.split('@')[0],
      resetLink,
      expiryHours: SECURITY_CONFIG.RESET_TOKEN.EXPIRY_HOURS,
      ipAddress: ip,
    })
      .then(() => writeToLogger('info', `Password reset email sent to ${agentProfile.email}`))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          writeToLogger('error', `Failed to send password reset email: ${err.message}`);
        } else {
          writeToLogger('error', 'Failed to send password reset email: Unknown error');
        }
      });

    writeToLogger('info', `Password reset initiated for user ${agentProfile.id}`);
    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    writeToLogger('error', `Forgot password error for user ${agentProfileId}: ${error instanceof Error ? error.message : 'Unknown error'}`);

    return NextResponse.json(
      {
        success: false,
        error: "server_error",
        message: "An unexpected error occurred. Our team has been notified."
      },
      { status: 500 }
    );
  } finally {
    writeToLogger('debug', `Forgot password request processed in ${Date.now() - startTime}ms`);
  }
}