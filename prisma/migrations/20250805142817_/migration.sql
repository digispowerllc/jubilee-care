/*
  Warnings:

  - You are about to drop the column `agentId` on the `AgentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AgentProfile` table. All the data in the column will be lost.
  - Added the required column `agentid` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentid` to the `AgentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `AgentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AgentProfile" DROP CONSTRAINT "AgentProfile_agentId_fkey";

-- DropIndex
DROP INDEX "public"."AgentProfile_agentId_idx";

-- DropIndex
DROP INDEX "public"."AgentProfile_userId_idx";

-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "agentid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "agentId",
DROP COLUMN "userId",
ADD COLUMN     "agentid" TEXT NOT NULL,
ADD COLUMN     "userid" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Agent_agentid_idx" ON "public"."Agent"("agentid");

-- CreateIndex
CREATE INDEX "AgentProfile_agentid_idx" ON "public"."AgentProfile"("agentid");

-- CreateIndex
CREATE INDEX "AgentProfile_userid_idx" ON "public"."AgentProfile"("userid");

-- AddForeignKey
ALTER TABLE "public"."AgentProfile" ADD CONSTRAINT "AgentProfile_agentid_fkey" FOREIGN KEY ("agentid") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
