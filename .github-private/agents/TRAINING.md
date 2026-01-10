# Hyperion AI Agent Training Manual: Testing Strategy

To achieve 100% reliability and coverage for the Hyperion AI application, all agents must adhere to the following testing protocols.

## Goal
Achieve **100% Test Coverage** across all three pillars:
1.  **Frontend (Web)**: Next.js application.
2.  **Mobile (App)**: React Native Expo application.
3.  **Backend**: Supabase Database and Edge Functions.

## 1. Frontend (Web)
**Stack**: Next.js (App Router), TypeScript, Supabase SSR.

### Tools
-   **Jest**: Unit and snapshot testing.
-   **React Testing Library**: Component interaction testing.
-   **Playwright**: End-to-End (E2E) testing.

### Requirements
-   Every page and component must have a corresponding test file (e.g., `components/MyComponent.tsx` -> `__tests__/MyComponent.test.tsx`).
-   Mock `next/headers` (cookies) and Supabase clients to ensure tests are isolated.
-   Use `data-testid` attributes where necessary for robust selectors.

## 2. Mobile (App)
**Stack**: React Native, Expo, Supabase JS.

### Tools
-   **Jest**: Unit testing.
-   **React Native Testing Library (RNTL)**: Component testing.
-   **Detox** (Optional): E2E testing on simulators.

### Requirements
-   Mock `@react-native-async-storage/async-storage` and `react-native-url-polyfill`.
-   Verify navigation flows and state updates.
-   Ensure UI renders correctly on both iOS and Android mocks.

## 3. Backend (Supabase)
**Stack**: Postgres, Edge Functions (Deno).

### Tools
-   **Deno Test**: Native testing for Edge Functions.
-   **Supabase Test Helpers**: Database integrity and RLS policy testing.

### Requirements
-   All Edge Functions must have a `tests/` subdirectory.
-   Mock external APIs (like Stripe) using `fetch` interception or dependency injection.
-   Verify RLS policies prevent unauthorized access.

## Workflow for Agents
1.  **Read**: Before writing code, read existing tests to understand patterns.
2.  **Plan**: Define the test cases for the new feature.
3.  **Implement**: Write the tests (TDD is encouraged).
4.  **Verify**: Run the full suite to ensure no regressions.
