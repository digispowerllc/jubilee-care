-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "deletionReason" TEXT;

-- AlterTable
ALTER TABLE "public"."AuditLog" ADD COLUMN     "metadata" JSONB;
