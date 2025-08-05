// src/app/api/your-endpoint/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  console.log(`[${new Date().toISOString()}] Incoming POST request to /api/your-endpoint`);

  try {
    const body = await req.json();

    console.log("Request body:", body);

    const user = await prisma.user.create({
      data: {
        surname: body.surname,
        firstName: body.firstName,
        lastName: body.lastName || null,
        email: body.email,
        phone: body.phone,
        nin: body.nin,
        state: body.state,
        lga: body.lga,
        address: body.address,
      },
    });

    console.log("✅ User created successfully:", user);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ Error creating user:", error);

    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Use POST to create a user" }, { status: 405 });
}
