-- AlterTable
ALTER TABLE "public"."AgentProfile" ADD COLUMN     "lockoutCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Lockout" (
    "id" TEXT NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lockout_pkey" PRIMARY KEY ("id")
);
