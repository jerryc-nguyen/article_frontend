# Auth (Basic Login/Logout) — Design Spec

## Overview

Basic auth demo using JWT in a cookie. A client-side AuthProvider checks the `access_token` cookie on mount. Unauthenticated users are redirected to `/auth/login`. Login submits a username and receives a JWT containing the username.

## Route

```
/auth/login  ← login page
```

## Feature Module

```
src/features/auth/
├── api/
│   └── auth-service.ts     ← mock login/logout, cookie read/write, JWT decode
├── components/
│   └── login-form.tsx      ← Username input + submit
├── contexts/
│   └── auth-context.tsx    ← React context: user, login(), logout(), isAuthenticated
└── pages/
    └── login-page.tsx      ← Thin page component
```

## Data Types

```ts
interface User { username: string }

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => void
}
```

## Login Flow

1. User enters username (max 30 chars) on `/auth/login`
2. `POST /api/v1/auth/login` with `{ username }`
3. API returns `{ access_token: "jwt...", user: { username } }`
4. Store `access_token` in cookie (expires 7 days)
5. Decode JWT to extract username → set user in context
6. Redirect to `/articles`

## Auth Context

- `AuthProvider` wraps the app in root layout (inside `QueryClientProvider`)
- On mount: reads `access_token` cookie → decodes JWT payload → sets user or null
- If unauthenticated and not on `/auth/login` → redirect to `/auth/login`
- Exposes `login(username)`, `logout()`, `user`, `isAuthenticated`

## AppNav Changes

- Reads auth context
- **Logged in**: avatar (first letter of username) + full username text + dropdown with "Logout"
- **Logged out**: avatar (user icon) + dropdown with "Login" link
- Logout clears cookie, resets context, redirects to `/auth/login`

## States (Login Form)

- **Initial**: empty input, submit disabled
- **Valid**: username entered (1-30 chars), submit enabled
- **Loading**: submit shows spinner, input disabled
- **Error**: error message from API
- **Success**: redirect to `/articles`

## API Contract

```
POST /api/v1/auth/login
{ "username": "John" }

Response:
{ "access_token": "<jwt with {username} in payload>", "user": { "username": "John" } }
```
