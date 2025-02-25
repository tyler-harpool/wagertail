"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log("Checking auth status...")
        const response = await fetch("/api/auth/check", {
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        })
        console.log("Auth check response status:", response.status)

        if (!response.ok) {
          if (response.status === 429) {
            console.error("Rate limit exceeded during auth check")
            setError("Too many requests. Please try again later.")
          } else if (response.status === 500) {
            console.error("Internal server error during auth check")
            setError("An unexpected error occurred. Please try again later.")
          } else {
            const errorText = await response.text()
            console.error("Auth check error response:", errorText)
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
          }
          setUser(null)
        } else {
          const data = await response.json()
          console.log("Auth check response data:", data)

          if (data.authenticated && data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error instanceof Error ? error.message : String(error))
        setUser(null)
        setError("Failed to check authentication status. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again later.")
        }
        const errorData = await response.json()
        console.error("Login error response:", errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Login error:", error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Logout failed")
      }
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

