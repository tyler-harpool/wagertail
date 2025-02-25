import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 })
  }

  const payload = await verifyJwt(token)

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  return NextResponse.json({ user: payload })
}

export async function POST(request: Request) {
  // Handle login logic here
  // This is just a placeholder, you'll need to implement the actual login logic
  return NextResponse.json({ message: "Login endpoint" })
}

