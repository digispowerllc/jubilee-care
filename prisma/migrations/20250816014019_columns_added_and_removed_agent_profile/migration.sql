/*
  Warnings:

  - You are about to drop the column `isAdmitted` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "isAdmitted",
DROP COLUMN "isDeleted",
ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ALTER COLUMN "deactivationReason" DROP NOT NULL,
ALTER COLUMN "deactivationReason" DROP DEFAULT;
