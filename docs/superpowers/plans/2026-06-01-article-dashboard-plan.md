# Article Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fixed top nav bar with logo, Articles link, and avatar dropdown; add a placeholder articles list page.

**Architecture:** Root layout wraps `<AppNav />` above `{children}` with `pt-14` padding. Nav is a client component using `usePathname()` for active link highlighting. Articles page is a server component placeholder.

**Tech Stack:** Next.js 16.2.6, shadcn/ui (dropdown-menu + avatar), Tailwind CSS v4, lucide-react

---

### Task 1: Install shadcn dependencies

- [ ] **Step 1: Install dropdown-menu and avatar components**

```bash
npx shadcn@latest add dropdown-menu avatar
```

Expected: Components installed to `src/components/ui/dropdown-menu.tsx` and `src/components/ui/avatar.tsx`.

---

### Task 2: Create AppNav component

**Files:**
- Create: `src/components/app-nav.tsx`

- [ ] **Step 1: Create the nav component**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

const navItems = [
  { label: "Articles", href: "/articles" },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center border-b bg-background px-6">
      <Link href="/" className="font-bold text-lg mr-8">
        ArticleApp
      </Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              pathname.startsWith(item.href)
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Login</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
```

---

### Task 3: Update root layout with nav + articles route

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/articles/page.tsx`

- [ ] **Step 1: Update root layout to include AppNav**

Replace the current `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/app-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArticleApp",
  description: "Manage your articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppNav />
        <main className="pt-14 flex-1">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create articles placeholder page**

Create `src/app/articles/page.tsx`:

```tsx
export default function ArticlesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Articles</h1>
      <p className="text-muted-foreground mt-2">Your articles will appear here.</p>
    </div>
  )
}
```

---

### Task 4: Build and verify

- [ ] **Step 1: Build the project**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes, routes include `/articles`.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add app nav with articles route"
```
