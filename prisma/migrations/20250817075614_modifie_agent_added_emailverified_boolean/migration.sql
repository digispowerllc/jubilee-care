/*
  Warnings:

  - The `emailVerified` column on the `agent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."agent" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- CreateIndex
CREATE INDEX "agent_emailVerified_idx" ON "public"."agent"("emailVerified");
