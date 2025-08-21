// src/lib/auth/pin-utils.ts
import { prisma } from "@/lib/utils/prisma";
import {
  verifyHash,
  protectData,
  unprotectData,
  generateSearchableHash,
} from "@/lib/security/dataProtection";

export async function verifyAgentPin(
  agentId: string,
  pin: string
): Promise<boolean> {
  // Get the protected PIN from database
  const profile = await prisma.agentProfile.findUnique({
    where: { agentId },
    select: { pinHash: true, pin: true },
  });

  if (!profile) {
    throw new Error("Agent profile not found");
  }

  // For new system with encrypted PIN
  if (profile.pin) {
    const unprotectedPin = await unprotectData(profile.pin, "system-code");
    return unprotectedPin === pin;
  }

  // Fallback to old hash system (if migrating)
  if (profile.pinHash) {
    return verifyHash(pin, profile.pinHash);
  }

  throw new Error("No PIN set for this account");
}

export async function setAgentPin(agentId: string, pin: string): Promise<void> {
  // Protect the PIN using your data protection system
  const protectedPin = await protectData(pin, "system-code");
  const pinHash = await generateSearchableHash(pin);

  await prisma.agentProfile.update({
    where: { agentId },
    data: {
      pin: protectedPin.encrypted,
      pinHash,
      updatedAt: new Date(),
    },
  });
}
