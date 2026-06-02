import { api } from "@/commons/api/client"
import { ROUTES } from "@/commons/api/routes"
import type { User } from "./types"

const COOKIE_NAME = "access_token"
const COOKIE_PATH = "/"
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    return JSON.parse(atob(parts[1]))
  } catch {
    return null
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(`(?:^|;\\s*)${name}=([^;]*)`)
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${COOKIE_PATH}; max-age=${maxAge}; samesite=lax`
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=${COOKIE_PATH}; max-age=0`
}

export async function login(name: string): Promise<User> {
  const data = await api.post<{ access_token: string }>(ROUTES.AUTH.LOGIN, { name })
  setCookie(COOKIE_NAME, data.access_token, COOKIE_MAX_AGE)
  const payload = decodeJwt(data.access_token)
  return { username: (payload?.username as string) || name, user_id: payload?.user_id as string | undefined }
}

export function logout(): void {
  deleteCookie(COOKIE_NAME)
}

export function getUserFromCookie(): User | null {
  const token = getCookie(COOKIE_NAME)
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload || !payload.username) return null
  return { username: payload.username as string, user_id: payload.user_id as string | undefined }
}
