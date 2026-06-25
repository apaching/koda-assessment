# Data Fetching Pattern

**Stack:** TanStack Query (React Query) + `fetch` + Next.js Route Handlers.

**Flow:** `Component → Custom Hook → TanStack Query → fetch → API Route → Supabase`

---

## Layer 1: API Route (`src/app/api/*/route.ts`)

**Responsibility:** HTTP boundary. Parse the request, query the database, return JSON.

- Owns authentication and authorization checks (via Supabase server client)
- Validates/destructures the request body — no raw passthrough to DB
- Returns `{ data }` on success, `{ error }` with an appropriate status code on failure
- Contains no business logic that belongs in the UI layer

**Does not:** import React, reference TanStack Query, or know anything about cache state.

```ts
// src/app/api/brands/route.ts
export async function POST(request: Request) {
  const supabase = await createClient();
  const body: BrandInsert = await request.json();
  const { name, slug, user_id } = body;

  const { data, error } = await supabase
    .from("brands")
    .insert({ user_id, name, slug })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
```

---

## Layer 2: Custom Hook (`src/hooks/*/use*.ts`)

**Responsibility:** Encapsulates one TanStack Query call — query or mutation — plus its cache management.

- Holds the `queryKey`, cache invalidation, and optimistic update logic
- Throws on non-ok responses so TanStack Query can catch and surface errors
- Casts the response to the correct TypeScript type
- Marked `"use client"` — only consumed in Client Components

**Does not:** render anything, hold UI state, or contain conditional fetching logic beyond `enabled`.

```ts
// src/hooks/brands/useBrands.ts — read
"use client";
export function useBrands(userId: string) {
  return useQuery({
    queryKey: ["brands", userId],
    queryFn: async () => {
      const res = await fetch(`/api/brands?user_id=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch brands.");
      return data.data as Brand[];
    },
    enabled: !!userId,
  });
}

// src/hooks/brands/useCreateBrand.ts — mutation with optimistic update
"use client";
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: BrandInsert) => {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create brand.");
      return data.data as Brand;
    },
    onMutate: async (newBrand) => {
      await queryClient.cancelQueries({ queryKey: ["brands", newBrand.user_id] });
      const previous = queryClient.getQueryData<Brand[]>(["brands", newBrand.user_id]);
      queryClient.setQueryData<Brand[]>(["brands", newBrand.user_id], (old = []) => [
        { ...newBrand, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Brand,
        ...old,
      ]);
      return { previous };
    },
    onError: (_err, newBrand, context) => {
      queryClient.setQueryData(["brands", newBrand.user_id], context?.previous);
    },
    onSettled: (_data, _err, newBrand) => {
      queryClient.invalidateQueries({ queryKey: ["brands", newBrand.user_id] });
    },
  });
}
```

---

## Layer 3: Component (`src/components/*` or `src/app/**/page.tsx`)

**Responsibility:** Consume the hook, render loading/error/data states, dispatch mutations.

- Destructures `{ data, isPending, isError, mutate }` — no raw `fetch` calls
- Passes typed arguments directly to `mutate()`
- Owns UX decisions: what to show during loading, how to display errors

**Does not:** manage query keys, know the API URL, or contain cache logic.

```tsx
// src/components/brands/BrandList.tsx
"use client";
export function BrandList({ userId }: { userId: string }) {
  const { data: brands, isPending, isError } = useBrands(userId);
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();

  if (isPending) return <Spinner />;
  if (isError) return <ErrorMessage />;

  return (
    <>
      {brands.map((b) => <BrandRow key={b.id} brand={b} />)}
      <button
        disabled={isCreating}
        onClick={() => createBrand({ name: "New", slug: "new", user_id: userId })}
      >
        Add Brand
      </button>
    </>
  );
}
```

---

## Rules at a Glance

| Concern | Lives in |
|---|---|
| HTTP method, URL, headers | Custom hook's `mutationFn` / `queryFn` |
| Auth, DB queries | API route |
| Cache keys, invalidation, optimistic updates | Custom hook |
| Loading / error UI | Component |
| Type casting the response | Custom hook |
| Business logic (e.g. slug generation) | Component or a pure utility, passed into `mutate()` |
