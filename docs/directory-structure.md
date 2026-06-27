# Directory Structure

```
src/
├── app/
│   ├── api/[resource]/route.ts    # Route Handlers
│   ├── (routes)/[page]/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/[feature]/          # UI components grouped by feature
│
├── hooks/[feature]/               # TanStack Query wrappers
│   ├── useResource.ts             # query
│   └── useCreateResource.ts       # mutation
│
├── lib/utils.ts
│
└── utils/supabase/
    ├── client.ts                  # Browser client
    └── server.ts                  # Server client
```

## Rules

- `app/api/` — HTTP only. No React, no hooks.
- `components/` — UI only. No direct `fetch` calls.
- `hooks/` — One file per query/mutation. Named `use<Resource>` or `use<Verb><Resource>`.
- Group related files by feature, not by type.
