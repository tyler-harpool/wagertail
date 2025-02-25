"use client"

import { useEffect, useState } from "react"
import { SportCard } from "./SportCard"
import { readCache, writeCache } from "@/lib/cache"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
}

export default function SportsList() {
  const [sports, setSports] = useState<Sport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSports() {
      try {
        // Try to get data from cache first
        const cachedSports = await readCache<Sport[]>("sports_list")
        if (cachedSports) {
          setSports(cachedSports)
          setIsLoading(false)
          return
        }

        // If not in cache, fetch from API
        const response = await fetch("/api/sports")
        if (!response.ok) {
          throw new Error("Failed to fetch sports")
        }
        const data = await response.json()

        // Cache the fetched data
        await writeCache("sports_list", data.sports)

        setSports(data.sports)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSports()
  }, [])

  if (isLoading) return <div className="text-center p-4">Loading sports...</div>
  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {sports.map((sport) => (
        <SportCard
          key={sport.key}
          sportKey={sport.key}
          acronym={sport.title.split(" ")[0]}
          sportName={sport.group}
          fullName={sport.title}
          isActive={sport.active}
        />
      ))}
    </div>
  )
}

