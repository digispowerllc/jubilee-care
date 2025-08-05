/*
  Warnings:

  - You are about to drop the column `agentid` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `agentid` on the `AgentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AgentProfile" DROP CONSTRAINT "AgentProfile_agentid_fkey";

-- DropIndex
DROP INDEX "public"."Agent_agentid_idx";

-- DropIndex
DROP INDEX "public"."AgentProfile_agentid_idx";

-- DropIndex
DROP INDEX "public"."AgentProfile_userid_idx";

-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "agentid";

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "agentid",
DROP COLUMN "userid";

-- AddForeignKey
ALTER TABLE "public"."AgentProfile" ADD CONSTRAINT "AgentProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
