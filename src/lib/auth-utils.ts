// File: src/lib/auth.ts
import { randomBytes, timingSafeEqual, createHash } from 'crypto';
import { prisma } from './prisma';
import { addHours, isAfter } from 'date-fns';

const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
const SESSION_EXPIRY_HOURS = 24 * 7; // 1 week

export interface User {
  id: string;
  name: string;
  email?: string;
}

// API Key Validation
export const validateApiKey = (apiKey: string | undefined): boolean => {
  if (!apiKey || !process.env.NIMC_API_KEY) return false;
  const inputBuffer = Buffer.from(apiKey);
  const envBuffer = Buffer.from(process.env.NIMC_API_KEY);
  return (
    inputBuffer.length === envBuffer.length &&
    timingSafeEqual(inputBuffer, envBuffer)
  );
};

// Password Reset System
export const generateResetToken = async (
  userId: string
): Promise<{ token: string; expiresAt: Date; email: string }> => {
  const token = randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), PASSWORD_RESET_TOKEN_EXPIRY_HOURS);
  const tokenHash = createHash('sha256').update(token).digest('hex');

  // Get the user's email so we can attach it to the link
  const agent = await prisma.agentProfile.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!agent?.email) {
    throw new Error("User email not found");
  }

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      agentId: userId,
      expiresAt,
    },
  });

  return { token, expiresAt, email: agent.email };
};

export const verifyResetToken = async (
  token: string,
  email?: string
): Promise<{ isValid: boolean; userId?: string; email?: string; error?: string }> => {
  const tokenHash = createHash('sha256').update(token).digest('hex');

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { tokenHash },
    include: { agent: true },
  });

  if (!resetToken) return { isValid: false, error: 'Invalid token' };
  if (resetToken.usedAt)
    return { isValid: false, error: 'Token already used' };
  if (isAfter(new Date(), resetToken.expiresAt))
    return { isValid: false, error: 'Token expired' };

  // Optional: extra check for email match
  if (email && resetToken.agent.email?.toLowerCase() !== email.toLowerCase()) {
    return { isValid: false, error: 'Email does not match token' };
  }

  return {
    isValid: true,
    userId: resetToken.agentId,
    email: resetToken.agent.email || undefined
  };
};


export const markTokenAsUsed = async (token: string): Promise<void> => {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await prisma.passwordResetToken.updateMany({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
};

// Session Management
export const createSession = async (
  userId: string,
  metadata: { ip?: string; userAgent?: string } = {}
): Promise<string> => {
  const sessionToken = randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), SESSION_EXPIRY_HOURS);

  await prisma.agentSession.create({
    data: {
      token: sessionToken,
      agentId: userId,
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      expiresAt,
    },
  });

  return sessionToken;
};

export const invalidateAllSessions = async (
  userId: string,
  options?: { keepCurrentToken?: string }
): Promise<void> => {
  await prisma.agentSession.updateMany({
    where: {
      agentId: userId,
      ...(options?.keepCurrentToken && {
        token: { not: options.keepCurrentToken },
      }),
    },
    data: { revokedAt: new Date() },
  });
};

// Cleanup Utilities
export const cleanupExpiredSessions = async (): Promise<number> => {
  const { count } = await prisma.agentSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
};

export const cleanupExpiredResetTokens = async (): Promise<number> => {
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
};
