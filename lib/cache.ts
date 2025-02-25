const CACHE_DURATION = 15 * 60 // 15 minutes in seconds

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.error("Upstash Redis environment variables are missing")
      return null
    }

    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error("Upstash Redis read error:", response.status, response.statusText)
      return null
    }

    const result = await response.json()
    if (result.result === null) {
      return null
    }

    try {
      return JSON.parse(result.result) as T
    } catch {
      console.error("Failed to parse cached data")
      return null
    }
  } catch (error) {
    console.error("Cache read error:", error)
    return null
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Upstash Redis environment variables are missing")
    }

    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([JSON.stringify(data), "EX", CACHE_DURATION]),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Upstash Redis write error:", response.status, response.statusText, errorText)
      throw new Error(`Upstash Redis write failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    if (result.error) {
      console.error("Upstash Redis write error:", result.error)
      throw new Error(`Upstash Redis write failed: ${result.error}`)
    }
  } catch (error) {
    console.error("Cache write error:", error)
    throw error
  }
}

