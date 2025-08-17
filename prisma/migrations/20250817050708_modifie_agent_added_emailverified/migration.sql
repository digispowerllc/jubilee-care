-- AlterTable
ALTER TABLE "public"."agent" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');
