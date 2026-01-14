# Hyperion AI Agent Training & Testing Strategy

## Mission
Achieve 100% test coverage across all application layers (Web, Mobile, Backend) to ensure the Hyperion AI app building agent delivers robust, production-ready code.

## Core Principles
1.  **Test-Driven Development (TDD):** Write tests before implementation.
2.  **Zero Regressions:** Every bug fix must be accompanied by a test case that reproduces the bug and verifies the fix.
3.  **Strict Isolation:** Unit tests must mock external services (Supabase, Stripe, etc.) to ensure reliability and speed.
4.  **100% Coverage:** Aim for full statement, branch, and function coverage.

## Testing Categories & Standards

### 1. Web Application (`web/`)
*   **Framework:** Next.js (App Router), React.
*   **Tools:** Jest, React Testing Library.
*   **Requirements:**
    *   Mock `next/navigation` (e.g., `useRouter`).
    *   Mock `next/headers` (e.g., `cookies`) for Server Components.
    *   Mock Supabase Client (`@/utils/supabase/client` and `server`).
    *   Verify component rendering, user interactions, and state updates.

### 2. Mobile Application (`app/`)
*   **Framework:** React Native, Expo.
*   **Tools:** Jest, React Test Renderer (or React Native Testing Library).
*   **Requirements:**
    *   Mock native modules and `@react-native-async-storage/async-storage`.
    *   Mock Supabase Client.
    *   Snapshot testing for UI consistency.
    *   Verify event handlers and navigation logic.

### 3. Backend (Supabase Edge Functions)
*   **Runtime:** Deno.
*   **Tools:** `deno test`.
*   **Requirements:**
    *   Use dependency injection or mocking for Supabase calls.
    *   Validate request parsing, business logic, and response formatting.
    *   Handle error cases and edge conditions.

## Reference Implementations
See the `examples/` directory for authorized test patterns:
*   Web: `examples/web.test.tsx`
*   Mobile: `examples/mobile.test.js`
*   Backend: `examples/backend.test.ts`
