-- CreateTable
CREATE TABLE "public"."AgentSession" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AgentSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentSession_token_key" ON "public"."AgentSession"("token");

-- CreateIndex
CREATE INDEX "AgentSession_agentId_idx" ON "public"."AgentSession"("agentId");

-- CreateIndex
CREATE INDEX "AgentSession_token_idx" ON "public"."AgentSession"("token");

-- CreateIndex
CREATE INDEX "AgentSession_expiresAt_idx" ON "public"."AgentSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."AgentSession" ADD CONSTRAINT "AgentSession_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
