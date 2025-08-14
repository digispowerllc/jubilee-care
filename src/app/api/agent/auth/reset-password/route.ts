import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectData } from "@/lib/security/dataProtection";
import { verifyResetToken } from "@/lib/auth-utils";
import { writeToLogger } from "@/lib/logger";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  sid: z.string().min(1),
  password: z.string().min(8)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = resetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Password requirements not met",
          code: "PASSWORD_REQUIREMENTS",
          error: parseResult.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { token, sid, password } = parseResult.data;

    // Verify token using your existing auth-utils function
    const { isValid, userId, error } = await verifyResetToken(token);
    
    if (!isValid || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: error || "Invalid or expired password reset token",
          code: "INVALID_TOKEN"
        },
        { status: 400 }
      );
    }

    // Verify token belongs to the requested account
    if (userId !== sid) {
      return NextResponse.json(
        {
          success: false,
          message: "Token does not match the account",
          code: "ACCOUNT_MISMATCH"
        },
        { status: 403 }
      );
    }

    // Check if account is locked
    const profile = await prisma.agentProfile.findUnique({
      where: { id: sid },
      select: { accountLockedUntil: true }
    });

    if (profile?.accountLockedUntil && profile.accountLockedUntil > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is temporarily locked",
          code: "ACCOUNT_LOCKED"
        },
        { status: 403 }
      );
    }

    // Update password and security records in transaction
    const result = await prisma.$transaction(async (prismaTx) => {
      // Generate secure password hash
      const passwordHash = (await protectData(password, "system-code")).encrypted;

      // Update password and reset security fields
      const updatedProfile = await prismaTx.agentProfile.update({
        where: { id: sid },
        data: {
          passwordHash,
          updatedAt: new Date(),
          lastPasswordResetAt: new Date(),
          passwordResetAttempts: 0,
          accountLockedUntil: null,
          lockoutCount: 0
        },
        select: {
          agentId: true,
          email: true
        }
      });

      // Invalidate all existing reset tokens for this user
      await prismaTx.passwordResetToken.deleteMany({
        where: { agentId: sid }
      });

      // Invalidate all sessions
      await prismaTx.agentSession.deleteMany({
        where: { agentId: sid }
      });

      return updatedProfile;
    });

    // Log the password reset event
    writeToLogger("info", `Password reset for agent ${result.agentId}`);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      agentId: result.agentId,
      email: result.email
    });

  } catch (err) {
    writeToLogger("error", `Password reset error: ${err}`);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during password reset",
        code: "SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}