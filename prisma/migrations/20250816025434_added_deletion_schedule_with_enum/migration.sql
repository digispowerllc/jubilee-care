-- CreateEnum
CREATE TYPE "public"."AgentStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'PENDING_DELETION', 'DELETED');

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

-- CreateIndex
CREATE INDEX "DeletionSchedule_agentId_idx" ON "public"."DeletionSchedule"("agentId");

-- CreateIndex
CREATE INDEX "DeletionSchedule_scheduledAt_idx" ON "public"."DeletionSchedule"("scheduledAt");

-- AddForeignKey
ALTER TABLE "public"."DeletionSchedule" ADD CONSTRAINT "DeletionSchedule_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
