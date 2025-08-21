// File: src/app/api/maintenance/session-cleanup/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
  const logs = await prisma.sessionCleanupLog.findMany({
    orderBy: { runAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ logs });
}
