// File: src/app/agent/profile/services/profileService.ts
import { prisma } from "@/lib/prisma";
import { unprotectData } from "@/lib/security/dataProtection";
import { AgentProfileData } from "../types";

/**
 * Fetch raw agent data from DB
 */
export async function fetchAgentData(agentId: string) {
    return await prisma.agent.findUnique({
        where: { id: agentId },
        select: {
            id: true,
            surname: true,
            firstName: true,
            otherName: true,
            dob: true,
            gender: true,
            email: true,
            phone: true,
            nin: true,
            state: true,
            lga: true,
            address: true,
            createdAt: true,
            avatarUrl: true,
            profile: {
                select: {
                    emailVerified: true
                }
            }
        },
    });
}

/**
 * Decrypt fields that are stored encrypted in DB
 */
export async function getUnprotectedFields(agentId: string) {
    const data = await prisma.agent.findUnique({
        where: { id: agentId },
        select: {
            surname: true,
            firstName: true,
            otherName: true,
            dob: true,
            gender: true,
            email: true,
            phone: true,
            nin: true,
            state: true,
            lga: true,
            address: true,
            profile: {
                select: {
                    emailVerified: true
                }
            }
        },
    });

    if (!data) return null;

    return Promise.all([
        unprotectData(data.surname, "name"),
        unprotectData(data.firstName, "name"),
        data.otherName ? unprotectData(data.otherName, "name") : null,
        data.dob ? unprotectData(data.dob.toISOString(), "date") : null,
        data.gender ? unprotectData(data.gender, "gender") : null,
        unprotectData(data.email, "email"),
        unprotectData(data.phone, "phone"),
        unprotectData(data.nin, "government"),
        unprotectData(data.state, "location"),
        unprotectData(data.lga, "location"),
        unprotectData(data.address, "location"),
        data.profile?.emailVerified ?? false
    ]);
}

/**
 * Utility: initials from name
 */
export function getInitials(surname: string, firstName: string) {
    return `${surname?.charAt(0) || ""}${firstName?.charAt(0) || ""}`.toUpperCase();
}

/**
 * Utility: full name
 */
export function getFullName(
    surname: string,
    firstName: string,
    otherName: string | null
) {
    return `${surname} ${firstName}${otherName ? ` ${otherName}` : ""}`;
}

/**
 * Prepares full decrypted + safe profile data
 */
export async function prepareProfileData(
    agentId: string
): Promise<AgentProfileData | null> {
    const [agentData, unprotectedFields] = await Promise.all([
        fetchAgentData(agentId),
        getUnprotectedFields(agentId),
    ]);

    if (!agentData || !unprotectedFields) return null;

    const [
        surname,
        firstName,
        otherName,
        dob,
        gender,
        email,
        phone,
        nin,
        state,
        lga,
        address,
        emailVerified
    ] = unprotectedFields;

    return {
        agentId: agentData.id,
        surname: surname ?? "",
        firstName: firstName ?? "",
        otherName,
        dob: dob ? new Date(dob) : agentData.dob ?? null,
        gender: gender ?? agentData.gender ?? null,
        email: email ?? "",
        phone: phone ?? "",
        nin: nin ?? "",
        state: state ?? "",
        lga: lga ?? "",
        address: address ?? "",
        memberSince: agentData.createdAt,
        avatarUrl: agentData.avatarUrl ?? undefined,
        emailVerified: Boolean(emailVerified), // Ensure boolean type
        createdAt: agentData.createdAt
    };
}