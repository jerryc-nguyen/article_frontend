# Article API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace in-memory mock data in the article-management feature with real API calls matching the contract, and add an auth-aware API client.

**Architecture:** Add a thin `api/client.ts` wrapper that reads `access_token` from cookie and injects `Authorization: Bearer <token>` on every request. Rewrite `article-service.ts` functions to call real endpoints. Delete `mock-data.ts`. Types and components remain unchanged — the API is expected to return flat `Article` objects.

**Tech Stack:** TanStack Query v5, native `fetch`, cookie-based JWT auth

---

## Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/features/article-management/api/client.ts` | Auth-aware fetch wrapper |
| Modify | `src/features/article-management/api/article-service.ts` | Replace mock with real fetch |
| Create | `src/features/article-management/api/use-update-article-status.ts` | PATCH status mutation hook |
| Delete | `src/features/article-management/api/mock-data.ts` | No longer needed |
| Modify | `src/features/article-management/api/use-update-article.ts` | Update mutationFn payload type |
| Modify | `src/features/article-management/api/use-articles.ts` | Add optional status filter param |
| Modify | `src/features/article-management/api/use-article.ts` | Use `Number()` for path param |
| Modify | `src/features/article-management/api/use-create-article.ts` | Fix type return |
| No change | All components, containers, pages | Unaffected |

---

### Task 1: Create auth-aware API client

**Files:**
- Create: `src/features/article-management/api/client.ts`

- [ ] **Write `client.ts`**

```typescript
import type { Article } from "./types"

const BASE_URL = "http://localhost:4567/api/v1"

function getToken(): string | null {
  const match = document.cookie.match("(?:^|;\\s*)access_token=([^;]*)")
  return match ? decodeURIComponent(match[1]) : null
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.error || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
}
```

- [ ] **Create the file**

Run: `touch src/features/article-management/api/client.ts` then write content above.

---

### Task 2: Rewrite `article-service.ts` to use real API

**Files:**
- Modify: `src/features/article-management/api/article-service.ts`

- [ ] **Replace entire file content**

```typescript
import type { Article } from "./types"
import { api } from "./client"

export async function getArticles(status?: string): Promise<Article[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : ""
  return api.get<Article[]>(`/article_management${query}`)
}

export async function getArticle(id: number): Promise<Article> {
  return api.get<Article>(`/article_management/${id}`)
}

export async function createArticle(
  originalContent: string
): Promise<Article> {
  return api.post<Article>("/article_ai_parser", {
    original_content: originalContent,
  })
}

export async function updateArticle(
  id: number,
  data: Partial<Omit<Article, "id">>
): Promise<Article> {
  return api.put<Article>(`/article_management/${id}`, data)
}

export async function updateArticleStatus(
  id: number,
  status: string
): Promise<Article> {
  return api.patch<Article>(`/article_management/${id}/status`, { status })
}
```

---

### Task 3: Create `useUpdateArticleStatus` hook

**Files:**
- Create: `src/features/article-management/api/use-update-article-status.ts`

- [ ] **Write and create the file**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateArticleStatus } from "./article-service"

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: string
    }) => updateArticleStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", id] })
    },
  })
}
```

---

### Task 4: Update `useUpdateArticle` mutation payload type

**Files:**
- Modify: `src/features/article-management/api/use-update-article.ts`

- [ ] **Update the mutationFn type**

Change the `data` type from `Partial<Omit<Article, "id" | "original_content">>` to `Partial<Omit<Article, "id">>`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateArticle } from "./article-service"
import type { Article } from "./types"

export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Article, "id">>
    }) => updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", id] })
    },
  })
}
```

---

### Task 5: Add optional status filter to `useArticles`

**Files:**
- Modify: `src/features/article-management/api/use-articles.ts`

- [ ] **Add optional `status` parameter**

```typescript
import { useQuery } from "@tanstack/react-query"
import { getArticles } from "./article-service"

export function useArticles(status?: string) {
  return useQuery({
    queryKey: status ? ["articles", "filter", status] : ["articles"],
    queryFn: () => getArticles(status),
  })
}
```

---

### Task 6: Update `useArticle` to coerce path param

**Files:**
- Modify: `src/features/article-management/api/use-article.ts`

No change needed — it already accepts `number` and the API returns `Article`. Keep as-is:

```typescript
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

---

### Task 7: Update `useCreateArticle` to match service

**Files:**
- Modify: `src/features/article-management/api/use-create-article.ts`

No change needed — the hook accepts `string` and the service still takes `string`. Keep as-is.

---

### Task 8: Delete mock data file

**Files:**
- Delete: `src/features/article-management/api/mock-data.ts`

- [ ] **Remove mock-data.ts**

Run: `rm src/features/article-management/api/mock-data.ts`

---

### Task 9: Update `article-edit-container` for new mutation type

**Files:**
- Modify: `src/features/article-management/containers/article-edit-container.tsx`

The `handleSave` function's data type changed from `Partial<Omit<Article, "id" | "original_content">>` to `Partial<Omit<Article, "id">>` (in Task 4). Update the handler:

```typescript
const handleSave = (
  data: Partial<Omit<Article, "id">>
) => {
  mutate(
    { id, data },
    {
      onSuccess: () => {
        router.push("/articles")
      },
    }
  )
}
```

---

### Task 10: Build verification

- [ ] **Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Run `npm run build`**

Run: `npm run build`
Expected: Build succeeds with no errors.
