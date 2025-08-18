-- AlterTable
ALTER TABLE "public"."agent" ADD COLUMN     "bvnVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dobVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "documentVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "genderVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ninVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- CreateIndex
CREATE INDEX "agent_phoneVerified_idx" ON "public"."agent"("phoneVerified");

-- CreateIndex
CREATE INDEX "agent_ninVerified_idx" ON "public"."agent"("ninVerified");

-- CreateIndex
CREATE INDEX "agent_bvnVerified_idx" ON "public"."agent"("bvnVerified");

-- CreateIndex
CREATE INDEX "agent_dobVerified_idx" ON "public"."agent"("dobVerified");

-- CreateIndex
CREATE INDEX "agent_genderVerified_idx" ON "public"."agent"("genderVerified");

-- CreateIndex
CREATE INDEX "agent_documentVerified_idx" ON "public"."agent"("documentVerified");
