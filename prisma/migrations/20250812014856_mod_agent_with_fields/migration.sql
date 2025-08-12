/*
  Warnings:

  - A unique constraint covering the columns `[ninHash]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `otherName` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Agent" ALTER COLUMN "otherName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_ninHash_key" ON "public"."Agent"("ninHash");
