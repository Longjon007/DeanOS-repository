# Agent Training & Testing Strategy

## Goal
Achieve 100% test coverage across all application layers: Web, Mobile, and Backend.

## Strategy

### Web (Next.js)
- **Tooling**: Jest, React Testing Library.
- **Scope**: Components, Pages, Utilities.
- **Isolation**: Mock `next/headers` (cookies) and Supabase clients.
- **Reference**: See `examples/web.test.tsx`.

### Mobile (React Native / Expo)
- **Tooling**: Jest, React Test Renderer.
- **Scope**: Components, Screens.
- **Isolation**: Mock `@react-native-async-storage/async-storage` and Supabase clients.
- **Reference**: See `examples/mobile.test.js`.

### Backend (Supabase Edge Functions)
- **Tooling**: Deno Test.
- **Scope**: Edge Functions.
- **Isolation**: Mock external services and database calls where possible.

## Execution
1. Ensure all dependencies are installed.
2. Run tests in each directory (`web`, `app`, `supabase`).
3. Maintain strict TDD where possible.
