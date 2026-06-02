# View Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only view article page at `/articles/:id/view` with travel-blog-style presentation and sticky section navigation.

**Architecture:** New `src/features/view-article/` module with presentational component + container. Reuses `useArticle` hook from `article-management/api`. Route is a server component with breadcrumbs. Table in list page gets a View button.

**Tech Stack:** Next.js 16, shadcn/ui (badge, select, button, table), lucide-react, TanStack Query

---

### Task 1: Create `article-view.tsx` component

**Files:**
- Create: `src/features/view-article/components/article-view.tsx`

- [ ] **Step 1: Create article-view.tsx**

```tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Article } from "@/features/article-management/api/types"
import { StatusBadge } from "@/features/article-management/components/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, XCircle, Shield, BookOpen, GripVertical } from "lucide-react"

interface ArticleViewProps {
  article: Article
}

interface TocItem {
  id: string
  label: string
}

export function ArticleView({ article }: ArticleViewProps) {
  const tocItems: TocItem[] = [
    { id: "overview", label: "Overview" },
    ...article.main_article_body.map((section, i) => ({
      id: `section-${i}`,
      label: section.heading || `Section ${i + 1}`,
    })),
    { id: "audience", label: "Best For / Not For" },
    { id: "key-facts", label: "Key Facts" },
    { id: "ethics", label: "Ethics & Safety" },
  ]

  const sectionIds = tocItems.map((item) => item.id)
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const renderContent = (text: string) =>
    text.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-4 leading-relaxed text-foreground/90">
        {paragraph}
      </p>
    ))

  return (
    <div>
      {/* Mobile section nav */}
      <div className="lg:hidden mb-8">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
          Jump to section
        </label>
        <Select onValueChange={scrollToSection}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {tocItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Desktop sidebar TOC */}
        <nav className="hidden lg:block sticky top-8 self-start">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            On this page
          </h3>
          <div className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <article>
          {/* Title hero */}
          <header id="overview" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={article.status} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            {article.intro_hook && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-[70ch]">
                {article.intro_hook}
              </p>
            )}
          </header>

          {/* Body sections */}
          <div className="space-y-10 mb-12">
            {article.main_article_body.map((section, i) => (
              <section
                key={i}
                id={`section-${i}`}
                className="scroll-mt-20 max-w-[70ch]"
              >
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  {section.heading}
                </h2>
                <div className="text-base leading-7">
                  {renderContent(section.content)}
                </div>
              </section>
            ))}
          </div>

          {/* Best For / Not For */}
          <section
            id="audience"
            className="scroll-mt-20 mb-12 max-w-[70ch]"
          >
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Who is this for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Best For
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.best_for}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-red-700 dark:text-red-400">
                    Not For
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.not_for}
                </p>
              </div>
            </div>
          </section>

          {/* Key Facts */}
          {article.key_facts.length > 0 && (
            <section
              id="key-facts"
              className="scroll-mt-20 mb-12 max-w-[70ch]"
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-6">
                Key Facts
              </h2>
              <div className="rounded-xl border divide-y">
                {article.key_facts.map((fact, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[140px_1fr] gap-4 px-6 py-3 text-sm"
                  >
                    <span className="font-medium text-muted-foreground">
                      {fact.label}
                    </span>
                    <span>{fact.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ethics & Safety */}
          {article.ethics_safety_notes && (
            <section
              id="ethics"
              className="scroll-mt-20 mb-12 max-w-[70ch]"
            >
              <div className="rounded-xl border bg-muted/50 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                  <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Ethics & Safety Notes
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.ethics_safety_notes}
                </p>
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create the directory**

Run: `mkdir -p src/features/view-article/components`

- [ ] **Step 3: Commit**

```bash
git add src/features/view-article/components/article-view.tsx
git commit -m "feat: add article-view component"
```

---

### Task 2: Create `article-view-container.tsx`

**Files:**
- Create: `src/features/view-article/containers/article-view-container.tsx`

- [ ] **Step 1: Create article-view-container.tsx**

```tsx
"use client"

import { useArticle } from "@/features/article-management/api/use-article"
import { ArticleView } from "../components/article-view"
import { Button } from "@/components/ui/button"
import { RotateCw, FileText, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

function LoadingSkeleton() {
  return (
    <div className="max-w-[70ch] mx-auto space-y-8">
      <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
      <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-32 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="rounded-full bg-destructive/10 p-3">
        <FileText className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-destructive font-medium">Failed to load article</p>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {error.message}
      </p>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RotateCw className="h-4 w-4" /> Retry
      </Button>
    </div>
  )
}

function NotFoundState() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="rounded-full bg-muted p-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-xl font-bold tracking-tight">404</p>
      <p className="text-muted-foreground">Article not found</p>
      <Button variant="outline" onClick={() => router.push("/articles")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to articles
      </Button>
    </div>
  )
}

export function ArticleViewContainer({ id }: { id: number }) {
  const { data: article, isLoading, isError, error, refetch } = useArticle(id)

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState error={error as Error} onRetry={refetch} />
  if (!article) return <NotFoundState />

  return <ArticleView article={article} />
}
```

- [ ] **Step 2: Create directory**

Run: `mkdir -p src/features/view-article/containers`

- [ ] **Step 3: Commit**

```bash
git add src/features/view-article/containers/article-view-container.tsx
git commit -m "feat: add article-view-container"
```

---

### Task 3: Create `/articles/[id]/view` route page

**Files:**
- Create: `src/app/articles/[id]/view/page.tsx`

- [ ] **Step 1: Create page.tsx**

```tsx
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ArticleViewContainer } from "@/features/view-article/containers/article-view-container"

export const metadata = {
  title: "View Article - ArticleApp",
}

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="min-h-full">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumbs
            items={[
              { label: "Articles", href: "/articles" },
              { label: "View" },
            ]}
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <ArticleViewContainer id={Number(id)} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create directory**

Run: `mkdir -p src/app/articles/\[id\]/view`

- [ ] **Step 3: Commit**

```bash
git add src/app/articles/\[id\]/view/page.tsx
git commit -m "feat: add view article route page"
```

---

### Task 4: Add View button to article table

**Files:**
- Modify: `src/features/article-management/components/article-table.tsx`

- [ ] **Step 1: Add Eye import and View button**

Replace the import line for lucide-react:

Old:
```tsx
import { Trash2 } from "lucide-react"
```

New:
```tsx
import { Trash2, Eye } from "lucide-react"
```

Add a View button before the existing delete button in the action cell:

Old:
```tsx
<TableCell>
  <Button
    variant="ghost"
    size="icon"
    onClick={() => onDelete(article.id)}
    aria-label={`Delete ${article.title}`}
  >
    <Trash2 className="h-4 w-4 text-destructive" />
  </Button>
</TableCell>
```

New:
```tsx
<TableCell>
  <div className="flex items-center gap-1">
    <Link href={`/articles/${article.id}/view`}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`View ${article.title}`}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </Link>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete(article.id)}
      aria-label={`Delete ${article.title}`}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </div>
</TableCell>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/article-management/components/article-table.tsx
git commit -m "feat: add view button to article table"
```

---

### Task 5: Verify build

- [ ] **Step 1: Run build check**

Run: `npm run build`

Expected: Build succeeds with no errors

If linting errors occur, fix them and run again.
