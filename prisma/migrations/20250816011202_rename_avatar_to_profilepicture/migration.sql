/*
  Warnings:

  - You are about to drop the column `pinHash` on the `AgentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pinHash` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AgentProfile_pinHash_idx";

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "pinHash",
DROP COLUMN "pinHash",
ADD COLUMN     "pin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pinHash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "AgentProfile_pinHash_idx" ON "public"."AgentProfile"("pinHash");
