"use client"

import { useAuth } from "../contexts/auth-context"
import { LoginForm } from "../components/login-form"

export function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">ArticleApp</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your articles</p>
        </div>
        <LoginForm onLogin={login} />
      </div>
    </div>
  )
}
