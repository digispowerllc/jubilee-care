-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- AlterTable
ALTER TABLE "public"."verification_status" ADD COLUMN     "nameVerificationDate" TIMESTAMP(3),
ADD COLUMN     "nameVerified" BOOLEAN NOT NULL DEFAULT false;
