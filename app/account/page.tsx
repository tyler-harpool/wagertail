"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface UserPreferences {
  sport: string
  timezone: string
  show_upcoming_only: boolean
}

const sports = [
  { value: "upcoming", label: "Upcoming" },
  { value: "americanfootball_nfl", label: "NFL" },
  { value: "basketball_nba", label: "NBA" },
  { value: "baseball_mlb", label: "MLB" },
  { value: "icehockey_nhl", label: "NHL" },
  { value: "soccer_epl", label: "EPL" },
  { value: "basketball_ncaab", label: "NCAA Men's Basketball" },
]

const timezones = [
  { name: "Eastern Time", offset: -4 },
  { name: "Central Time", offset: -5 },
  { name: "Mountain Time", offset: -6 },
  { name: "Pacific Time", offset: -7 },
  { name: "UTC", offset: 0 },
  { name: "British Summer Time", offset: 1 },
  { name: "Central European Summer Time", offset: 2 },
]

export default function AccountPage() {
  const { user, logout, loading, getToken } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const fetchPreferences = useCallback(async () => {
    if (!user) return
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch("/api/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error("Error fetching preferences:", error)
      setError("An error occurred while fetching preferences")
    }
  }, [user, getToken])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    } else if (user) {
      fetchPreferences()
    }
  }, [user, loading, router, fetchPreferences])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => (prev ? { ...prev, [key]: value } : null))
  }

  const savePreferences = async () => {
    if (!preferences || !user) return

    try {
      const token = getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving preferences:", error)
      setError("An error occurred while saving preferences")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // This will prevent any flashing of content before redirect
  }

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {saveSuccess && (
          <Alert className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Preferences saved successfully</AlertDescription>
          </Alert>
        )}
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Name: {user.name}</p>

        {preferences && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-2">Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sport">Preferred Sport</Label>
                <Select value={preferences.sport} onValueChange={(value) => handlePreferenceChange("sport", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) => handlePreferenceChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.name} value={tz.name}>
                        {tz.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-upcoming"
                  checked={preferences.show_upcoming_only}
                  onCheckedChange={(checked) => handlePreferenceChange("show_upcoming_only", checked)}
                />
                <Label htmlFor="show-upcoming">Show upcoming 24h only</Label>
              </div>
            </div>
            <Button onClick={savePreferences} className="mt-4">
              Save Preferences
            </Button>
          </>
        )}

        <Button onClick={handleLogout} className="mt-4">
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}

