// src/app/api/your-endpoint/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateAccessCode, generateUserId } from "@/app/lib/generators";
import { AgentSchema } from "@/app/lib/agentValidation/agentSchema";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    // ✅ Zod validation
    const result = AgentSchema.safeParse(json);

    if (!result.success) {
      const errorMessage = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json(
        { success: false, error: `Validation failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    const data = result.data;

    const accessCode = generateAccessCode();
    const agentId = await generateUserId();

    const agent = await prisma.agent.create({
      data: {
        surname: data.surname.trim(),
        firstName: data.firstName.trim(),
        otherName: data.otherName?.trim() ?? null,
        email: data.email.trim(),
        phone: data.phone.trim(),
        nin: data.nin.trim(),
        state: data.state.trim(),
        lga: data.lga.trim(),
        address: data.address.trim(),
      },
    });

    const profile = await prisma.agentProfile.create({
      data: {
        id: agent.id,
        agentId: agentId,
        accessCode: accessCode,
        passportUrl: null,
      },
    });

    return NextResponse.json({ success: true, agent, profile }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST to create a user." },
    { status: 405 }
  );
}
