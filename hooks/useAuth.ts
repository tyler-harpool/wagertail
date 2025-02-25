"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Checking auth status...")
        const response = await fetch("/api/auth/check")
        const data = await response.json()
        console.log("Auth check response:", data)
        setIsAuthenticated(data.authenticated)
        if (data.authenticated && data.user) {
          setUser(data.user)
          console.log("User authenticated:", data.user)
        } else {
          setUser(null)
          console.log("User not authenticated")
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, user, isLoading }
}

