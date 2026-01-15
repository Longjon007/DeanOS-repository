# Hyperion AI Agent Training Strategy

This document outlines the testing strategy for the Hyperion AI app building agent. The goal is to achieve 100% test coverage across all platforms: Web, Mobile, and Backend.

## Goals

1.  **100% Code Coverage**: Every line of code should be executed by at least one test.
2.  **Zero Regressions**: New changes must not break existing functionality.
3.  **Strict Isolation**: Unit tests must mock external services (Supabase, Stripe, etc.).

## Testing Categories

### Web (Next.js)
-   **Tools**: Jest, React Testing Library.
-   **Focus**: Server Components, Client Components, Server Actions.
-   **Mocking**: Mock `next/navigation`, `next/headers`, and `@/utils/supabase/client`.

### Mobile (React Native / Expo)
-   **Tools**: Jest, React Test Renderer.
-   **Focus**: Components, Navigation, State Management.
-   **Mocking**: Mock `@react-native-async-storage/async-storage`, `expo-router`, and Supabase client.

### Backend (Supabase Edge Functions)
-   **Tools**: Deno Test.
-   **Focus**: API endpoints, Webhooks, Database interactions.
-   **Mocking**: Mock Supabase client, Stripe API calls.

## Reference Implementations

See the `examples/` directory for reference test implementations that the agent should emulate.
