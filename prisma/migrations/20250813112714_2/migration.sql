-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAdmitted" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentProfile" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL DEFAULT '',
    "accessCodeHash" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT NOT NULL,
    "passportUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "passwordResetAttempts" INTEGER,
    "accountLockedUntil" TIMESTAMP(3),
    "lastPasswordResetAt" TIMESTAMP(3),

    CONSTRAINT "AgentProfile_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "agentProfileId" TEXT,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetEvent" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,

    CONSTRAINT "PasswordResetEvent_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agent',

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OAuthAccount" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_nin_key" ON "public"."Agent"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_emailHash_key" ON "public"."Agent"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_phoneHash_key" ON "public"."Agent"("phoneHash");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_ninHash_key" ON "public"."Agent"("ninHash");

-- CreateIndex
CREATE INDEX "Agent_emailHash_idx" ON "public"."Agent"("emailHash");

-- CreateIndex
CREATE INDEX "Agent_phoneHash_idx" ON "public"."Agent"("phoneHash");

-- CreateIndex
CREATE INDEX "Agent_ninHash_idx" ON "public"."Agent"("ninHash");

-- CreateIndex
CREATE INDEX "Agent_state_idx" ON "public"."Agent"("state");

-- CreateIndex
CREATE INDEX "Agent_lga_idx" ON "public"."Agent"("lga");

-- CreateIndex
CREATE INDEX "Agent_createdAt_idx" ON "public"."Agent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_agentId_key" ON "public"."AgentProfile"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_emailHash_key" ON "public"."AgentProfile"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_phoneHash_key" ON "public"."AgentProfile"("phoneHash");

-- CreateIndex
CREATE INDEX "AgentProfile_agentId_idx" ON "public"."AgentProfile"("agentId");

-- CreateIndex
CREATE INDEX "AgentProfile_phoneHash_idx" ON "public"."AgentProfile"("phoneHash");

-- CreateIndex
CREATE INDEX "AgentProfile_emailHash_idx" ON "public"."AgentProfile"("emailHash");

-- CreateIndex
CREATE INDEX "AgentProfile_accessCodeHash_idx" ON "public"."AgentProfile"("accessCodeHash");

-- CreateIndex
CREATE INDEX "AgentProfile_createdAt_idx" ON "public"."AgentProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentSession_token_key" ON "public"."AgentSession"("token");

-- CreateIndex
CREATE INDEX "AgentSession_agentId_idx" ON "public"."AgentSession"("agentId");

-- CreateIndex
CREATE INDEX "AgentSession_expiresAt_idx" ON "public"."AgentSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_agentId_idx" ON "public"."PasswordResetToken"("agentId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "public"."PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "PasswordResetEvent_agentId_createdAt_idx" ON "public"."PasswordResetEvent"("agentId", "createdAt");

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
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "public"."Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_provider_providerId_key" ON "public"."OAuthAccount"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "public"."AgentProfile" ADD CONSTRAINT "AgentProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentSession" ADD CONSTRAINT "AgentSession_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_agentProfileId_fkey" FOREIGN KEY ("agentProfileId") REFERENCES "public"."AgentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetEvent" ADD CONSTRAINT "PasswordResetEvent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OAuthAccount" ADD CONSTRAINT "OAuthAccount_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
