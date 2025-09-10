import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Mock success: in a real app you'd validate credentials
    return NextResponse.json({ message: "Logged in", token: "mock-token-123" });
  } catch (_ ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
