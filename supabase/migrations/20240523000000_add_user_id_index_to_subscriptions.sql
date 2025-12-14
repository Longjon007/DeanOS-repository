-- Add index on user_id to optimize RLS policies and webhook lookups
-- Performance Impact:
-- 1. Accelerates "Users can view own subscription" RLS policy checks (O(log N) vs O(N)).
-- 2. Speeds up `stripe-webhook` updates which filter by `user_id`.
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);
