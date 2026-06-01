# Article Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Articles list page and article edit/review page with mock data, TanStack Query, following the feature architecture pattern.

**Architecture:** Feature module at `src/features/article-management/` with `api/`, `components/`, `containers/`, `pages/` sub-directories. TanStack Query hooks wrap mock service functions. Pages are thin route entries.

**Tech Stack:** Next.js 16.2.6, TanStack Query v5, shadcn/ui (table, badge, select), Tailwind CSS v4, lucide-react

---

### Pre-task: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install TanStack Query**

```bash
npm install @tanstack/react-query
```

- [ ] **Step 2: Install shadcn components**

```bash
npx shadcn@latest add table badge select
```

- [ ] **Step 3: Add QueryClient provider to root layout**

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/app-nav";
import { QueryClientProvider } from "@/lib/providers";

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
        <QueryClientProvider>
          <AppNav />
          <main className="pt-14 flex-1">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create QueryClient provider**

Create `src/lib/providers.tsx`:

```tsx
"use client"

import { QueryClient, QueryClientProvider as Provider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return <Provider client={queryClient}>{children}</Provider>
}
```

- [ ] **Step 5: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add TanStack Query and shadcn table, badge, select"
```

---

### Task 1: API layer — types, mock data, service, hooks

**Files:**
- Create: `src/features/article-management/api/types.ts`
- Create: `src/features/article-management/api/mock-data.ts`
- Create: `src/features/article-management/api/article-service.ts`
- Create: `src/features/article-management/api/use-articles.ts`
- Create: `src/features/article-management/api/use-article.ts`
- Create: `src/features/article-management/api/use-update-article.ts`

- [ ] **Step 1: Create types.ts**

```ts
export interface ArticleSection {
  heading: string
  content: string
}

export interface KeyFact {
  label: string
  value: string
}

export type ArticleStatus = "draft" | "reviewed" | "published"

export interface Article {
  id: number
  status: ArticleStatus
  title: string
  intro_hook: string
  main_article_body: ArticleSection[]
  best_for: string
  not_for: string
  ethics_safety_notes: string
  key_facts: KeyFact[]
  original_content: string
}
```

- [ ] **Step 2: Create mock-data.ts**

```ts
import type { Article } from "./types"

export const mockArticles: Article[] = [
  {
    id: 1,
    status: "draft",
    title: "Komodo Boat Trip Guide: What To Expect On A 3D2N Sailing Adventure",
    intro_hook: "A Komodo boat trip is one of Indonesia's most unforgettable adventures, combining sunrise hikes, remote islands and life on the water over several days.",
    main_article_body: [
      {
        heading: "What Is A Komodo Boat Trip Like?",
        content: "Most Komodo boat trips depart from Labuan Bajo in Flores and run over three days and two nights. Travellers sleep onboard while visiting destinations such as Padar Island, Pink Beach and Komodo Island.",
      },
      {
        heading: "Shared Vs Private Boats",
        content: "Shared boats are generally the most budget-friendly option and attract solo travellers or small groups looking for a social atmosphere.",
      },
    ],
    best_for: "Adventure travellers, nature lovers, backpackers, couples looking for island-hopping experiences",
    not_for: "Travellers expecting luxury resort-style comfort, people prone to seasickness",
    ethics_safety_notes: "Avoid operators that feed wildlife for tourist photos. Confirm the boat has life jackets and proper safety equipment before departure.",
    key_facts: [
      { label: "Trip Duration", value: "3D2N" },
      { label: "Departure Point", value: "Labuan Bajo" },
      { label: "Typical Price Range", value: "$250-$600 USD" },
      { label: "Best Season", value: "April to October" },
    ],
    original_content: "Komodo boat trips usually start from Labuan Bajo...",
  },
  {
    id: 2,
    status: "reviewed",
    title: "Bali Hidden Temples: Off The Beaten Path",
    intro_hook: "Beyond Uluwatu and Tanah Lot lie dozens of ancient temples tucked away in rice fields and jungle valleys.",
    main_article_body: [
      {
        heading: "Why Visit Hidden Temples",
        content: "While popular temples draw crowds at sunset, hidden temples offer a peaceful glimpse into Balinese spiritual life without the tourist rush.",
      },
      {
        heading: "Temple Etiquette",
        content: "Visitors should wear a sarong and sash, speak quietly, and never climb on sacred structures.",
      },
    ],
    best_for: "Solo travellers, culture enthusiasts, photographers",
    not_for: "Travellers with limited mobility, those wanting nightlife",
    ethics_safety_notes: "Always follow local customs and dress codes. Some temples require a local guide.",
    key_facts: [
      { label: "Best Time", value: "Early morning (6-8am)" },
      { label: "Entry Fee", value: "Free - $5 USD" },
      { label: "Required", value: "Sarong and sash" },
    ],
    original_content: "Bali has hundreds of temples...",
  },
  {
    id: 3,
    status: "published",
    title: "Vietnam Street Food: A First-Timer's Guide",
    intro_hook: "From Hanoi's pho stalls to Ho Chi Minh City's buzzing night markets, Vietnam's street food scene is a sensory overload in the best way.",
    main_article_body: [
      {
        heading: "Must-Try Dishes",
        content: "Pho, banh mi, bun cha, and cao lau are essential. Each region has its own specialty.",
      },
      {
        heading: "Street Food Safety",
        content: "Eat where locals eat - high turnover means fresh ingredients. Avoid raw vegetables if you have a sensitive stomach.",
      },
    ],
    best_for: "Food lovers, budget travellers, adventurous eaters",
    not_for: "Anyone with strict dietary restrictions, hygiene-sensitive travellers",
    ethics_safety_notes: "Carry hand sanitiser. Drink bottled or filtered water only.",
    key_facts: [
      { label: "Average Meal Cost", value: "$1-$3 USD" },
      { label: "Best Cities", value: "Hanoi, Hoi An, Ho Chi Minh City" },
    ],
    original_content: "Vietnamese street food is world-famous...",
  },
]
```

- [ ] **Step 3: Create article-service.ts**

```ts
import type { Article, ArticleStatus } from "./types"
import { mockArticles } from "./mock-data"

