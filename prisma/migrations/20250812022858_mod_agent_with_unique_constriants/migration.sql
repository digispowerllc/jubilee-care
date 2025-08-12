/*
  Warnings:

  - A unique constraint covering the columns `[emailHash]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneHash]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailHash]` on the table `AgentProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneHash]` on the table `AgentProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Agent_emailHash_key" ON "public"."Agent"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_phoneHash_key" ON "public"."Agent"("phoneHash");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_emailHash_key" ON "public"."AgentProfile"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_phoneHash_key" ON "public"."AgentProfile"("phoneHash");
