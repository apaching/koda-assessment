# Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # Route Handlers (HTTP endpoints)
│   │   └── [resource]/
│   │       └── route.ts
│   ├── (routes)/               # Page segments
│   │   └── [page]/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/                 # Reusable UI components
│   └── [feature]/              # Grouped by feature or domain
│       └── ComponentName.tsx
│
├── hooks/                      # Custom hooks (TanStack Query wrappers)
│   └── [feature]/
│       ├── useResource.ts      # read
│       └── useCreateResource.ts # mutation
│
├── lib/                        # Shared utilities and config
│   └── utils.ts
│
└── utils/
    └── supabase/
        ├── client.ts           # Browser Supabase client
        └── server.ts           # Server Supabase client
```

## Rules

- `app/api/` — HTTP only. No React, no hooks.
- `components/` — UI only. No direct `fetch` calls.
- `hooks/` — One file per query/mutation. Named `use<Resource>` or `use<Verb><Resource>`.
- Keep feature-related files together within their folder (don't scatter by type alone).
