-- AlterTable
ALTER TABLE "public"."agent" ADD COLUMN     "dob" TIMESTAMP(3),
ALTER COLUMN "gender" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');
