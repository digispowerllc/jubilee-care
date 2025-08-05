// src/app/api/your-endpoint/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  console.log(`[${new Date().toISOString()}] Incoming POST request to /api/your-endpoint`)

  try {
    const body = await req.json()

    console.log("Request body:", body)

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

    const agent = await prisma.agent.create({
      data: {
        surname: body.surname,
        firstName: body.firstName,
        otherName: body.lastName ?? null,
        email: body.email,
        phone: body.phone,
        nin: body.nin,
        state: body.state,
        lga: body.lga,
        address: body.address,
      },
    })

    console.log("✅ Agent profile created successfully:", agent)

    return NextResponse.json({ success: true, agent }, { status: 201 })
  } catch (error: unknown) {
    console.error("❌ Error creating agent:", error)

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
