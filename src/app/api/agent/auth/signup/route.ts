import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectData, generateSearchableHash } from "@/lib/security/dataProtection";
import { z } from "zod";
import { generateAgentId } from "@/lib/security/generators";

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
      password,
    } = parseResult.data;

    // Generate normalized searchable hashes
    const emailHash = await generateSearchableHash(email);
    const phoneHash = await generateSearchableHash(phone);
    const ninHash = await generateSearchableHash(nin);


    // Check if already registered
    const existingAgent = await prisma.agent.findFirst({
      where: {
        OR: [{ emailHash }, { phoneHash }, { ninHash }],
      },
      select: { id: true },
    });

    if (existingAgent) {
      return NextResponse.json(
        { success: false, error: "e-Mail address, phone, or NIN already registered" },
        { status: 409 }
      );
    }

    const fieldId = generateAgentId();
    const DEFAULT_PIN = "";
    // This is the default PIN used for agent registration.

    // Create agent & profile in a transaction
    const result = await prisma.$transaction(async (prismaTx) => {
      const agent = await prismaTx.agent.create({
        data: {
          fieldId: fieldId,
          surname: (await protectData(surname, "name")).encrypted,
          firstName: (await protectData(firstName, "name")).encrypted,
          otherName: otherName
            ? (await protectData(otherName, "name")).encrypted
            : "",
          email: (await protectData(email, "email")).encrypted,
          phone: (await protectData(phone, "phone")).encrypted,
          nin: (await protectData(nin, "government")).encrypted,
          state: (await protectData(state, "location")).encrypted,
          lga: (await protectData(lga, "location")).encrypted,
          address: (await protectData(address, "location")).encrypted,

          // store searchable hashes
          emailHash,
          phoneHash,
          ninHash,
        },
      });

      await prismaTx.agentProfile.create({
        data: {
          id: agent.id,
          agentId: agent.id,
          email: (await protectData(email, "email")).encrypted,
          emailHash,
          phone: (await protectData(phone, "phone")).encrypted,
          phoneHash,
          pin: DEFAULT_PIN,
          pinHash: DEFAULT_PIN,
          passwordHash: (await protectData(password, "system-code")).encrypted,
        },
      });


      return agent;
    });

    return NextResponse.json(
      { success: true, agentId: result.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Agent creation error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
