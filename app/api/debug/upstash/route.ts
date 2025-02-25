import { NextResponse } from "next/server"
import { checkUpstashConnection } from "@/lib/upstash"
import { writeCache, readCache } from "@/lib/cache"

export async function GET() {
  const connectionStatus = await checkUpstashConnection()

  let writeResult = null
  let readResult = null
  let error = null

  if (connectionStatus.connected) {
    try {
      await writeCache("debug-key", { test: "data" })
      writeResult = "Success"

      const readData = await readCache("debug-key")
      readResult = readData ? JSON.stringify(readData) : "No data found"
    } catch (e) {
      error = e instanceof Error ? e.message : String(e)
    }
  }

  return NextResponse.json({
    upstashStatus: connectionStatus,
    writeResult,
    readResult,
    error,
    env: {
      urlSet: !!process.env.UPSTASH_REDIS_REST_URL,
      tokenSet: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  })
}

