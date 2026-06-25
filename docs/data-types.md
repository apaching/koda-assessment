# Data Types

**File:** `src/types/types.ts`

All application types are re-exported from a single file that wraps the Supabase-generated types in `src/types/supabase.ts`.

## Why not use the generated types directly?

- **Ergonomics** — `Project` is easier to read and write than `Database['public']['Tables']['projects']['Row']`.
- **Decoupling** — app code is not tied to Supabase's generated structure. Renaming a table means updating one alias, not hunting the whole codebase.
- **Composability** — derived or joined types (e.g. `ProjectWithAssignees`) live alongside the base types in one place.
- **Enum access** — enums are buried in the generated output; re-exporting them makes them first-class types in the app.

## Usage

```ts
import type { Project, ProjectInsert, ProjectStatus } from "@/types/types";
```

## Workflow

1. Make schema changes in Supabase.
2. Run `npm run gen:types` to regenerate `src/types/supabase.ts`.
3. Add or update aliases in `src/types/types.ts` if new tables or enums were added.
