# Agent Training & Testing Protocols

## Goal
Achieve 100% test coverage across all application layers.

## Testing Categories

### 1. Frontend (Web)
- **Framework:** Next.js
- **Tools:** Jest, React Testing Library
- **Requirement:** Unit tests for all components, integration tests for pages.
- **Run Tests:** `npm test` in `web/` directory.

### 2. Mobile (App)
- **Framework:** React Native (Expo)
- **Tools:** Jest, React Native Testing Library
- **Requirement:** Snapshot tests for UI, unit tests for logic/utils.
- **Run Tests:** `npm test` in `app/` directory.

### 3. Backend (Supabase)
- **Framework:** Supabase Edge Functions, PostgreSQL
- **Tools:** Deno Test (for functions), pgTAP (for DB - *optional/future*)
- **Requirement:** Unit tests for all Edge Functions.
- **Run Tests:** `deno test` in `supabase/functions/`.

## Progress Tracking
- [x] Web: Test infrastructure setup
- [ ] Web: 100% Coverage
- [x] App: Test infrastructure setup
- [ ] App: 100% Coverage
- [ ] Backend: Test infrastructure setup
- [ ] Backend: 100% Coverage
