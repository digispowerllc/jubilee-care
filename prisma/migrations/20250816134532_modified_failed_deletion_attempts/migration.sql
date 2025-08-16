-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- AlterTable
ALTER TABLE "public"."failed_deletion_attempts" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;
