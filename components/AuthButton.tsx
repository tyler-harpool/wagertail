"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"

export default function AuthButton() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/signin")
  }

  if (!mounted || loading) {
    return <Button disabled>Loading...</Button>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.email}</span>
        <Button variant="ghost" onClick={() => router.push("/account")}>
          Account
        </Button>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" onClick={() => router.push("/auth/signin")}>
      Sign in
    </Button>
  )
}

