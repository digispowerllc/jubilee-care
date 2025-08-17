-- AlterTable
ALTER TABLE "public"."agent" ADD COLUMN     "gender" INTEGER;

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');
