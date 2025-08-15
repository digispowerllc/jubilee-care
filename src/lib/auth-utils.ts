// File: src/lib/auth-edge.ts
import { prisma } from "./prisma";
import { addHours, isAfter } from "date-fns";

const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
const SESSION_EXPIRY_HOURS = 24 * 7;

// ----------------- Helpers -----------------
export const generateRandomHex = async (length: number) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const sha256Hex = async (input: string) => {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++)
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
};

// ----------------- API Key Validation -----------------
export const validateApiKey = (apiKey?: string): boolean => {
  if (!apiKey || !process.env.NIMC_API_KEY) return false;
  return timingSafeEqual(apiKey, process.env.NIMC_API_KEY);
};

// ----------------- Password Reset System -----------------
export const generateResetToken = async (userId: string) => {
  const token = await generateRandomHex(32);
  const expiresAt = addHours(new Date(), PASSWORD_RESET_TOKEN_EXPIRY_HOURS);
  const tokenHash = await sha256Hex(token);

  const agent = await prisma.agentProfile.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!agent?.email) throw new Error("User email not found");

  await prisma.passwordResetToken.create({
    data: { tokenHash, agentId: userId, expiresAt },
  });

  return { token, expiresAt, email: agent.email };
};

export const verifyResetToken = async (token: string, email?: string) => {
  const tokenHash = await sha256Hex(token);

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { tokenHash },
    include: { agent: true },
  });

  if (!resetToken) return { isValid: false, error: "Invalid token" };
  if (resetToken.usedAt) return { isValid: false, error: "Token already used" };
  if (isAfter(new Date(), resetToken.expiresAt))
    return { isValid: false, error: "Token expired" };
  if (email && resetToken.agent.email?.toLowerCase() !== email.toLowerCase())
    return { isValid: false, error: "Email does not match token" };

  return {
    isValid: true,
    userId: resetToken.agentId,
    email: resetToken.agent.email || undefined,
  };
};

export const markTokenAsUsed = async (token: string) => {
  const tokenHash = await sha256Hex(token);
  await prisma.passwordResetToken.updateMany({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
};

// ----------------- Session Management -----------------
export const createSession = async (
  userId: string,
  metadata: { ip?: string; userAgent?: string } = {}
) => {
  const sessionToken = await generateRandomHex(32);
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
) => {
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

// ----------------- Cleanup -----------------
export const cleanupExpiredSessions = async () =>
  (
    await prisma.agentSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
  ).count;

export const cleanupTokens = async (agentId: string) =>
  (
    await prisma.passwordResetToken.deleteMany({
      where: { agentId, expiresAt: { lt: new Date() }, usedAt: null },
    })
  ).count;

export const cleanupExpiredResetTokens = async () =>
  (
    await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
  ).count;

// ----------------- Session Retrieval -----------------
export async function getAgentFromSession(token?: string) {
  if (!token) return null;

  const session = await prisma.agentSession.findFirst({
    where: { token, revokedAt: null, expiresAt: { gte: new Date() } },
    include: { agent: true },
  });

  return session?.agent || null;
}
