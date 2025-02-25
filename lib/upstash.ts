export async function checkUpstashConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return { connected: false, error: "Upstash Redis environment variables are missing" }
    }

    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    })

    if (!response.ok) {
      return {
        connected: false,
        error: `Upstash Redis connection failed: ${response.status} ${response.statusText}`,
      }
    }

    const result = await response.json()
    return {
      connected: result.result === "PONG",
      error: result.result !== "PONG" ? "Unexpected response from Upstash Redis" : undefined,
    }
  } catch (error) {
    return {
      connected: false,
      error: `Upstash Redis connection check failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

