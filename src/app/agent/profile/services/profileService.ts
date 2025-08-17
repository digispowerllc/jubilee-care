// File: src/app/agent/profile/services/profileService.ts
import { prisma } from "@/lib/prisma";
import { unprotectData } from "@/lib/security/dataProtection";
import { AgentProfileData } from "../types";

/**
 * Fetch raw agent data from DB and decrypt fields in one go
 */
export async function prepareProfileData(agentId: string): Promise<AgentProfileData | null> {
    if (!agentId) throw new Error("Agent ID is required");

    // Fetch agent with all needed fields
    const agentData = await prisma.agent.findUnique({
        where: { id: agentId },
        select: {
            id: true,
            fieldId: true, // <-- Added fieldId
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
        }
    });

    if (!agentData) return null;

    // Decrypt all fields in parallel
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
        address
    ] = await Promise.all([
        agentData.surname ? unprotectData(agentData.surname, "name") : null,
        agentData.firstName ? unprotectData(agentData.firstName, "name") : null,
        agentData.otherName ? unprotectData(agentData.otherName, "name") : null,
        agentData.dob ? unprotectData(agentData.dob.toISOString(), "date") : null,
        agentData.gender ? unprotectData(agentData.gender, "gender") : null,
        agentData.email ? unprotectData(agentData.email, "email") : null,
        agentData.phone ? unprotectData(agentData.phone, "phone") : null,
        agentData.nin ? unprotectData(agentData.nin, "government") : null,
        agentData.state ? unprotectData(agentData.state, "location") : null,
        agentData.lga ? unprotectData(agentData.lga, "location") : null,
        agentData.address ? unprotectData(agentData.address, "location") : null,
    ]);

    let emailVerified: boolean;

    if (typeof agentData.profile?.emailVerified === "boolean") {
        // Explicitly true or false
        emailVerified = agentData.profile.emailVerified;
    } else if (agentData.profile?.emailVerified instanceof Date) {
        // Date value means verified
        emailVerified = true;
    } else {
        // null, undefined, or any other unexpected value
        emailVerified = false;
    }


    return {
        agentId: agentData.id,           // for internal logic
        fieldId: agentData.fieldId,      // to display as "Agent ID"
        surname: surname ?? "",
        firstName: firstName ?? "",
        otherName: otherName ?? null,
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
        emailVerified,
        createdAt: agentData.createdAt
    };
}

/**
 * Utility: initials from name
 */
export function getInitials(surname: string | null, firstName: string | null) {
    return `${surname?.charAt(0) ?? ""}${firstName?.charAt(0) ?? ""}`.toUpperCase();
}

/**
 * Utility: full name
 */
export function getFullName(surname: string, firstName: string, otherName?: string | null) {
    return `${surname} ${firstName}${otherName ? ` ${otherName}` : ""}`;
}
