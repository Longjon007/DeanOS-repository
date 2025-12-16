-- Migration: Add webhook_events table and improve subscriptions table
-- Created: 2025-12-16
-- Purpose: Add idempotency tracking for webhook events and missing fields for subscriptions

-- =============================================================================
-- 1. Add missing field to subscriptions table
-- =============================================================================

-- Add canceled_at field to track when subscriptions are canceled
alter table public.subscriptions add column if not exists canceled_at timestamptz;

-- Add unique constraint on user_id for upsert operations
-- This allows the webhook to use upsert with onConflict: 'user_id'
alter table public.subscriptions add constraint if not exists subscriptions_user_id_unique unique (user_id);

-- Add comment for new field
comment on column public.subscriptions.canceled_at is 'Timestamp when subscription was canceled';

-- =============================================================================
-- 2. Create webhook_events table for idempotency tracking
-- =============================================================================

create table if not exists public.webhook_events (
  id text primary key,  -- Stripe event ID (e.g., evt_1A2B3C4D5E6F7G8H)
  type text not null,   -- Event type (e.g., checkout.session.completed)
  processed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Add comment
comment on table public.webhook_events is 'Tracks processed Stripe webhook events for idempotency protection';

-- Create index for efficient cleanup of old events
create index if not exists idx_webhook_events_created_at on public.webhook_events(created_at);

-- Create index for event type queries (useful for monitoring)
create index if not exists idx_webhook_events_type on public.webhook_events(type);

-- Enable RLS (webhook uses service role which bypasses RLS)
alter table public.webhook_events enable row level security;

-- No policies needed - only the service role (webhook) should access this table
-- Service role bypasses RLS automatically

-- =============================================================================
-- 3. Add helpful function to cleanup old webhook events
-- =============================================================================

-- Function to delete webhook events older than 90 days
-- This prevents the table from growing indefinitely
create or replace function cleanup_old_webhook_events()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.webhook_events
  where created_at < now() - interval '90 days';
end;
$$;

comment on function cleanup_old_webhook_events is 'Deletes webhook events older than 90 days to prevent table bloat';

-- =============================================================================
-- 4. Add indexes to subscriptions for better query performance
-- =============================================================================

-- Index for looking up subscriptions by stripe_customer_id (used in invoice webhooks)
create index if not exists idx_subscriptions_stripe_customer_id
  on public.subscriptions(stripe_customer_id)
  where stripe_customer_id is not null;

-- Index for querying active subscriptions
create index if not exists idx_subscriptions_status
  on public.subscriptions(status)
  where status is not null;

-- =============================================================================
-- 5. Add data validation constraints
-- =============================================================================

-- Ensure status is one of the valid values
alter table public.subscriptions
  add constraint if not exists subscriptions_status_check
  check (status in ('active', 'inactive', 'pending', 'past_due', 'canceled'));

comment on constraint subscriptions_status_check on public.subscriptions is 'Ensures subscription status is valid';
