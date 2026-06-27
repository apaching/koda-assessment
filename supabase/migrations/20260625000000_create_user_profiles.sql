create table public.users (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  first_name text,
  last_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);
