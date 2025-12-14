-- Add index to subscriptions table for user_id to optimize RLS
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
