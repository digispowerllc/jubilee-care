// src/app/api/your-endpoint/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { generateUserId, generateAccessCode, generatePatternedId } from "@/app/lib/generators";

export async function POST(req: Request) {
  // console.log(`[${new Date().toISOString()}] Incoming POST request to /api/your-endpoint`)
  try {
    const body = await req.json()

    // console.log("Request body:", body)

    // Validate required fields (optional but recommended)
    const requiredFields = ["surname", "firstName", "email", "phone", "nin", "state", "lga", "address"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    const userId = generateUserId();
    const accessCode = generateAccessCode();
    const agentId = await generatePatternedId();

    const agent = await prisma.agent.create({
      data: {
        surname: body.surname.trim(),
        firstName: body.firstName.trim(),
        otherName: body.lastName?.trim() ?? null,
        email: body.email.trim(),
        phone: body.phone.trim(),
        nin: body.nin.trim(),
        state: body.state.trim(),
        lga: body.lga.trim(),
        address: body.address.trim(),
      },
    });

    const profile = await prisma.agentProfile.create({
      data: {
        id: agent.id,               // Shared ID (if intended)
        agentid: agent.id,          // Required for relation
        userid: agent.id,           // If userid = agent.id
        accessCode: generateAccessCode(),
        passportUrl: null,
      },
    });


    // console.log("Agent profile created successfully:", agent)

    return NextResponse.json({ success: true, agent, profile }, { status: 201 })
  } catch (error: unknown) {
    // console.error("❌ Error creating agent:", error)

    const message = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST to create a user." },
    { status: 405 }
  )
}
