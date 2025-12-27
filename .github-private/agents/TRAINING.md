# Agent Training & Testing Strategy

To achieve 100% reliability and coverage for Hyperion AI, the following testing suites must be implemented and passed.

## 1. Frontend Testing (Web)
Target: `web/`

- **Unit Tests**:
  - Components: Verify rendering, user interactions, and prop updates.
  - Utilities: Test helper functions isolated from UI.
  - Framework: Jest + React Testing Library.
- **Integration Tests**:
  - Pages: Verify data fetching and page logic (Next.js App Router).
- **E2E Tests**:
  - Critical user flows (Login, Dashboard, Subscription).
  - Framework: Playwright.

## 2. Mobile Testing (App)
Target: `app/`

- **Unit Tests**:
  - Components: React Native testing library.
  - Logic: JavaScript utility tests.
  - Framework: Jest.
- **Integration Tests**:
  - Navigation flows.
  - Supabase integration.

## 3. Backend Testing (Supabase)
Target: `supabase/`

- **Edge Functions**:
  - Unit tests for each function (e.g., `stripe-webhook`).
  - Framework: Deno Test.
- **Database**:
  - Schema validation.
  - RLS Policy verification.
  - Migration consistency (using `scripts/validate_migrations.sh`).

## Implementation Plan

1. **Scaffold Test Environment**:
   - Install Jest and testing libraries in `web/` and `app/`.
   - Configure Deno tests for `supabase/functions/`.
2. **Write Baseline Tests**:
   - Create smoke tests for all environments.
   - Ensure `npm test` runs successfully in both `web` and `app`.
3. **Expand Coverage**:
   - Add tests for all existing components and utilities.
   - Mock external dependencies (Supabase, Stripe) where appropriate.
