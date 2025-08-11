import { NextResponse } from "next/server";
import { validateAgent } from "../../../../../lib/validateAgent";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await validateAgent({
      nin: body.nin,
      email: body.email,
      phone: body.phone,
    });

    if (!result.valid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error in validateAgent route:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
