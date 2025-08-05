-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAdmitted" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentProfile" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "passportUrl" TEXT,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgentProfile_pkey" PRIMARY KEY ("id")
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
    "profilePicture" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL,
    "phoneVerified" INTEGER NOT NULL DEFAULT 0,
    "hasPin" INTEGER NOT NULL DEFAULT 0,
    "pinHash" TEXT,
    "banned" INTEGER NOT NULL DEFAULT 0,
    "passwordChangedAt" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "csrfToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_nin_key" ON "public"."Agent"("nin");

-- CreateIndex
CREATE INDEX "Agent_email_idx" ON "public"."Agent"("email");

-- CreateIndex
CREATE INDEX "Agent_phone_idx" ON "public"."Agent"("phone");

-- CreateIndex
CREATE INDEX "Agent_state_idx" ON "public"."Agent"("state");

-- CreateIndex
CREATE INDEX "Agent_lga_idx" ON "public"."Agent"("lga");

-- CreateIndex
CREATE INDEX "Agent_isActive_idx" ON "public"."Agent"("isActive");

-- CreateIndex
CREATE INDEX "Agent_isDeleted_idx" ON "public"."Agent"("isDeleted");

-- CreateIndex
CREATE INDEX "AgentProfile_agentId_idx" ON "public"."AgentProfile"("agentId");

-- CreateIndex
CREATE INDEX "AgentProfile_userId_idx" ON "public"."AgentProfile"("userId");

-- CreateIndex
CREATE INDEX "AgentProfile_accessCode_idx" ON "public"."AgentProfile"("accessCode");

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
CREATE INDEX "User_profilePicture_idx" ON "public"."User"("profilePicture");

-- CreateIndex
CREATE INDEX "User_bio_idx" ON "public"."User"("bio");

-- CreateIndex
CREATE INDEX "User_phoneVerified_idx" ON "public"."User"("phoneVerified");

-- CreateIndex
CREATE INDEX "User_hasPin_idx" ON "public"."User"("hasPin");

-- CreateIndex
CREATE INDEX "User_banned_idx" ON "public"."User"("banned");

-- CreateIndex
CREATE INDEX "User_passwordChangedAt_idx" ON "public"."User"("passwordChangedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_csrfToken_key" ON "public"."Session"("csrfToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "public"."Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "public"."Session"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."AgentProfile" ADD CONSTRAINT "AgentProfile_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
