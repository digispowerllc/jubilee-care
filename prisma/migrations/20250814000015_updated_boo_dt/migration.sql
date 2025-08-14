/*
  Warnings:

  - The `emailVerified` column on the `AgentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);
