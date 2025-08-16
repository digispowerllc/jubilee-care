-- AlterTable
ALTER TABLE "public"."agent_profile" ADD COLUMN     "failedDeletionAttempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- CreateTable
CREATE TABLE "public"."failed_attempts" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "failed_attempts_agentId_idx" ON "public"."failed_attempts"("agentId");

-- CreateIndex
CREATE INDEX "failed_attempts_action_idx" ON "public"."failed_attempts"("action");

-- CreateIndex
CREATE INDEX "failed_attempts_createdAt_idx" ON "public"."failed_attempts"("createdAt");

-- CreateIndex
CREATE INDEX "failed_attempts_ipAddress_idx" ON "public"."failed_attempts"("ipAddress");

-- AddForeignKey
ALTER TABLE "public"."failed_attempts" ADD CONSTRAINT "failed_attempts_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