let articles = [...mockArticles]

export async function getArticles(): Promise<Article[]> {
  return [...articles]
}

export async function getArticle(id: number): Promise<Article | undefined> {
  return articles.find((a) => a.id === id)
}

export async function updateArticle(
  id: number,
  data: Partial<Omit<Article, "id" | "original_content">>
): Promise<Article | undefined> {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) return undefined

  articles[index] = { ...articles[index], ...data }
  return articles[index]
}
```

- [ ] **Step 4: Create use-articles.ts**

```ts
import { useQuery } from "@tanstack/react-query"
import { getArticles } from "./article-service"

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  })
}
```

- [ ] **Step 5: Create use-article.ts**

```ts
import { useQuery } from "@tanstack/react-query"
import { getArticle } from "./article-service"

export function useArticle(id: number) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => getArticle(id),
    enabled: !!id,
  })
}
```

- [ ] **Step 6: Create use-update-article.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateArticle } from "./article-service"
import type { Article } from "./types"

export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Article, "id" | "original_content">> }) =>
      updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", id] })
    },
  })
}
```

- [ ] **Step 7: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add article API layer with types, mock data, service, and hooks"
```

---

### Task 2: UI components — StatusBadge, ArticleTable

**Files:**
- Create: `src/features/article-management/components/status-badge.tsx`
- Create: `src/features/article-management/components/article-table.tsx`

- [ ] **Step 1: Create status-badge.tsx**

```tsx
import { Badge } from "@/components/ui/badge"
import type { ArticleStatus } from "../api/types"

const statusStyles: Record<ArticleStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  reviewed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  published: "bg-green-100 text-green-800 hover:bg-green-100",
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>
}
```

- [ ] **Step 2: Create article-table.tsx**

```tsx
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import type { Article } from "../api/types"

interface ArticleTableProps {
  articles: Article[]
}

