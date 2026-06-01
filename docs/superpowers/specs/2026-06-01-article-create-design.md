# Article Create (Upload .docx) — Design Spec

## Overview

Upload a `.docx` file to create a new article. The file is parsed client-side with `mammoth`, sent to a backend API, and the user is redirected to edit the created draft.

## Route

```
src/app/articles/new/page.tsx  ← renders CreatePage from feature
```

## Feature Changes

```
src/features/article-management/
├── api/
│   └── use-create-article.ts   ← useMutation → POST /api/v1/article_ai_parser
├── components/
│   ├── article-upload.tsx      ← File drop zone + submit button
├── containers/
│   └── article-create-container.tsx  ← mammoth parsing + API call + redirect
└── pages/
    └── create-page.tsx         ← Thin page component
```

## List Page Update

The existing `ArticleListContainer` gets a "Create New Article" button at the top that links to `/articles/new`. The empty state also gets this CTA button.

## Data Flow

1. User clicks "Create New Article" → navigates to `/articles/new`
2. User selects/drags a `.docx` file
3. Client validates: file type (`.docx`), max size (10MB)
4. `mammoth.extractRawText({ arrayBuffer })` → plain text
5. `POST /api/v1/article_ai_parser` with `{ original_content: "<extracted text>" }`
6. API returns `{ id, status: "draft", ...Article }`
7. `router.push('/articles/${id}')` redirects to edit page

## States

- **Initial**: Drop zone with "Drop .docx here or click to browse" + disabled submit button
- **File selected**: File name shown, submit button enabled
- **Processing**: Submit button shows "Processing..." + spinner, both disabled
- **Error (validation)**: "File must be a .docx" or "File exceeds 10MB limit"
- **Error (API)**: Error message from API response
- **Success**: Redirect to edit page

## Files to Add

- `src/app/articles/new/page.tsx`
- `src/features/article-management/pages/create-page.tsx`
- `src/features/article-management/containers/article-create-container.tsx`
- `src/features/article-management/components/article-upload.tsx`
- `src/features/article-management/api/use-create-article.ts`

## Files to Modify

- `src/app/articles/page.tsx` — no change needed (container handles the button)
- `src/features/article-management/containers/article-list-container.tsx` — add "Create New Article" button + CTA in empty state

## Dependencies

- `mammoth` — npm package for client-side .docx parsing

## API Contract

```
POST /api/v1/article_ai_parser
Content-Type: application/json

{
  "original_content": "extracted text from docx"
}

Response: { id: number, status: "draft", ...Article }
```
