/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `signatureUrl` on the `AgentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `csrfToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Agent_isActive_idx";

-- DropIndex
DROP INDEX "public"."Agent_isDeleted_idx";

-- DropIndex
DROP INDEX "public"."Session_csrfToken_key";

-- DropIndex
DROP INDEX "public"."User_profilePicture_idx";

-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "public"."AgentProfile" DROP COLUMN "signatureUrl";

-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "csrfToken";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "profilePicture";
