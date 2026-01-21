# Hyperion AI Agent Training

This document outlines the testing strategy for the Hyperion AI application. The goal is to maintain **100% test coverage** across all components: Web, Mobile, and Backend.

## Testing Strategy

### 1. Web (Next.js)
*   **Location**: `web/`
*   **Tools**: Jest, React Testing Library
*   **Commands**:
    *   Run tests: `npm test` (inside `web/`)
*   **Guidelines**:
    *   Mock external services (Supabase, Stripe).
    *   Test Server Components using mocks for `next/headers` and `utils/supabase/server`.
    *   Ensure all pages and components have corresponding test files in `__tests__`.

### 2. Mobile (React Native / Expo)
*   **Location**: `app/`
*   **Tools**: Jest, React Test Renderer
*   **Commands**:
    *   Run tests: `npm test` (inside `app/`)
*   **Guidelines**:
    *   Mock native modules and Supabase client.
    *   Snapshot testing for UI components.
    *   Test user interactions and state changes.

### 3. Backend (Supabase Edge Functions)
*   **Location**: `supabase/functions/`
*   **Tools**: Deno Test
*   **Commands**:
    *   Run tests: `deno test --allow-all supabase/functions/` (from root)
*   **Guidelines**:
    *   Test individual functions.
    *   Mock `Deno.env` and `fetch` calls.
    *   Verify correct HTTP responses and error handling.

## Coverage Goal

All Pull Requests must maintain or improve the current code coverage. The ultimate goal is 100% statement, branch, function, and line coverage.
