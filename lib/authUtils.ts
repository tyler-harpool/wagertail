import type { User } from "@/types/user"

const DAILY_LOGIN_BONUS = 100
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

// Preview authentication utilities
export const previewAuth = {
  login: (email: string): User => {
    const storedUser = localStorage.getItem("previewUser")
    let user: User

    if (storedUser) {
      user = JSON.parse(storedUser)
      const lastLoginDate = new Date(user.lastLogin)
      const currentDate = new Date()

      if (currentDate.getTime() - lastLoginDate.getTime() >= MILLISECONDS_IN_DAY) {
        user.tails += DAILY_LOGIN_BONUS
        user.lastLogin = currentDate
      }
    } else {
      user = {
        id: "1",
        email,
        name: "Preview User",
        tails: DAILY_LOGIN_BONUS,
        blubber: 0,
        rank: "Plankton",
        winStreak: 0,
        totalBets: 0,
        winRate: 0,
        lastLogin: new Date(),
        createdAt: new Date(),
      }
    }

    localStorage.setItem("previewUser", JSON.stringify(user))
    return user
  },

  logout: () => {
    localStorage.removeItem("previewUser")
  },

  checkAuth: (): User | null => {
    const storedUser = localStorage.getItem("previewUser")
    return storedUser ? JSON.parse(storedUser) : null
  },
}

// Production authentication utilities
export const productionAuth = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }

    const data = await response.json()
    return data.user
  },

  logout: async (): Promise<void> => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
  },

  checkAuth: async (): Promise<User | null> => {
    const response = await fetch("/api/auth/check", {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    })

    const data = await response.json()
    return data.authenticated && data.user ? data.user : null
  },
}

