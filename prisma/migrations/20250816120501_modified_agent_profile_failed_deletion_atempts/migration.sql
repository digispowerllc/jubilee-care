/*
  Warnings:

  - The `failedDeletionAttempts` column on the `agent_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."agent_profile" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "failedDeletionAttempts",
ADD COLUMN     "failedDeletionAttempts" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');
