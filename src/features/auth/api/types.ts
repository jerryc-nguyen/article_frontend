export interface User {
  username: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => void
}
