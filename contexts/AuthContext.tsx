"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { previewAuth, productionAuth } from "@/lib/authUtils"
import type { User } from "@/types/user"

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
  const router = useRouter()
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
  const auth = isPreview ? previewAuth : productionAuth

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticatedUser = await auth.checkAuth()
        setUser(authenticatedUser)
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        setError("Authentication check failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [auth])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const authenticatedUser = await auth.login(email, password)
      setUser(authenticatedUser)
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await auth.logout()
      setUser(null)
      router.push("/auth/signin")
    } catch (error) {
      console.error("Logout error:", error)
      setError(error instanceof Error ? error.message : "Logout failed")
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

