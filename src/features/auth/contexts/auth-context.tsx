"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { login as authLogin, logout as authLogout, getUserFromCookie } from "../api/auth-service"
import type { AuthState, User } from "../api/types"

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getUserFromCookie()
    setUser(stored)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return
    if (!user && pathname !== "/auth/login") {
      router.push("/auth/login")
    }
  }, [user, isLoading, pathname, router])

  const login = useCallback(async (username: string) => {
    const u = await authLogin(username)
    setUser(u)
    router.push("/articles")
  }, [router])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
    router.push("/auth/login")
  }, [router])

  if (isLoading) return null

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
