# Agent Training & Testing Strategy

To ensure high quality and reliability of the Hyperion AI application, we aim for **100% test coverage** across all layers of the stack.

## Testing Goals
1.  **100% Code Coverage**: Every line of code, branch, and function must be covered by automated tests.
2.  **Zero Regressions**: No existing functionality should break with new changes.
3.  **Strict Isolation**: Unit tests must mock external services (Supabase, Stripe, etc.) to ensure reliability and speed.

## Technology Stack

### Web (`web/`)
-   **Framework**: Next.js (App Router)
-   **Testing Framework**: Jest
-   **Test Runner**: `jest-environment-jsdom`
-   **Libraries**: `@testing-library/react`, `@testing-library/jest-dom`
-   **Location**: `web/__tests__/` or co-located `__tests__` directories.

### Mobile (`app/`)
-   **Framework**: React Native / Expo
-   **Testing Framework**: Jest
-   **Test Runner**: `jest-expo`
-   **Libraries**: `react-test-renderer`
-   **Location**: `app/__tests__/`

### Backend (`supabase/functions/`)
-   **Runtime**: Deno
-   **Testing Framework**: Deno native test runner (`deno test`)
-   **Location**: Co-located `test.ts` files (e.g., `index.ts` -> `test.ts`).

## Guidelines
-   **Test Driven Development (TDD)**: Write failing tests before writing implementation code whenever possible.
-   **Mocking**:
    -   Web/Mobile: Mock `supabase-js` clients.
    -   Backend: Dependency injection for service classes to bypass actual network calls during tests.
-   **Continuous Integration**: Run all tests before submitting PRs.

## Commands
-   **Web**: `cd web && npm test`
-   **Mobile**: `cd app && npm test`
-   **Backend**: `deno task test`
