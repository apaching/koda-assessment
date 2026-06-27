# Data Types

All app types live in `src/types/types.ts` as aliases over the Supabase-generated types in `src/types/supabase.ts`.

```ts
import type { Project, ProjectInsert, ProjectStatus } from "@/types/types";
```

This keeps imports short (`Project` vs `Database['public']['Tables']['projects']['Row']`) and limits the blast radius when tables change.

## Updating types

1. Change the schema in Supabase.
2. Run `npm run gen:types` to regenerate `src/types/supabase.ts`.
3. Add/update aliases in `src/types/types.ts` if needed.
