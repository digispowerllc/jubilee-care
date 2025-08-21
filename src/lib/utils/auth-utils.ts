// File: src/lib/auth.ts
import { randomBytes, timingSafeEqual, createHash } from "crypto";
import { prisma } from "@/lib/utils/prisma";
import { addHours, isAfter } from "date-fns";

const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;

export interface User {
  id: string;
  name: string;
  email?: string;
}

// API Key Validation - unchanged
export const validateApiKey = (apiKey: string | undefined): boolean => {
  if (!apiKey || !process.env.NIMC_API_KEY) return false;
  const inputBuffer = Buffer.from(apiKey);
  const envBuffer = Buffer.from(process.env.NIMC_API_KEY);
  return (
    inputBuffer.length === envBuffer.length &&
    timingSafeEqual(inputBuffer, envBuffer)
  );
};

// ------------------- GENERATE RESET TOKEN -------------------

export const generateResetToken = async (
  agentId: string
): Promise<{ token: string; expiresAt: Date }> => {
  if (!agentId) throw new Error("Agent ID is required");

  // Generate token and hash
  const token = randomBytes(32).toString("hex");
  const expiresAt = addHours(new Date(), PASSWORD_RESET_TOKEN_EXPIRY_HOURS);

  // Consistent hash generation
  const tokenHash = createHash("sha256")
    .update(token.trim()) // Trim whitespace
    .digest("hex");

  console.log("[Generate] Agent ID:", agentId);
  console.log("[Generate] Raw token:", token);
  console.log("[Generate] Token hash:", tokenHash);
  console.log("[Generate] Expires at:", expiresAt.toISOString());

  await prisma.$transaction(async (tx) => {
    // Delete existing tokens
    await tx.passwordResetToken.deleteMany({
      where: { agentId },
    });

    // Verify agent exists
    const agentExists = await tx.agent.findUnique({
      where: { id: agentId },
      select: { id: true },
    });

    if (!agentExists) {
      throw new Error("Agent not found");
    }

    // Create new token
    await tx.passwordResetToken.create({
      data: {
        tokenHash,
        agentId,
        expiresAt,
      },
    });
  });

  return { token, expiresAt };
};

// ------------------- VERIFY RESET TOKEN -------------------

export const verifyResetToken = async (
  token: string,
  agentId: string
): Promise<{
  isValid: boolean;
  agentId?: string;
  error?: string;
}> => {
  if (!token?.trim()) {
    console.error("[Verify] Empty token provided");
    return { isValid: false, error: "No token provided" };
  }

  if (!agentId) {
    console.error("[Verify] No agentId provided");
    return { isValid: false, error: "Agent ID required" };
  }

  try {
    // Normalize inputs
    const cleanToken = token.trim();
    console.log("[Verify] Received token:", cleanToken);
    console.log("[Verify] Received agentId:", agentId);

    // Generate hash using same method as generation
    const tokenHash = createHash("sha256").update(cleanToken).digest("hex");

    console.log("[Verify] Generated hash:", tokenHash);

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        agentId, // Critical: Verify both token AND agentId
      },
      select: {
        id: true,
        agentId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (!resetToken) {
      // Debug: Check if token exists without agentId match
      const anyToken = await prisma.passwordResetToken.findFirst({
        where: { tokenHash },
      });
      console.log("[Verify] Token exists without agentId match:", !!anyToken);

      console.error("[Verify] Token not found for this agent");
      return {
        isValid: false,
        error: "Invalid token. Request a new reset link.",
      };
    }

    console.log("[Verify] Found token record:", {
      id: resetToken.id,
      agentId: resetToken.agentId,
      expiresAt: resetToken.expiresAt.toISOString(),
      usedAt: resetToken.usedAt?.toISOString(),
    });

    // Check token status
    if (resetToken.usedAt) {
      console.error("[Verify] Token already used at:", resetToken.usedAt);
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return { isValid: false, error: "Token already used" };
    }

    if (isAfter(new Date(), resetToken.expiresAt)) {
      console.error("[Verify] Token expired");
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return { isValid: false, error: "Token expired" };
    }

    console.log("[Verify] Token is valid");
    return {
      isValid: true,
      agentId: resetToken.agentId,
    };
  } catch (error) {
    console.error("[Verify] Error:", error);
    return { isValid: false, error: "Internal server error" };
  }
};

// ------------------- MARK TOKEN AS USED -------------------
export const markTokenAsUsed = async (
  token: string,
  agentId: string
): Promise<void> => {
  if (!token?.trim() || !agentId) {
    throw new Error("Token and Agent ID are required");
  }

  const tokenHash = createHash("sha256").update(token.trim()).digest("hex");

  await prisma.passwordResetToken.updateMany({
    where: {
      tokenHash,
      agentId, // Ensure we only mark tokens for this agent
      usedAt: null, // Only unused tokens
    },
    data: { usedAt: new Date() },
  });
};

// Session Management - unchanged
// export const createSession = async (
//   userId: string,
//   metadata: { ip?: string; userAgent?: string } = {}
// ): Promise<string> => {
//   const sessionToken = randomBytes(32).toString('hex');
//   const expiresAt = addHours(new Date(), SESSION_EXPIRY_HOURS);

//   await prisma.agentSession.create({
//     data: {
//       token: sessionToken,
//       agentId: userId,
//       ipAddress: metadata.ip,
//       userAgent: metadata.userAgent,
//       expiresAt,
//     },
//   });

//   return sessionToken;
// };

export async function createSession(
  agentId: string,
  options?: { ip?: string; userAgent?: string }
): Promise<string> {
  // Include basic agent info in the token payload
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      surname: true,
      firstName: true,
      otherName: true,
      email: true,
    },
  });

  if (!agent) throw new Error("Agent not found");

  const payload = {
    agentId: agent.id,
    name: `${agent.surname} ${agent.firstName} ${agent.otherName}`,
    email: agent.email,
    issuedAt: Date.now(),
  };

  // Encode payload as base64 (JWT-style, without signature)
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

  // Random token prefix for uniqueness/security
  const tokenPrefix = randomBytes(16).toString("hex");

  const token = `${tokenPrefix}.${base64Payload}`;

  // Store session in DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.agentSession.create({
    data: {
      token,
      agentId: agent.id,
      ipAddress: options?.ip,
      userAgent: options?.userAgent,
      expiresAt,
    },
  });

  return token;
}

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

// Cleanup Utilities - unchanged
export const cleanupExpiredSessions = async (): Promise<number> => {
  const { count } = await prisma.agentSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
};

export const cleanupTokens = async (agentId: string): Promise<number> => {
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: { agentId, expiresAt: { lt: new Date() }, usedAt: null },
  });
  return count;
};

export const cleanupExpiredResetTokens = async (): Promise<number> => {
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
};

export async function getAgentFromSession(token?: string) {
  if (!token) return null;

  const session = await prisma.agentSession.findFirst({
    where: {
      token,
      revokedAt: null,
      expiresAt: { gte: new Date() },
    },
    include: { agent: true },
  });

  if (!session) return null;
  return session.agent;
}
