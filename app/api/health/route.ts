import { NextResponse } from "next/server"
import { checkUpstashConnection } from "@/lib/upstash"

export async function GET() {
  const upstashStatus = await checkUpstashConnection()

  return NextResponse.json({
    status: "ok",
    upstash: {
      connected: upstashStatus.connected,
      error: upstashStatus.error,
      url: process.env.UPSTASH_REDIS_REST_URL ? "set" : "missing",
      token: process.env.UPSTASH_REDIS_REST_TOKEN ? "set" : "missing",
    },
  })
}

