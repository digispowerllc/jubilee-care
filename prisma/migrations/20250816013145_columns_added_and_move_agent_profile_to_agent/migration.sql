/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "admittedAt" TIMESTAMP(3),
ADD COLUMN     "deactivationReason" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "deletedAt";
