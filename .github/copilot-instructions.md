# GitHub Copilot Instructions for DeanOS (Hyperion AI)

## Repo map (the 3 runtimes)

- `app/`: Expo React Native client. Entry: `app/App.js`. Supabase client wrapper: `app/utils/supabase.js`.
- `web/`: Next.js 14 (App Router). Entry: `web/app/page.tsx`. Supabase SSR wrapper: `web/utils/supabase/server.ts`. Prisma schema: `web/prisma/schema.prisma`.
- `supabase/`: Supabase CLI config (`supabase/config.toml`), SQL migrations (`supabase/migrations/*.sql`), Edge Functions (`supabase/functions/*`).

## Database is dual-tracked (Supabase SQL + Prisma)

- Treat `supabase/migrations/*.sql` as the source of truth for schema changes.
- Mirror changes in `web/prisma/schema.prisma` using `@map` / `@@map` to match snake_case tables/columns (example: `model Subscription @@map("subscriptions")`).
- Validate sync with `./scripts/validate_migrations.sh` and reference `docs/DATABASE_MIGRATIONS.md` for the conventions.

## Supabase client patterns (copy these, don’t reinvent)

- Mobile: `app/utils/supabase.js` uses `@supabase/supabase-js` with `AsyncStorage` + `processLock`.
	- Env vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY` (see `app/.env.example`).
- Web: `web/utils/supabase/server.ts` builds an SSR client via `@supabase/ssr` and Next’s cookie store.
	- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (see `web/.env.example`).

## Stripe integration

- **Checkout session creation**: Currently not implemented. When adding this, create checkout sessions in API routes (Next.js API routes in `web/app/api/` or Supabase Edge Functions in `supabase/functions/`). **CRITICAL**: Always include `metadata: { user_id: user.id }` in the session creation call—the webhook handler requires this to link payments to users.
- **Webhook handler**: `supabase/functions/stripe-webhook/index.ts`.
	- Reads raw body (`req.text()`), verifies `Stripe-Signature` using `STRIPE_WEBHOOK_SECRET`, then updates `public.subscriptions` via the Service Role key.
	- The checkout flow must set `metadata: { user_id }` on the Stripe session; the handler keys off `session.metadata?.user_id`.
	- If you touch this file, watch for unsafe non-null assertions (`!`) around env vars/headers—missing config will crash the function.
	- Full setup docs: `supabase/functions/stripe-webhook/README.md` (includes testing with Stripe CLI, security notes, troubleshooting).

## Commands that matter (from the repo)

- Health & validation (bash): `./health_check.sh`, `./scripts/validate_migrations.sh`.
	- On Windows, run these via WSL or Git-Bash.
- Mobile (Expo): `app/package.json` → `npm run start` / `android` / `ios` / `web`.
- Web (Next): `web/package.json` → `npm run dev` / `build` / `start` / `lint`.
- Supabase local dev: ports and toggles are in `supabase/config.toml` (API 54321, DB 54322, Studio 54324). Use the Supabase CLI (`supabase start`) if you’re running the stack locally.

## Bash script style (match existing scripts)

- Follow `health_check.sh` and `scripts/validate_migrations.sh`: ANSI colors + ✓/✗/⚠ counters + section headers; keep `set +e` during checks so all failures are reported.
