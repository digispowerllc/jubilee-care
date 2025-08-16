-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('ACCOUNT_DELETION_REQUEST', 'ACCOUNT_DEACTIVATION', 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'PASSWORD_CHANGE', 'PASSWORD_RESET', 'DATA_EXPORT', 'DATA_DELETION', 'PERMISSION_CHANGE', 'SYSTEM_EVENT');

-- CreateEnum
CREATE TYPE "public"."AuditStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING', 'REVERTED');

-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."AgentStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'PENDING_DELETION', 'DELETED');

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT NOT NULL DEFAULT 'unknown',
    "userAgent" TEXT NOT NULL DEFAULT 'unknown',
    "status" "public"."AuditStatus" NOT NULL DEFAULT 'SUCCESS',
    "severity" "public"."Severity" NOT NULL DEFAULT 'MEDIUM',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) DEFAULT (NOW() + interval '7 years'),
    "agentId" TEXT,
    "targetId" TEXT,
    "targetType" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agent" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "ninHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginAttemptIp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT '',
    "admittedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletionReason" TEXT,
    "deactivatedAt" TIMESTAMP(3),
    "deactivationReason" TEXT,
    "avatarUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agent_profile" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "pin" TEXT NOT NULL DEFAULT '',
    "pinHash" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordResetAttempts" INTEGER,
    "accountLockedUntil" TIMESTAMP(3),
    "lockoutCount" INTEGER NOT NULL DEFAULT 0,
    "lastPasswordResetAt" TIMESTAMP(3),
    "avatarUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "agent_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AgentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeletionSchedule" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "deletionType" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lockout" (
    "id" TEXT NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lockout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "agentProfileId" TEXT,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_event" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,

    CONSTRAINT "password_reset_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" INTEGER NOT NULL DEFAULT 0,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "hasPin" BOOLEAN NOT NULL DEFAULT false,
    "pinHash" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "passwordChangedAt" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_role" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agent',

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."oauth_account" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_agentId_idx" ON "public"."audit_logs"("agentId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_severity_idx" ON "public"."audit_logs"("severity");

-- CreateIndex
CREATE INDEX "audit_logs_status_idx" ON "public"."audit_logs"("status");

-- CreateIndex
CREATE INDEX "audit_logs_targetId_targetType_idx" ON "public"."audit_logs"("targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "agent_nin_key" ON "public"."agent"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "agent_emailHash_key" ON "public"."agent"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_phoneHash_key" ON "public"."agent"("phoneHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_ninHash_key" ON "public"."agent"("ninHash");

-- CreateIndex
CREATE INDEX "agent_emailHash_idx" ON "public"."agent"("emailHash");

-- CreateIndex
CREATE INDEX "agent_phoneHash_idx" ON "public"."agent"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_ninHash_idx" ON "public"."agent"("ninHash");

-- CreateIndex
CREATE INDEX "agent_state_idx" ON "public"."agent"("state");

-- CreateIndex
CREATE INDEX "agent_lga_idx" ON "public"."agent"("lga");

-- CreateIndex
CREATE INDEX "agent_createdAt_idx" ON "public"."agent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_agentId_key" ON "public"."agent_profile"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_emailHash_key" ON "public"."agent_profile"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_phoneHash_key" ON "public"."agent_profile"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_profile_agentId_idx" ON "public"."agent_profile"("agentId");

-- CreateIndex
CREATE INDEX "agent_profile_phoneHash_idx" ON "public"."agent_profile"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_profile_emailHash_idx" ON "public"."agent_profile"("emailHash");

-- CreateIndex
CREATE INDEX "agent_profile_pinHash_idx" ON "public"."agent_profile"("pinHash");

-- CreateIndex
CREATE INDEX "agent_profile_createdAt_idx" ON "public"."agent_profile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentSession_token_key" ON "public"."AgentSession"("token");

-- CreateIndex
CREATE INDEX "AgentSession_agentId_idx" ON "public"."AgentSession"("agentId");

-- CreateIndex
CREATE INDEX "AgentSession_expiresAt_idx" ON "public"."AgentSession"("expiresAt");

-- CreateIndex
CREATE INDEX "DeletionSchedule_agentId_idx" ON "public"."DeletionSchedule"("agentId");

-- CreateIndex
CREATE INDEX "DeletionSchedule_scheduledAt_idx" ON "public"."DeletionSchedule"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_tokenHash_key" ON "public"."password_reset_token"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_token_agentId_idx" ON "public"."password_reset_token"("agentId");

-- CreateIndex
CREATE INDEX "password_reset_token_expiresAt_idx" ON "public"."password_reset_token"("expiresAt");

-- CreateIndex
CREATE INDEX "password_reset_event_agentId_createdAt_idx" ON "public"."password_reset_event"("agentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- CreateIndex
CREATE INDEX "User_updatedAt_idx" ON "public"."User"("updatedAt");

-- CreateIndex
CREATE INDEX "User_country_idx" ON "public"."User"("country");

-- CreateIndex
CREATE INDEX "User_state_idx" ON "public"."User"("state");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "public"."User"("city");

-- CreateIndex
CREATE INDEX "User_address_idx" ON "public"."User"("address");

-- CreateIndex
CREATE INDEX "User_bio_idx" ON "public"."User"("bio");

-- CreateIndex
CREATE INDEX "User_phoneVerified_idx" ON "public"."User"("phoneVerified");

-- CreateIndex
CREATE INDEX "User_hasPin_idx" ON "public"."User"("hasPin");

-- CreateIndex
CREATE INDEX "User_isBanned_idx" ON "public"."User"("isBanned");

-- CreateIndex
CREATE INDEX "User_passwordChangedAt_idx" ON "public"."User"("passwordChangedAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "public"."session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_account_provider_providerId_key" ON "public"."oauth_account"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agent_profile" ADD CONSTRAINT "agent_profile_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentSession" ADD CONSTRAINT "AgentSession_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeletionSchedule" ADD CONSTRAINT "DeletionSchedule_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_token" ADD CONSTRAINT "password_reset_token_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_token" ADD CONSTRAINT "password_reset_token_agentProfileId_fkey" FOREIGN KEY ("agentProfileId") REFERENCES "public"."agent_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_event" ADD CONSTRAINT "password_reset_event_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."oauth_account" ADD CONSTRAINT "oauth_account_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
