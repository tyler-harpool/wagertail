"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          router.push("/auth/signin")
        } else {
          setIsAuthorized(true)
        }
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, loading, router])

  return { user, loading, isAuthorized }
}

