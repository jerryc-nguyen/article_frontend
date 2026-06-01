# Article Create (Upload .docx) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to upload a `.docx` file, parse it client-side with mammoth, send the extracted text to the backend API, and redirect to the edit page.

**Architecture:** Client-side mammoth parsing in the browser. A `useMutation` hook posts to `/api/v1/article_ai_parser`. On success, redirects to `/articles/[id]`. A "Create New Article" button is added to the list page.

**Tech Stack:** Next.js 16.2.6, mammoth, TanStack Query, shadcn/ui, Tailwind CSS v4

---

### Task 1: Install mammoth

- [ ] **Step 1: Install mammoth**

```bash
npm install mammoth
npm install -D @types/mammoth
```

Expected: mammoth added to dependencies, types added to devDependencies.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "chore: add mammoth for docx parsing"
```

---

### Task 2: Add createArticle to service + create hook

**Files:**
- Modify: `src/features/article-management/api/article-service.ts`
- Create: `src/features/article-management/api/use-create-article.ts`

- [ ] **Step 1: Add createArticle to service**

Add to `src/features/article-management/api/article-service.ts`:

```ts
export async function createArticle(
  originalContent: string
): Promise<Article> {
  const res = await fetch("/api/v1/article_ai_parser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ original_content: originalContent }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || "Failed to create article")
  }
  return res.json()
}
```

- [ ] **Step 2: Create use-create-article.ts hook**

```ts
import { useMutation } from "@tanstack/react-query"
import { createArticle } from "./article-service"

export function useCreateArticle() {
  return useMutation({
    mutationFn: createArticle,
  })
}
```

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully, TypeScript passes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add useCreateArticle mutation hook"
```

---

### Task 3: Create ArticleUpload component

**Files:**
- Create: `src/features/article-management/components/article-upload.tsx`

- [ ] **Step 1: Create the upload component**

```tsx
"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

interface ArticleUploadProps {
  onFileSelect: (file: File) => void
  disabled: boolean
}

export function ArticleUpload({ onFileSelect, disabled }: ArticleUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (f: File): boolean => {
    if (!f.name.endsWith(".docx")) {
      setError("File must be a .docx file")
      return false
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit")
      return false
    }
    setError(null)
    return true
  }

  const handleFile = (f: File) => {
    if (!validateFile(f)) return
    setFile(f)
    onFileSelect(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
        {file ? (
          <>
            <FileText className="h-10 w-10 text-primary mb-3" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">Drop .docx here or click to browse</p>
            <p className="text-sm text-muted-foreground">Max 10MB</p>
          </>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
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
git add -A && git commit -m "feat: add ArticleUpload component"
```

---

### Task 4: Create ArticleCreateContainer

**Files:**
- Create: `src/features/article-management/containers/article-create-container.tsx`

- [ ] **Step 1: Create the create container**

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import mammoth from "mammoth"
import { useCreateArticle } from "../api/use-create-article"
import { ArticleUpload } from "../components/article-upload"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ArticleCreateContainer() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync: createArticle } = useCreateArticle()

  const handleSubmit = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const article = await createArticle(result.value)
      router.push(`/articles/${article.id}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create New Article</h1>
      <ArticleUpload
        onFileSelect={(f) => {
          setFile(f)
          setError(null)
        }}
        disabled={isProcessing}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Upload & Generate Article"
        )}
      </Button>
    </div>
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
git add -A && git commit -m "feat: add ArticleCreateContainer with mammoth parsing"
```

---

### Task 5: Create page and route

**Files:**
- Create: `src/features/article-management/pages/create-page.tsx`
- Create: `src/app/articles/new/page.tsx`

- [ ] **Step 1: Create create-page.tsx**

```tsx
import { ArticleCreateContainer } from "../containers/article-create-container"

export function CreatePage() {
  return <ArticleCreateContainer />
}
```

- [ ] **Step 2: Create route page**

Create `src/app/articles/new/page.tsx`:

```tsx
import { CreatePage } from "@/features/article-management/pages/create-page"

export default function ArticleNewPage() {
  return (
    <div className="p-6">
      <CreatePage />
    </div>
  )
}
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: Compiled successfully. Routes include `/articles/new`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add /articles/new route and page"
```

---

### Task 6: Update list page with Create New Article button

**Files:**
- Modify: `src/features/article-management/containers/article-list-container.tsx`

- [ ] **Step 1: Update ArticleListContainer with create button**

Replace `src/features/article-management/containers/article-list-container.tsx`:

```tsx
"use client"

import Link from "next/link"
import { useArticles } from "../api/use-articles"
import { ArticleTable } from "../components/article-table"
import { Button } from "@/components/ui/button"
import { RotateCw, Plus } from "lucide-react"

export function ArticleListContainer() {
  const { data: articles, isLoading, isError, error, refetch } = useArticles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create New Article
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-destructive font-medium">Failed to load articles</p>
          <p className="text-sm text-muted-foreground">
            {(error as Error).message}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-muted-foreground">No articles yet.</p>
          <Link href="/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create New Article
            </Button>
          </Link>
        </div>
      ) : (
        <ArticleTable articles={articles} />
      )}
    </div>
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
git add -A && git commit -m "feat: add Create New Article button to list page"
```
