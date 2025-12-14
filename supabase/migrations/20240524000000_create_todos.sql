-- Create todos table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  is_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add comment
comment on table public.todos is 'Stores user todos.';

-- Enable RLS
alter table public.todos enable row level security;

-- Create policy to allow users to read their own todos
create policy "Users can view own todos"
  on public.todos for select
  using ( auth.uid() = user_id );

-- Create policy to allow users to insert their own todos
create policy "Users can insert own todos"
  on public.todos for insert
  with check ( auth.uid() = user_id );

-- Create policy to allow users to update their own todos
create policy "Users can update own todos"
  on public.todos for update
  using ( auth.uid() = user_id );

-- Create policy to allow users to delete their own todos
create policy "Users can delete own todos"
  on public.todos for delete
  using ( auth.uid() = user_id );

-- Add index to todos table for user_id to optimize RLS
create index if not exists todos_user_id_idx on public.todos (user_id);