export function ArticleTable({ articles }: ArticleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>
              <Link
                href={`/articles/${article.id}`}
                className="font-medium hover:underline"
              >
                {article.title}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={article.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">—</TableCell>
            <TableCell className="text-muted-foreground">—</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add StatusBadge and ArticleTable components"
```

---

### Task 3: Article form component

**Files:**
- Create: `src/features/article-management/components/article-form.tsx`

- [ ] **Step 1: Create article-form.tsx**

```tsx
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Article, ArticleStatus } from "../api/types"
import { Plus, Trash2 } from "lucide-react"

interface ArticleFormProps {
  article: Article
  onSave: (data: Partial<Omit<Article, "id" | "original_content">>) => void
  isSaving: boolean
}

export function ArticleForm({ article, onSave, isSaving }: ArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [introHook, setIntroHook] = useState(article.intro_hook)
  const [bodySections, setBodySections] = useState(article.main_article_body)
  const [bestFor, setBestFor] = useState(article.best_for)
  const [notFor, setNotFor] = useState(article.not_for)
  const [ethicsNotes, setEthicsNotes] = useState(article.ethics_safety_notes)
  const [keyFacts, setKeyFacts] = useState(article.key_facts)
  const [status, setStatus] = useState<ArticleStatus>(article.status)

  useEffect(() => {
    setTitle(article.title)
    setIntroHook(article.intro_hook)
    setBodySections(article.main_article_body)
    setBestFor(article.best_for)
    setNotFor(article.not_for)
    setEthicsNotes(article.ethics_safety_notes)
    setKeyFacts(article.key_facts)
    setStatus(article.status)
  }, [article])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      intro_hook: introHook,
      main_article_body: bodySections,
      best_for: bestFor,
      not_for: notFor,
      ethics_safety_notes: ethicsNotes,
      key_facts: keyFacts,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as ArticleStatus)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Intro */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Intro / Hook</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
          value={introHook}
          onChange={(e) => setIntroHook(e.target.value)}
        />
      </div>

      {/* Body sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Article Body</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setBodySections([...bodySections, { heading: "", content: "" }])
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </div>
        {bodySections.map((section, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Section {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBodySections(bodySections.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Heading"
              value={section.heading}
              onChange={(e) => {
                const next = [...bodySections]
                next[i] = { ...next[i], heading: e.target.value }
                setBodySections(next)
              }}
            />
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              placeholder="Content"
              value={section.content}
              onChange={(e) => {
                const next = [...bodySections]
                next[i] = { ...next[i], content: e.target.value }
                setBodySections(next)
              }}
            />
          </div>
        ))}
      </div>

      {/* Best For */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Best For</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={bestFor}
          onChange={(e) => setBestFor(e.target.value)}
        />
      </div>

      {/* Not For */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Not For</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={notFor}
          onChange={(e) => setNotFor(e.target.value)}
        />
      </div>

      {/* Ethics */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Ethics / Safety Notes</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={ethicsNotes}
          onChange={(e) => setEthicsNotes(e.target.value)}
        />
      </div>

      {/* Key Facts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Key Facts</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setKeyFacts([...keyFacts, { label: "", value: "" }])}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Fact
          </Button>
        </div>
        {keyFacts.map((fact, i) => (
          <div key={i} className="flex gap-3 items-start">
            <input
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Label"
              value={fact.label}
              onChange={(e) => {
                const next = [...keyFacts]
                next[i] = { ...next[i], label: e.target.value }
                setKeyFacts(next)
              }}
            />
            <input
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Value"
              value={fact.value}
              onChange={(e) => {
                const next = [...keyFacts]
                next[i] = { ...next[i], value: e.target.value }
                setKeyFacts(next)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setKeyFacts(keyFacts.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add ArticleForm component"
```

---

### Task 4: Containers — ArticleListContainer, ArticleEditContainer

**Files:**
- Create: `src/features/article-management/containers/article-list-container.tsx`
- Create: `src/features/article-management/containers/article-edit-container.tsx`

- [ ] **Step 1: Create article-list-container.tsx**

```tsx
"use client"

import { useArticles } from "../api/use-articles"
import { ArticleTable } from "../components/article-table"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"

export function ArticleListContainer() {
  const { data: articles, isLoading, isError, error, refetch } = useArticles()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-destructive font-medium">Failed to load articles</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-muted-foreground">No articles yet.</p>
      </div>
    )
  }

  return <ArticleTable articles={articles} />
}
```

- [ ] **Step 2: Create article-edit-container.tsx**

```tsx
"use client"

import { useArticle } from "../api/use-article"
import { useUpdateArticle } from "../api/use-update-article"
import { ArticleForm } from "../components/article-form"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import type { Article } from "../api/types"
import { useRouter } from "next/navigation"

export function ArticleEditContainer({ id }: { id: number }) {
  const router = useRouter()
  const { data: article, isLoading, isError, error, refetch } = useArticle(id)
  const { mutate, isPending } = useUpdateArticle()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-32 w-full rounded-lg bg-muted animate-pulse" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-destructive font-medium">Failed to load article</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-xl font-bold">404</p>
        <p className="text-muted-foreground">Article not found</p>
        <Button variant="outline" onClick={() => router.push("/articles")}>
          Back to articles
        </Button>
      </div>
    )
  }

  const handleSave = (data: Partial<Omit<Article, "id" | "original_content">>) => {
    mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/articles")
        },
      }
    )
  }

  return <ArticleForm article={article} onSave={handleSave} isSaving={isPending} />
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add article list and edit containers"
```

---

### Task 5: Pages and route wiring

**Files:**
- Modify: `src/app/articles/page.tsx`
- Create: `src/app/articles/[id]/page.tsx`

- [ ] **Step 1: Update articles list page**

Replace `src/app/articles/page.tsx`:

```tsx
import { ArticleListContainer } from "@/features/article-management/containers/article-list-container"

export default function ArticlesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>
      <ArticleListContainer />
    </div>
  )
}
```

- [ ] **Step 2: Create article edit page**

Create `src/app/articles/[id]/page.tsx`:

```tsx
import { ArticleEditContainer } from "@/features/article-management/containers/article-edit-container"

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="p-6">
      <ArticleEditContainer id={Number(id)} />
    </div>
  )
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes. Routes include `/articles/[id]`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: wire article pages to routes"
```
