# Hyperion AI Agent Training & Testing Strategy

## Goal
Achieve 100% test coverage across all application layers before public deployment.

## Categories

### 1. Web Application (`web/`)
*   **Framework**: Next.js (App Router)
*   **Testing Stack**: Jest, React Testing Library
*   **Goals**:
    *   Unit tests for all UI components.
    *   Integration tests for pages and user flows.
    *   Mocking Supabase server actions and client.

### 2. Mobile Application (`app/`)
*   **Framework**: React Native (Expo)
*   **Testing Stack**: Jest, React Native Testing Library
*   **Goals**:
    *   Unit tests for screens and components.
    *   Integration tests for navigation flows.
    *   Mocking native modules and Supabase client.

### 3. Backend (Supabase)
*   **Components**: Edge Functions, Database Policies (RLS)
*   **Testing Stack**: Deno Test (for Edge Functions), SQL tests (if applicable)
*   **Goals**:
    *   Unit tests for all Edge Functions (e.g., `stripe-webhook`).
    *   Verification of RLS policies.
    *   Data consistency checks.

## Execution Plan
1.  **Infrastructure Setup**: Install dependencies and configure Jest/Test Runners for each project.
2.  **Baseline Tests**: Create initial tests to verify configuration.
3.  **Coverage Expansion**: systematically add tests for existing features.
4.  **CI/CD Integration**: Ensure tests run on pull requests (simulated or actual).
