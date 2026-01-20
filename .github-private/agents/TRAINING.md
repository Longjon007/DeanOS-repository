# Hyperion AI Agent Training & Testing Strategy

To ensure the Hyperion AI app is production-ready and maintains the highest quality standards, we are strictly enforcing a 100% test coverage goal across all platforms (Web, Mobile, Backend).

## Goals
- **100% Code Coverage:** Every line of code, branch, and function must be covered by tests.
- **Zero Regressions:** New changes must not break existing functionality.
- **Strict Isolation:** Unit tests must mock external services (Supabase, APIs).

## Testing Stack

### 1. Web Application (`web/`)
- **Framework:** Next.js (React)
- **Testing Library:** Jest + React Testing Library
- **Focus:**
    - Server Components: Verify logic and rendering. Mock `next/headers` and Supabase clients.
    - Client Components: Verify interactivity and state changes.
    - Utils/Hooks: Unit test logic in isolation.

### 2. Mobile Application (`app/`)
- **Framework:** React Native (Expo)
- **Testing Library:** Jest + React Test Renderer + Jest Expo
- **Focus:**
    - Component Rendering: Ensure UI renders correctly on different devices.
    - User Interactions: Simulate touches and inputs.
    - Integration: Mock `@react-native-async-storage/async-storage` and navigation.

### 3. Backend (Supabase Edge Functions)
- **Environment:** Deno
- **Testing Library:** Deno Native Test Runner (`deno test`)
- **Focus:**
    - Edge Functions: Unit test request handling and logic.
    - Database Interactions: Mock Supabase client calls.
    - Security: Verify authentication and authorization checks.

## Workflow
1.  **Test-Driven Development (TDD):** Write failing tests before implementing features.
2.  **Continuous Verification:** Run tests locally before every commit.
3.  **Code Review:** Agents must verify test coverage reports before approving changes.

## Commands
- **Web:** `cd web && npm test`
- **Mobile:** `cd app && npm test`
- **Backend:** `cd supabase/functions && deno test --allow-all`
