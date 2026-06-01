<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: article_frontend

Next.js 16.2.6 + TypeScript + shadcn/ui v4 + Tailwind CSS v4.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack default)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (components in `src/components/ui/`)
- **Styling**: Tailwind CSS v4 (CSS variables in `globals.css`, oklch color space)
- **Icons**: lucide-react
- **Package Manager**: npm
- **Import Alias**: `@/*` → `src/*`

## Key Conventions

1. `params` and `searchParams` are **Promises** — always `await` them
2. Middleware lives in `proxy.ts` (not `middleware.ts`), exports `proxy`
3. shadcn components import from `@/components/ui/<name>`
4. Use `cn()` from `@/lib/utils` for class merging
5. Components are Server Components by default — only use `'use client'` when needed
6. Follow the skills in `.opencode/skills/` for detailed guidance
