# Article Dashboard — Design Spec

## Overview

A minimal article management dashboard with a fixed top navigation bar and articles list page. The nav serves as the app's primary (and only) navigation — no separate sidebar or layout nesting.

## Route Structure

```
src/app/
├── layout.tsx          ← root layout: fonts + <AppNav />
├── page.tsx            ← landing page (unchanged)
├── globals.css         ← theme (unchanged)
└── articles/
    └── page.tsx        ← articles list page (placeholder content)
```

## Components

### `src/components/app-nav.tsx`

Client component (`'use client'` for `usePathname()`).

- `fixed top-0` full-width bar, `h-14`, border-bottom, white/background
- Left: Logo link (`/`) + "Articles" link (`/articles`) with active state
- Right: Avatar → shadcn `DropdownMenu` with Login/Logout items
- Active link highlighted when `usePathname()` starts with `/articles`

### shadcn components to add

- `dropdown-menu` — for avatar dropdown (Login/Logout)
- `avatar` — for the user avatar fallback

## Layout Integration

Root `layout.tsx` renders `<AppNav />` before `{children}`. Content area gets `pt-14` to clear the fixed nav.

## States

- **Logged out**: Avatar shows a user icon, dropdown has "Login"
- **Logged in**: Avatar shows initials/fallback, dropdown has "Logout"
- No auth logic yet — just the UI shell with static state
