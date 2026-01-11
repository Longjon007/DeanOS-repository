# Hyperion AI Agent Training Strategy

## Goal
The goal is to achieve close to 100% test coverage for the Hyperion AI application across all platforms: Web, Mobile, and Backend.

## Testing Standards

### 1. Web Application (`web/`)
- **Framework**: Next.js (App Router)
- **Testing Library**: Jest, React Testing Library
- **Requirements**:
  - Test all components, pages, and utility functions.
  - Mock external services (Supabase, Stripe).
  - Ensure accessibility compliance.
  - Verify server-side rendering and client-side interactions.

### 2. Mobile Application (`app/`)
- **Framework**: React Native (Expo)
- **Testing Library**: Jest, React Native Testing Library
- **Requirements**:
  - Test all screens and components.
  - Mock native modules and Supabase client.
  - Verify navigation flows.
  - Ensure UI consistency across platforms (iOS/Android).

### 3. Backend (`supabase/`)
- **Framework**: Supabase Edge Functions (Deno)
- **Testing Library**: Deno Test
- **Requirements**:
  - Unit test all Edge Functions.
  - Mock database interactions and external API calls.
  - Verify security rules and RLS policies (via integration tests if possible).
  - Validate webhook handling (e.g., Stripe).

## Workflow
1. **Plan**: Identify the feature or bug to work on.
2. **Test**: Write a failing test case that covers the requirement.
3. **Implement**: Write the code to make the test pass.
4. **Refactor**: Optimize the code while ensuring tests still pass.
5. **Verify**: Run the full test suite to check for regressions.

## Reference Examples
See the `examples/` directory for reference implementations of tests for each platform.
