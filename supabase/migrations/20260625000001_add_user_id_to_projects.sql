alter table public.projects
  add column user_id uuid references auth.users(id) on delete cascade not null;
