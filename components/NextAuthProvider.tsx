"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

export function NextAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const errorListener = (event: ErrorEvent) => {
        console.error("NextAuth Error:", event.error)
      }
      window.addEventListener("error", errorListener)
      return () => window.removeEventListener("error", errorListener)
    }
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}

