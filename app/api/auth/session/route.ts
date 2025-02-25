import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export async function GET(request: Request) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.json(null)
  }

  const payload = await verifyJwt(token)
  return NextResponse.json(payload)
}

