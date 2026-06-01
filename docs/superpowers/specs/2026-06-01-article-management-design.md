# Article Management — Design Spec

## Overview

Article list and edit pages for an AI-assisted travel article editor. Uses mock data with TanStack Query, following the feature-based architecture in `rules/frontend-architecture.md`.

## Use Cases Covered

- **UC-03 View Draft Articles** — list articles with title, status, created/updated dates
- **UC-04 Edit and Review Article** — edit structured fields and change status

## Route Structure

```
src/app/
└── articles/
    ├── page.tsx              ← renders ListPage from feature
    └── [id]/
        └── page.tsx          ← renders EditPage from feature
```

Page files are thin route entries with minimal logic.

## Feature Module

```
src/features/article-management/
├── api/
│   ├── types.ts              ← Article, ArticleSection, KeyFact, ArticleStatus
│   ├── mock-data.ts          ← Articles array from mock_parsed_schema.json
│   ├── article-service.ts    ← getArticles(), getArticle(id), updateArticle(id, data)
│   ├── use-articles.ts       ← useQuery('articles', getArticles)
│   ├── use-article.ts        ← useQuery(['articles', id], () => getArticle(id))
│   └── use-update-article.ts ← useMutation(updateArticle, invalidate queries)
├── components/
│   ├── article-table.tsx     ← Table with title, status badge, dates
│   ├── article-form.tsx      ← Single scrollable form with all editable fields
│   └── status-badge.tsx      ← Styled badge for draft/reviewed/published
├── containers/
│   ├── article-list-container.tsx  ← useArticles → renders ArticleTable
│   └── article-edit-container.tsx  ← useArticle + useUpdateArticle → renders ArticleForm
└── pages/
    ├── list-page.tsx         ← Exported for /articles route
    └── edit-page.tsx         ← Exported for /articles/[id] route
```

## Data Model

```ts
type ArticleStatus = "draft" | "reviewed" | "published"

interface ArticleSection {
  heading: string
  content: string
}

interface KeyFact {
  label: string
  value: string
}

interface Article {
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

## API Layer

- `article-service.ts` — functions returning mock data (no HTTP). Swap to real API later by replacing implementations.
- `use-articles.ts` — `useQuery({ queryKey: ['articles'], queryFn: getArticles })`
- `use-article.ts` — `useQuery({ queryKey: ['articles', id], queryFn: () => getArticle(id) })`
- `use-update-article.ts` — `useMutation({ mutationFn: updateArticle, onSuccess: invalidate ['articles'] })`

## Articles List Page

- Container: `useArticles()` → loading (skeleton rows), error (message + retry), empty (no data CTA), success
- Table columns: **Title**, **Status** (badge), **Created at**, **Updated at**
- Row click navigates to `/articles/[id]`
- shadcn components needed: `table`, `badge`

## Article Edit Page

- Container: `useArticle(id)` for fetch, `useUpdateArticle()` for save
- Single scrollable form with sections:

| Section | Field | Control |
|---------|-------|---------|
| Status | `status` | Select (draft/reviewed/published) |
| Title | `title` | Text input |
| Intro | `intro_hook` | Textarea |
| Body | `main_article_body[]` | Dynamic list: heading + content textareas |
| Best For | `best_for` | Textarea |
| Not For | `not_for` | Textarea |
| Ethics | `ethics_safety_notes` | Textarea |
| Key Facts | `key_facts[]` | Dynamic list: label + value inputs |

- Save triggers mutation → on success: toast/feedback, invalidates article queries
- States: loading (skeleton), error (message + retry), not found (404), success (form)

## State Handling (every component)

1. Loading — skeleton/spinner
2. Error — error message + retry button
3. Empty — no-data message + CTA (list only)
4. Success — data rendered

## shadcn Components to Add

- `table` — article list
- `badge` — status display
- `select` — status dropdown on edit form
