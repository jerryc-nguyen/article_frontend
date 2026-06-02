# View Article Feature

## Overview

A read-only "View Article" page that composes all article fields into a professional, travel-blog-style reading experience. Accessible from the article listing table and routed at `/articles/:id/view`.

## Architecture

```
src/features/view-article/
├── containers/
│   └── article-view-container.tsx    # Fetches article, manages states
└── components/
    └── article-view.tsx              # Pure presentational read-only render

src/app/articles/[id]/view/
└── page.tsx                          # Server component, breadcrumbs + container
```

- Reuses `useArticle` from `article-management/api` — no data hook duplication
- Pure read-only: no mutations, no status changes

## Route & Navigation

- `GET /articles/:id/view` — renders the view page
- Breadcrumbs: `Articles > {title} > View`
- Table row gets an `Eye` icon button linking to `/articles/{id}/view`
- The title in the table remains linked to `/articles/{id}` (edit page)

## Page Layout

Sticky section navigation (desktop) / "Jump to" select (mobile) for navigating between sections.

### Sections

1. **Title hero** — centered H1 with status chip
2. **Intro/hook** — larger lead paragraph
3. **Body sections** — H2 headings with prose paragraphs, ~70ch max-width
4. **Best For / Not For** — side-by-side cards with check/cross icons
5. **Key Facts** — clean 2-column definition list
6. **Ethics & Safety Notes** — muted callout box

### States

- **Loading**: Full-page skeleton matching layout
- **Error**: Error icon + message + retry
- **Not found**: 404 + "Back to articles"
- **Normal**: Rendered article

## Table Integration

Add `Eye` icon button to `ArticleTable` in the actions column, next to delete. Links to `/articles/{id}/view`.

## Non-goals

- No editing, no status transitions, no mutations
