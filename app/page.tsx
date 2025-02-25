"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { WhaleLogo } from "@/components/WhaleLogo"

console.log("page.tsx: Start of file")

// Dynamically import OddsList with no SSR
const OddsList = dynamic(() => import("@/components/OddsList"), {
  ssr: false,
  loading: () => <p>Loading odds...</p>,
})

console.log("page.tsx: OddsList dynamically imported")

export default function Home() {
  console.log("Home: Component function called")
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <UnauthenticatedView />
  }

  return <AuthenticatedView />
}

function UnauthenticatedView() {
  const router = useRouter()
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center mb-8">
        <WhaleLogo className="w-12 h-12 mr-4 text-purple-600" />
        <h1 className="text-4xl font-bold">Welcome to Wager Tail</h1>
      </div>
      <p className="mb-4">Please sign in to view odds and place bets.</p>
      <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
    </main>
  )
}

function AuthenticatedView() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Odds</h1>
      <ErrorBoundary>
        {console.log("Home: Before rendering OddsList")}
        <OddsList />
        {console.log("Home: After rendering OddsList")}
      </ErrorBoundary>
    </main>
  )
}

console.log("page.tsx: End of file")

