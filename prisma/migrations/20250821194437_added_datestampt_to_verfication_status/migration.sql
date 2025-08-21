-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- AlterTable
ALTER TABLE "public"."verification_status" ADD COLUMN     "bvnVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "dobVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "documentVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "emailVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "genderVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "ninVerifiedDate" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "verification_status_emailVerifiedDate_idx" ON "public"."verification_status"("emailVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_phoneVerifiedDate_idx" ON "public"."verification_status"("phoneVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_ninVerifiedDate_idx" ON "public"."verification_status"("ninVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_bvnVerifiedDate_idx" ON "public"."verification_status"("bvnVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_dobVerifiedDate_idx" ON "public"."verification_status"("dobVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_genderVerifiedDate_idx" ON "public"."verification_status"("genderVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_documentVerifiedDate_idx" ON "public"."verification_status"("documentVerifiedDate");
