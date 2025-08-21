// File: src/app/api/maintenance/session-cleanup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

const MAX_LIFETIME_HOURS = Number(
  process.env.SESSION_MAX_LIFETIME_HOURS ?? "24"
);
const ABSOLUTE_MAX_LIFETIME_MS = MAX_LIFETIME_HOURS * 60 * 60 * 1000;
const DELETE_CAP = Number(process.env.SESSION_DELETE_CAP ?? "5000");

export async function POST() {
  // Find candidates (capped to DELETE_CAP)
  const expired = await prisma.agentSession.findMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { createdAt: { lt: new Date(Date.now() - ABSOLUTE_MAX_LIFETIME_MS) } },
      ],
    },
    select: { id: true },
    take: DELETE_CAP, // safety cap
  });

  let removed = 0;

  if (expired.length > 0) {
    const result = await prisma.agentSession.deleteMany({
      where: {
        id: { in: expired.map((s) => s.id) },
      },
    });
    removed = result.count;
  }

  // 🔒 Audit log
  await prisma.sessionCleanupLog.create({
    data: {
      removed,
    },
  });

  return NextResponse.json({
    success: true,
    removed,
    capped: expired.length === DELETE_CAP,
    timestamp: new Date().toISOString(),
  });
}

// {
//   "crons": [
//     {
//       "path": "/api/maintenance/session-cleanup",
//       "schedule": "0 * * * *" // run every hour
//     }
//   ]
// }
