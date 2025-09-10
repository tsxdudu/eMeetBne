import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }

    // Mock: pretend we created a user
    return NextResponse.json({ message: "Account created", user: { id: "u1", name, email } });
  } catch (_) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
