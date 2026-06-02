export interface User {
  username: string
  user_id?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => void
}
