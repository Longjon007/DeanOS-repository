# Hyperion AI (DeanOS)
Autonomous experimentally trained AI for the DeanOS ecosystem.

## Pre-deploy readiness
1. **Configure secrets**  
   - Copy `web/.env.example` to `web/.env.local` and set Supabase URL and anon key.  
   - Copy `app/.env.example` to `app/.env` and set the same Supabase values for the Expo client.
2. **Run the repository health check**  
   ```bash
   ./health_check.sh
   ```
3. **Verify production readiness**  
   ```bash
   # Supply env values for Supabase before running
   NEXT_PUBLIC_SUPABASE_URL=https://... \
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=... \
   EXPO_PUBLIC_SUPABASE_URL=https://... \
   EXPO_PUBLIC_SUPABASE_KEY=... \
   ./pre_deploy.sh
   ```
4. **Build the web app for production**  
   ```bash
   cd web
   npm install
   npm run lint
   npm run build
   ```
5. **Validate the mobile app**  
   ```bash
   cd app
   npm install
   npx expo-doctor
   ```

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` – required for the web app (see `web/.env.example`).
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY` – required for the mobile app (see `app/.env.example`).
- `DATABASE_URL`, `DIRECT_URL` – required for Prisma/Supabase database access when running migrations (see `web/.env.example`).
