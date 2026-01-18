# Agent Training: Testing Strategy

To ensure the Hyperion AI app building agent delivers high-quality code, we adhere to a strict testing strategy aiming for 100% coverage across all layers.

## Testing Stacks

### 1. Web (Next.js)
- **Framework**: Jest
- **Library**: React Testing Library
- **Goal**: Verify component rendering, user interactions, and integration with Supabase (mocked).
- **Environment**: jsdom

### 2. Mobile (React Native / Expo)
- **Framework**: Jest
- **Library**: React Test Renderer
- **Goal**: Verify component rendering (snapshots) and basic logic.
- **Preset**: jest-expo

### 3. Backend (Supabase Edge Functions)
- **Framework**: Deno Test
- **Goal**: Verify API endpoints, logic, and database interactions (mocked or integration).

## Guidelines
- Write tests for every new feature.
- Mock external services (Supabase, Stripe, etc.) to ensure tests are deterministic.
- Aim for high code coverage.
