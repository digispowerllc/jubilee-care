import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Configure bcrypt (you'll need to install it)
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

export async function signIn(agentId: string, accessCode: string) {
    try {
        // 1. Find agent profile with access code
        const profile = await prisma.agentProfile.findFirst({
            where: {
                OR: [
                    { accessCode: agentId }, // Some systems use accessCode as login ID
                    { agent: { email: agentId } }, // Allow email login
                    { agent: { phone: agentId } }, // Allow phone login
                ],
            },
            include: {
                agent: true,
            },
        });

        // 2. Verify profile exists and access code matches
        if (!profile || !(await bcrypt.compare(accessCode, profile.accessCode))) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        // 3. Check agent status
        if (!profile.agent.isActive || profile.agent.isDeleted) {
            return {
                success: false,
                message: 'Account is inactive or deleted'
            };
        }

        // 4. Set secure session cookie
        const cookieStore = await cookies();
        cookieStore.set('agent-auth', profile.agent.id, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'strict'
        });

        return {
            success: true,
            agent: {
                id: profile.agent.id,
                name: `${profile.agent.surname} ${profile.agent.firstName}`,
                email: profile.agent.email,
                // Include other necessary fields
            }
        };

    } catch (error) {
        console.error('Authentication error:', error);
        return {
            success: false,
            message: 'An error occurred during authentication'
        };
    }
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete('agent-auth');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const agentId = cookieStore.get('agent-auth')?.value;
    if (!agentId) return false;

    try {
        const agent = await prisma.agent.findUnique({
            where: {
                id: agentId,
                isActive: true,
                isDeleted: false
            },
            select: { id: true }
        });
        return !!agent;
    } catch (error) {
        console.error('Auth verification error:', error);
        return false;
    }
}

export async function getCurrentAgent() {
    const cookieStore = await cookies();
    const agentId = cookieStore.get('agent-auth')?.value;
    if (!agentId) return null;

    return await prisma.agent.findUnique({
        where: {
            id: agentId,
            isActive: true,
            isDeleted: false
        },
        select: {
            id: true,
            surname: true,
            firstName: true,
            otherName: true,
            email: true,
            phone: true,
            state: true,
            lga: true,
            profile: {
                select: {
                    id: true,
                    passportUrl: true
                }
            }
        }
    });
}

// Helper to create/update agent profile with hashed access code
export async function setAgentAccessCode(agentId: string, rawAccessCode: string) {
    const hashedCode = await bcrypt.hash(rawAccessCode, SALT_ROUNDS);

    return await prisma.agentProfile.upsert({
        where: { agentId },
        update: { accessCode: hashedCode },
        create: {
            id: agentId,
            agentId,
            accessCode: hashedCode
        }
    });
}