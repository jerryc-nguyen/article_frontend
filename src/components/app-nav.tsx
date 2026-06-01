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
import { useAuth } from "@/features/auth/contexts/auth-context"

const navItems = [
  { label: "Articles", href: "/articles" },
]

export function AppNav() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

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
      <div className="ml-auto flex items-center gap-2">
        {isAuthenticated && user && (
          <span className="text-sm font-medium">{user.username}</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback>
                {isAuthenticated && user
                  ? user.username.charAt(0).toUpperCase()
                  : <User className="h-4 w-4" />
                }
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAuthenticated ? (
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => window.location.href = "/auth/login"}>Login</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
