/*
  Warnings:

  - You are about to drop the `lockout` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- DropTable
DROP TABLE "public"."lockout";

-- CreateTable
CREATE TABLE "public"."account_locks" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "action" TEXT,

    CONSTRAINT "account_locks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_locks_agentId_key" ON "public"."account_locks"("agentId");

-- CreateIndex
CREATE INDEX "account_locks_agentId_idx" ON "public"."account_locks"("agentId");

-- CreateIndex
CREATE INDEX "account_locks_expiresAt_idx" ON "public"."account_locks"("expiresAt");

-- CreateIndex
CREATE INDEX "account_locks_action_idx" ON "public"."account_locks"("action");

-- AddForeignKey
ALTER TABLE "public"."account_locks" ADD CONSTRAINT "account_locks_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
