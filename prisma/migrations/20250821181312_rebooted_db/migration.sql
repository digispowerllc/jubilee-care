-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');
