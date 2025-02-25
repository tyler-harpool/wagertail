"use client"

import { useParams } from "next/navigation"
import { SportDetails } from "@/components/SportDetails"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SportPage() {
  const { sportKey } = useParams()
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!user) {
    return null // This will prevent any flashing of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SportDetails sportKey={sportKey as string} />
    </div>
  )
}

