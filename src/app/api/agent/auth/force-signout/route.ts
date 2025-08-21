import { NextResponse } from "next/server";

const SESSION_COOKIE = "session-token";
const AGENT_COOKIE = "agent-id";

export async function GET(req: Request) {
  const url = new URL("/agent/signin", req.url);
  const response = NextResponse.redirect(url);

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set(AGENT_COOKIE, "", {
    httpOnly: false,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
