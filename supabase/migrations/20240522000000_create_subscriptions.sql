-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  stripe_customer_id text,
  status text,
  last_billed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add comment
comment on table public.subscriptions is 'Stores user subscription status and Stripe details.';

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Create policy to allow users to read their own subscription
create policy "Users can view own subscription"
  on public.subscriptions for select
  using ( auth.uid() = user_id );

-- Create policy to allow service role (or specific roles) to update
-- Note: Service role bypasses RLS, but explicit policies can be good for other roles.
-- For now, we assume the webhook uses the service role key which bypasses RLS.
