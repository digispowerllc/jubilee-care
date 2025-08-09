import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectData } from "@/lib/dataProtection";
import { z } from "zod";

const agentSchema = z.object({
  surname: z.string().min(1).max(100),
  firstName: z.string().min(1).max(100),
  otherName: z.string().max(100).optional().nullable(),
  email: z.string().email().max(100),
  phone: z.string().min(10).max(15),
  nin: z.string().min(11).max(11),
  state: z.string().min(1).max(50),
  lga: z.string().min(1).max(50),
  address: z.string().min(1).max(200),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = agentSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten() },
        { status: 400 }
      );
    }

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
      password
    } = parseResult.data;

    // Check if email or phone already exists
    const existingAgent = await prisma.agent.findFirst({
      where: {
        OR: [
          { email: await protectData(email, 'email') as string },
          { phone: await protectData(phone, 'phone') as string }
        ]
      }
    });

    if (existingAgent) {
      return NextResponse.json(
        { success: false, error: "Email or phone number already registered" },
        { status: 409 }
      );
    }

    // Create agent in transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create agent with encrypted data
      const agent = await prisma.agent.create({
        data: {
          surname: await protectData(surname, 'name') as string,
          firstName: await protectData(firstName, 'name') as string,
          otherName: otherName ? await protectData(otherName, 'name') as string : "",
          email: await protectData(email, 'email') as string,
          phone: await protectData(phone, 'phone') as string,
          nin: await protectData(nin, 'government-id') as string,
          state: await protectData(state, 'location') as string,
          lga: await protectData(lga, 'location') as string,
          address: await protectData(address, 'location') as string
        }
      });

      // Create profile
      await prisma.agentProfile.create({
        data: {
          id: agent.id,
          agentId: agent.id, // Or generate a separate ID if needed
          accessCode: await protectData(password, 'system-code') as string
        }
      });

      return agent;
    });

    return NextResponse.json(
      {
        success: true,
        agentId: result.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Agent creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again."
      },
      { status: 500 }
    );
  }
}