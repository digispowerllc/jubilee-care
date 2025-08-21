// File: src/app/agent/profile/services/profileService.ts
import { prisma } from "@/lib/utils/prisma";
import { unprotectData } from "@/lib/security/dataProtection";
import type {
  AgentFullDataExtended,
  AgentData,
  SessionSummary,
  AccountLockSummary,
  AuditLogSummary,
  FailedAttemptSummary,
  DeletionScheduleSummary,
  AgentStatus,
} from "../types";

import type {
  AgentSession,
  AccountLock,
  AuditLog,
  FailedAttempt,
  FailedDeletionAttempt,
  DeletionSchedule,
  VerificationStatus,
} from "@prisma/client";

/**
 * Fetch and prepare a single agent's full profile with decrypted fields
 */
export async function getAgentFullData(
  agentId: string
): Promise<AgentFullDataExtended | null> {
  if (!agentId?.trim()) throw new Error("Valid agent ID is required");

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      profile: true,
      VerificationStatus: { orderBy: { createdAt: "desc" }, take: 1 },
      sessions: true,
      AccountLock: true,
      AuditLog: true,
      FailedAttempt: true,
      FailedDeletionAttempt: true,
      DeletionSchedule: true,
    },
  });

  if (!agent) return null;

  const decryptedProfile = await decryptAgentFields(agent);

  const latestVerification = agent.VerificationStatus?.[0];

  const profile: AgentData = {
    agentId: agent.id,
    fieldId: agent.fieldId,
    surname: decryptedProfile.surname,
    firstName: decryptedProfile.firstName,
    otherName: decryptedProfile.otherName,
    gender: decryptedProfile.gender,
    dob: decryptedProfile.dob
      ? new Date(decryptedProfile.dob)
      : (agent.dob ?? null),
    email: decryptedProfile.email,
    phone: decryptedProfile.phone,
    nameVerified: latestVerification.nameVerified,
    nameVerificationDate: latestVerification.nameVerificationDate ?? null,
    genderVerifiedDate: latestVerification.genderVerifiedDate ?? null,
    dobVerifiedDate: latestVerification.dobVerifiedDate ?? null,
    emailVerified: !!latestVerification?.emailVerified,
    emailVerifiedDate: latestVerification?.emailVerifiedDate ?? null,
    phoneVerified: !!latestVerification?.phoneVerified,
    phoneVerifiedDate: latestVerification?.phoneVerifiedDate ?? null,
    nin: decryptedProfile.nin,
    bvn: decryptedProfile.bvn ?? undefined,
    ninVerified: !!latestVerification?.ninVerified,
    ninVerifiedDate: latestVerification?.ninVerifiedDate ?? null,
    bvnVerified: !!latestVerification?.bvnVerified,
    bvnVerifiedDate: latestVerification?.bvnVerifiedDate ?? null,
    documentVerified: !!latestVerification?.documentVerified,
    documentVerifiedDate: latestVerification?.documentVerifiedDate ?? null,
    state: decryptedProfile.state,
    lga: decryptedProfile.lga,
    address: decryptedProfile.address,
    dobVerified: !!latestVerification?.dobVerified,
    genderVerified: !!latestVerification?.genderVerified,
    memberSince: agent.createdAt,
    avatarUrl: agent.avatarUrl ?? undefined,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
    lastLoginAt: agent.lastLoginAt ?? undefined,
    isActive: agent.isActive,
    status: deriveStatus(agent.isActive, {
      emailVerified: latestVerification?.emailVerified,
      documentVerified: latestVerification?.documentVerified,
    }),
    admittedAt: agent.admittedAt ?? undefined,
  };

  const security = {
    sessions: mapSessions(agent.sessions),
    accountLocks: agent.AccountLock ? mapAccountLocks([agent.AccountLock]) : [],
    auditLogs: mapAuditLogs(agent.AuditLog),
    failedAttempts: mapFailedAttempts([...agent.FailedAttempt]),
    failedDeletionAttempts: mapFailedDeletionAttempts([
      ...agent.FailedDeletionAttempt,
    ]),
    deletionSchedules: mapDeletionSchedules(agent.DeletionSchedule),
  };

  return { profile, security, other: { notes: "" } };
}

/**
 * Decrypt agent fields
 */
