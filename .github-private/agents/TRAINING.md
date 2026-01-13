# Hyperion AI Agent Training Manual

This document outlines the strategy and standards for developing and maintaining the Hyperion AI codebase. Our primary goal is to achieve **100% test coverage** and ensure absolute reliability across all three core categories: Web, Mobile, and Backend.

## Core Philosophy

1.  **Test-Driven Development (TDD)**: Whenever possible, write the test before the implementation.
2.  **Zero Regressions**: Every bug fix must be accompanied by a test case that reproduces the bug and verifies the fix.
3.  **Full Coverage**: Aim for 100% line and branch coverage. Critical paths must never be left untested.
4.  **Isolation**: Tests should not depend on external services (like live Supabase instances) unless explicitly running integration/E2E tests. Use mocks for unit tests.

## 1. Web Application (`web/`)

**Stack**: Next.js (App Router), TypeScript, Jest, React Testing Library.

-   **Components**: Test all interactions, loading states, and error states. Use `screen.getByRole` for accessibility-focused queries.
-   **Server Actions/Utils**: Mock `next/headers` (cookies) and `@supabase/ssr` to test server-side logic in isolation.
-   **Mocking**: Use `jest.mock` for external dependencies. Ensure Supabase clients are properly mocked to simulate database responses.

## 2. Mobile Application (`app/`)

**Stack**: React Native (Expo), JavaScript/TypeScript.

-   **Components**: Use `react-test-renderer` or `@testing-library/react-native` (once configured) to verify rendering and user interactions.
-   **Storage**: Mock `@react-native-async-storage/async-storage` for local data persistence tests.
-   **Navigation**: Mock navigation props to ensure screens transition correctly.
-   **Performance**: Verify `FlatList` optimizations (hoisted `renderItem`, `keyExtractor`) and `useCallback` usage to prevent re-renders.

## 3. Backend Services (`supabase/`)

**Stack**: Supabase Edge Functions, Deno, PostgreSQL (PL/pgSQL).

-   **Edge Functions**: Use `deno test` to verify function logic. Mock the `SupabaseClient` to test database interactions without hitting the real DB.
-   **Database**: Ensure RLS policies are tested. Validate that migrations are synchronized using `scripts/validate_migrations.sh`.
-   **Security**: verify that no sensitive keys (like `STRIPE_SECRET_KEY`) are exposed in logs or client-side code.

## Reference Examples

Detailed reference implementations for tests in each category can be found in the `examples/` directory:

-   **Web**: `examples/web.test.tsx`
-   **Mobile**: `examples/mobile.test.js`
-   **Backend**: `examples/backend.test.ts`

Follow these patterns to maintain consistency and quality throughout the codebase.
