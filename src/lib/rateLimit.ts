// Simple in-memory rate limiter (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export const rateLimiter = {
    check: async (ip: string) => {
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const max = 60; // 60 requests per minute

        const entry = rateLimitStore.get(ip) || { count: 0, lastReset: now };

        if (now - entry.lastReset > windowMs) {
            entry.count = 0;
            entry.lastReset = now;
        }

        entry.count += 1;
        rateLimitStore.set(ip, entry);

        return {
            isRateLimited: entry.count > max,
            limit: max,
            remaining: Math.max(0, max - entry.count)
        };
    }
};