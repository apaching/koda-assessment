# Data Fetching Pattern

TanStack Query + `fetch` + Next.js Route Handlers.

`Component → Hook → TanStack Query → fetch → API Route → Supabase`

---

## API Route (`src/app/api/*/route.ts`)

Handles HTTP. Parses request, queries Supabase, returns JSON.

- Auth checks via Supabase server client
- Returns `{ data }` on success, `{ error }` + status code on failure
- No React, no TanStack Query

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

## Hook (`src/hooks/*/use*.ts`)

Wraps one TanStack Query call (query or mutation) with cache management.

- Holds `queryKey`, invalidation, and optimistic update logic
- Throws on non-ok responses
- Marked `"use client"`

```ts
// src/hooks/brands/useBrands.ts
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

// src/hooks/brands/useCreateBrand.ts
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

## Component (`src/components/*` or `src/app/**/page.tsx`)

Uses the hook, renders loading/error/data states, calls mutations.

- No raw `fetch` calls, no query keys, no cache logic

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

## Quick Reference

| Concern | Where |
|---|---|
| Auth, DB queries | API route |
| HTTP method, URL, headers | Hook (`queryFn` / `mutationFn`) |
| Cache keys, invalidation, optimistic updates | Hook |
| Loading / error UI | Component |
| Business logic (e.g. slug generation) | Component or utility, passed into `mutate()` |
