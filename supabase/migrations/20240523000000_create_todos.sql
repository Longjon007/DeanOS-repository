-- Create todos table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_complete boolean default false,
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.todos enable row level security;

-- Create policies
create policy "Users can view own todos"
  on public.todos for select
  using ( auth.uid() = user_id );

create policy "Users can insert own todos"
  on public.todos for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own todos"
  on public.todos for update
  using ( auth.uid() = user_id );

create policy "Users can delete own todos"
  on public.todos for delete
  using ( auth.uid() = user_id );
