// File: src/lib/auth.ts
import { randomBytes, timingSafeEqual, createHash } from 'crypto';
import { createClient } from 'redis';
import { prisma } from './prisma';
import { addHours, isAfter } from 'date-fns';

// Initialize Redis client
const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis at startup
(async () => {
    try {
        await redis.connect();
        console.log('Redis client connected');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

// Constants
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
const SESSION_EXPIRY_HOURS = 24 * 7; // 1 week

// Types
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
    return inputBuffer.length === envBuffer.length &&
        timingSafeEqual(inputBuffer, envBuffer);
};

// Password Reset System
export const generateResetToken = async (userId: string): Promise<{ token: string; expiresAt: Date }> => {
    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), PASSWORD_RESET_TOKEN_EXPIRY_HOURS);
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Store in Redis with TTL
    await redis.setEx(`reset:${tokenHash}`, PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 3600, userId);

    // Store in database
    await prisma.passwordResetToken.create({
        data: {
            tokenHash,
            agentId: userId,
            expiresAt,
        },
    });

    return { token, expiresAt };
};

export const verifyResetToken = async (token: string): Promise<{ isValid: boolean; userId?: string; error?: string }> => {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Check Redis first
    const cachedUserId = await redis.get(`reset:${tokenHash}`);
    if (cachedUserId) {
        await redis.del(`reset:${tokenHash}`);
        return { isValid: true, userId: cachedUserId };
    }

    // Check database
    const resetToken = await prisma.passwordResetToken.findFirst({
        where: { tokenHash },
        include: { agent: true }
    });

    if (!resetToken) return { isValid: false, error: 'Invalid token' };
    if (resetToken.usedAt) return { isValid: false, error: 'Token already used' };
    if (isAfter(new Date(), resetToken.expiresAt)) return { isValid: false, error: 'Token expired' };

    return { isValid: true, userId: resetToken.agentId };
};

export const markTokenAsUsed = async (token: string): Promise<void> => {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    await prisma.passwordResetToken.updateMany({
        where: { tokenHash },
        data: { usedAt: new Date() }
    });
    await redis.setEx(`used:${tokenHash}`, PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 3600, '1');
};

// Session Management
export const createSession = async (userId: string, metadata: { ip?: string; userAgent?: string } = {}): Promise<string> => {
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), SESSION_EXPIRY_HOURS);

    // Store in Redis
    await redis.setEx(`session:${sessionToken}`, SESSION_EXPIRY_HOURS * 3600, userId);

    // Store in database
    await prisma.agentSession.create({
        data: {
            token: sessionToken,
            agentId: userId,
            ipAddress: metadata.ip,
            userAgent: metadata.userAgent,
            expiresAt,
        }
    });

    return sessionToken;
};

export const invalidateAllSessions = async (userId: string, options?: { keepCurrentToken?: string }): Promise<void> => {
    // Invalidate Redis sessions
    const sessionKeys = await redis.keys(`session:*`);
    for (const key of sessionKeys) {
        const [, token] = key.split(':');
        if (options?.keepCurrentToken && token === options.keepCurrentToken) continue;
        await redis.del(key);
    }

    // Invalidate database sessions
    await prisma.agentSession.updateMany({
        where: {
            agentId: userId,
            ...(options?.keepCurrentToken && { token: { not: options.keepCurrentToken } })
        },
        data: { revokedAt: new Date() }
    });
};

// Cleanup Utilities
export const cleanupExpiredSessions = async (): Promise<number> => {
    const { count } = await prisma.agentSession.deleteMany({
        where: { expiresAt: { lt: new Date() } }
    });
    return count;
};

export const cleanupExpiredResetTokens = async (): Promise<number> => {
    const { count } = await prisma.passwordResetToken.deleteMany({
        where: { expiresAt: { lt: new Date() } }
    });
    return count;
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    await redis.quit();
});