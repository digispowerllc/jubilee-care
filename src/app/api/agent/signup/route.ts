import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { generateAccessCode, generateAgentId } from "../../../../lib/generators"
import { z } from "zod"

// Zod schema to validate the incoming request body
const agentSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  firstName: z.string().min(1, "First name is required"),
  otherName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  nin: z.string().min(1, "NIN is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  address: z.string().min(1, "Address is required"),
})

export async function POST(req: Request) {
  console.log("POST request received to create new agent")
  try {
    const body = await req.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    // Validate request body using Zod
    const parseResult = agentSchema.safeParse(body)
    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors
      console.log("Validation failed with errors:", formattedErrors)
      return NextResponse.json(
        { success: false, error: "Invalid input", details: formattedErrors },
        { status: 400 }
      )
    }

    // Destructure and sanitize the validated input
    const {
      surname,
      firstName,
      otherName,
      email,
      phone,
      nin,
      state,
      lga,
      address,
    } = parseResult.data

    console.log("Generating access code and agent ID")
    const accessCode = generateAccessCode()
    const agentId = await generateAgentId()
    console.log(`Generated access code: ${accessCode}, agent ID: ${agentId}`)

    // Create agent in DB
    console.log("Creating agent in database")
    const agent = await prisma.agent.create({
      data: {
        surname: surname.trim(),
        firstName: firstName.trim(),
        otherName: otherName ? otherName.trim() : "",
        email: email.trim(),
        phone: phone.trim(),
        nin: nin.trim(),
        state: state.trim(),
        lga: lga.trim(),
        address: address.trim(),
      },
    })
    console.log("Agent created successfully with ID:", agent.id)

    // Create corresponding agent profile
    console.log("Creating agent profile")
    const profile = await prisma.agentProfile.create({
      data: {
        id: agent.id,
        agentId: agentId,
        accessCode: accessCode,
      },
    })
    console.log("Agent profile created successfully")

    console.log("Agent creation process completed successfully")
    return NextResponse.json({ success: true, agent, profile }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("Error in agent creation:", error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// Fallback for unsupported HTTP methods
export function GET() {
  console.log("GET method called but not allowed")
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST to create a user." },
    { status: 405 }
  )
}