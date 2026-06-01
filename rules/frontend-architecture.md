# Frontend Architecture Rules

## Feature Structure
- Each feature has: `api/`, `components/`, `containers/`, `hooks/`, `pages/`
- Do not place code outside the feature directory
- Shared components (Button, Input, Modal) go in `components/ui/`

## Container/Presentation Split
- **Container**: data fetching (useQuery/useMutation), state management, event handlers
- **Component**: pure UI, props-only, no side effects, reusable
- **Page**: route entry, renders container, minimal logic

## Data Fetching
- TanStack Query (useQuery/useMutation) for all API calls
- Generated SDK from OpenAPI — do not write fetch manually
- Each feature has corresponding API hooks

## State Handling (every component)
1. **Loading state** — skeleton or spinner
2. **Error state** — error message + retry button
3. **Empty state** — "no data" message + CTA if applicable
4. **Success state** — data rendered

## Styling
- Use the project's styling solution (Tailwind / CSS Modules / styled-components)
- Match existing patterns in the codebase
- No inline styles unless absolutely necessary

## Naming
- Module folders: `kebab-case` (catalog, cart, checkout, ...)
- Feature folders: `kebab-case` (browse-products, add-to-cart, ...)
- Sub-folders within a feature: `api/`, `components/`, `containers/`, `hooks/`, `pages/` (lowercase, do not rename)
- Files: `PascalCase.tsx` for components, `kebab-case.ts` for hooks/utils
- Exported components: `PascalCase`
- Exported hooks: `use*`

## Testing
- Component tests: render with mock data, test states
- Integration tests: user flow within the feature
- Do not test implementation details — test behaviour

## Forbidden
- Business logic in a component
- Direct API call in a page/component
- Import from another feature (use shared components instead)
- Invent API endpoints not in the contract
- `as any` type casting when consuming API
