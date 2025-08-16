/*
  Warnings:

  - You are about to drop the column `accessCode` on the `AgentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `accessCodeHash` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AgentProfile_accessCodeHash_idx";

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "accessCode",
DROP COLUMN "accessCodeHash",
ADD COLUMN     "pin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pinHash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "AgentProfile_pinHash_idx" ON "public"."AgentProfile"("pinHash");
