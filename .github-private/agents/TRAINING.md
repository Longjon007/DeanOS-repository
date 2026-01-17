# Agent Training Guidelines

## Goal
The goal is to train the Hyperion AI app building agent to achieve close to 100% test coverage in every category (Web, Mobile, Backend) before deploying to the public.

## Testing Strategy

### 1. Web (Next.js)
- **Framework**: Jest + React Testing Library.
- **Standards**:
  - Test Server Components by mocking `next/headers` and Supabase clients.
  - Achieve 100% branch coverage.
  - Use relative paths for imports if necessary to avoid alias issues.
  - Mock all external dependencies (Supabase, APIs).

### 2. Mobile (React Native Expo)
- **Framework**: Jest + React Test Renderer.
- **Standards**:
  - Use snapshot testing for UI consistency.
  - Mock native modules and Supabase clients.
  - Ensure 100% coverage for logic and rendering.

### 3. Backend (Supabase Edge Functions)
- **Framework**: Deno Test.
- **Standards**:
  - Test functions in isolation.
  - Mock service calls.
  - Verify HTTP responses and status codes.

## Core Principles
- **TDD**: Write tests before implementation.
- **Zero Regressions**: Ensure new changes do not break existing functionality.
- **Strict Isolation**: External services must be mocked. No network calls during tests.
