/*
  Warnings:

  - The `role` column on the `user_role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserRoleEnum" AS ENUM ('ADMIN', 'AGENT', 'USER');

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_role" DROP CONSTRAINT "user_role_id_fkey";

-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + interval '7 years');

-- AlterTable
ALTER TABLE "public"."user_role" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'AGENT';

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "hasPin" BOOLEAN NOT NULL DEFAULT false,
    "pinHash" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "passwordChangedAt" TIMESTAMP(3),
    "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_cleanup_log" (
    "id" TEXT NOT NULL,
    "removed" INTEGER NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_cleanup_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_cleanup_config" (
    "id" TEXT NOT NULL,
    "cleanupProbability" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "maxLifetimeHours" INTEGER NOT NULL DEFAULT 48,
    "lastRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_cleanup_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "public"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "public"."user"("username");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_phoneNumber_idx" ON "public"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "public"."user"("createdAt");

-- CreateIndex
CREATE INDEX "user_updatedAt_idx" ON "public"."user"("updatedAt");

-- CreateIndex
CREATE INDEX "user_country_idx" ON "public"."user"("country");

-- CreateIndex
CREATE INDEX "user_state_idx" ON "public"."user"("state");

-- CreateIndex
CREATE INDEX "user_city_idx" ON "public"."user"("city");

-- CreateIndex
CREATE INDEX "user_address_idx" ON "public"."user"("address");

-- CreateIndex
CREATE INDEX "user_bio_idx" ON "public"."user"("bio");

-- CreateIndex
CREATE INDEX "user_phoneVerified_idx" ON "public"."user"("phoneVerified");

-- CreateIndex
CREATE INDEX "user_hasPin_idx" ON "public"."user"("hasPin");

-- CreateIndex
CREATE INDEX "user_isBanned_idx" ON "public"."user"("isBanned");

-- CreateIndex
CREATE INDEX "user_passwordChangedAt_idx" ON "public"."user"("passwordChangedAt");

-- AddForeignKey
ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