async function decryptAgentFields(
  agent: import("@prisma/client").Agent & { profile: unknown }
) {
  const [
    surname,
    firstName,
    otherName,
    dob,
    gender,
    email,
    phone,
    nin,
    bvn,
    state,
    lga,
    address,
  ] = await Promise.all([
    decrypt(agent.surname, "name"),
    decrypt(agent.firstName, "name"),
    decrypt(agent.otherName, "name"),
    agent.dob ? decrypt(agent.dob.toISOString(), "date") : null,
    decrypt(agent.gender, "gender"),
    decrypt(agent.email, "email"),
    decrypt(agent.phone, "phone"),
    decrypt(agent.nin, "government"),
    decrypt(agent.bvn, "government"),
    decrypt(agent.state, "location"),
    decrypt(agent.lga, "location"),
    decrypt(agent.address, "location"),
  ]);

  return {
    surname,
    firstName,
    otherName,
    dob,
    gender,
    email,
    phone,
    nin,
    bvn,
    state,
    lga,
    address,
  };
}

function decrypt(
  value: string | null,
  type: Parameters<typeof unprotectData>[1]
): Promise<string | null> {
  return value ? unprotectData(value, type) : Promise.resolve(null);
}

/**
 * Mapping helpers
 */
function mapSessions(sessions: AgentSession[]): SessionSummary[] {
  return sessions.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress ?? undefined,
    userAgent: s.userAgent ?? undefined,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    revokedAt: s.revokedAt ?? undefined,
  }));
}

function mapAccountLocks(locks: AccountLock[]): AccountLockSummary[] {
  return locks.map((l) => ({
    id: l.id,
    reason: l.reason ?? "",
    createdAt: l.createdAt,
    expiresAt: l.expiresAt,
    action: l.action ?? undefined,
    ipAddress: l.ipAddress ?? undefined,
  }));
}

function mapAuditLogs(logs: AuditLog[]): AuditLogSummary[] {
  return logs.map((l) => ({
    id: l.id,
    action: l.action as AuditLogSummary["action"],
    ipAddress: l.ipAddress,
    userAgent: l.userAgent ?? "",
    status: l.status as AuditLogSummary["status"],
    severity: l.severity as AuditLogSummary["severity"],
    createdAt: l.createdAt,
    details: l.details ?? undefined,
    targetId: l.targetId ?? undefined,
    targetType: l.targetType ?? undefined,
  }));
}

// For regular failed login / pin attempts
function mapFailedAttempts(failed: FailedAttempt[]): FailedAttemptSummary[] {
  return failed.map((f) => ({
    id: f.id,
    agentId: f.agentId,
    action: (["LOGIN", "PIN_VERIFICATION"].includes(f.action ?? "")
      ? f.action
      : "LOGIN") as "LOGIN" | "PIN_VERIFICATION",
    ipAddress: f.ipAddress,
    userAgent: f.userAgent ?? undefined,
    details: f.details ?? undefined,
    createdAt: f.createdAt,
    attempts: f.attempts, // doesn’t exist on FailedAttempt
  }));
}

// For failed account deletion attempts
function mapFailedDeletionAttempts(
  failed: FailedDeletionAttempt[]
): FailedAttemptSummary[] {
  return failed.map((f) => ({
    id: f.id,
    agentId: f.agentId,
    action: "ACCOUNT_DELETION" as const,
    ipAddress: f.ipAddress,
    userAgent: f.userAgent ?? undefined,
    details: f.details ?? undefined,
    createdAt: f.createdAt,
    attempts: f.attempts ?? undefined, // exists here
  }));
}

function mapDeletionSchedules(
  schedules: DeletionSchedule[]
): DeletionScheduleSummary[] {
  return schedules.map((d) => ({
    id: d.id,
    agentId: d.agentId,
    deletionType: (d.deletionType === "FULL_ACCOUNT" ||
    d.deletionType === "DATA_ONLY"
      ? d.deletionType
      : "FULL_ACCOUNT") as "FULL_ACCOUNT" | "DATA_ONLY",
    scheduledAt: d.scheduledAt,
    completedAt: d.completedAt ?? undefined,
    createdAt: d.createdAt,
  }));
}

/**
 * Derive AgentStatus
 */
function deriveStatus(
  isActive: boolean,
  verification?: { emailVerified?: boolean; documentVerified?: boolean }
): AgentStatus {
  if (!isActive) return "DEACTIVATED";
  if (!verification?.emailVerified || !verification?.documentVerified)
    return "PENDING_DELETION";
  return "ACTIVE";
}
