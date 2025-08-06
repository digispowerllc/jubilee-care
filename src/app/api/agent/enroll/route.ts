import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { generateAccessCode, generateAgentId } from "@/app/lib/generators"
import { z } from "zod"

// Zod schema to validate the incoming request body
const agentSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  nin: z.string().min(1, "NIN is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  address: z.string().min(1, "Address is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body using Zod
    const parseResult = agentSchema.safeParse(body)
    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors
      return NextResponse.json(
        { success: false, error: "Invalid input", details: formattedErrors },
        { status: 400 }
      )
    }

    // Destructure and sanitize the validated input
    const {
      surname,
      firstName,
      lastName,
      email,
      phone,
      nin,
      state,
      lga,
      address,
    } = parseResult.data

    const accessCode = generateAccessCode()
    const agentId = await generateAgentId()

    // Create agent in DB
    const agent = await prisma.agent.create({
      data: {
        surname: surname.trim(),
        firstName: firstName.trim(),
        otherName: lastName?.trim() ?? null,
        email: email.trim(),
        phone: phone.trim(),
        nin: nin.trim(),
        state: state.trim(),
        lga: lga.trim(),
        address: address.trim(),
      },
    })

    // Create corresponding agent profile
    const profile = await prisma.agentProfile.create({
      data: {
        id: agent.id,
        agentId: agentId,
        accessCode: accessCode,
        passportUrl: null,
      },
    })

    return NextResponse.json({ success: true, agent, profile }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// Fallback for unsupported HTTP methods
export function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST to create a user." },
    { status: 405 }
  )
}
