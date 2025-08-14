// File: src/types/agent.ts
export interface AgentProfileData {
    surname: string;
    firstName: string;
    otherName: string | null;
    email: string;
    phone: string;
    nin: string;
    state: string;
    lga: string;
    address: string;
    emailVerified: boolean;
    memberSince?: Date;
    avatarUrl?: string;
}