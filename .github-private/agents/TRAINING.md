# Hyperion AI Agent Training Protocol

This document outlines the testing strategy and requirements to ensure the Hyperion AI app building agent achieves 100% confidence in code generation and deployment.

## Goal
Achieve 100% test coverage across all application layers:
1.  **Web Application (Next.js)**
2.  **Mobile Application (React Native/Expo)**
3.  **Backend Services (Supabase Edge Functions)**

## Testing Standards

### 1. Web Application (`web/`)
*   **Framework**: Jest + React Testing Library
*   **Requirements**:
    *   All UI components must have snapshot tests.
    *   User interactions (clicks, inputs) must be simulated.
    *   Server Components must mock `next/headers` and Supabase clients.
    *   `utils/` functions must have unit tests.

### 2. Mobile Application (`app/`)
*   **Framework**: Jest + React Test Renderer
*   **Requirements**:
    *   `App.js` and all screens must verify rendering.
    *   Interaction handlers must be tested.
    *   Platform-specific code must be mocked if necessary.

### 3. Backend (`supabase/functions/`)
*   **Framework**: Deno Test
*   **Requirements**:
    *   All Edge Functions must be tested.
    *   Mock external services (Stripe, Database).
    *   Verify HTTP status codes and response bodies.

## Continuous Integration
*   Run `pnpm test` in `web/` before every commit.
*   Run `npm test` in `app/` before every commit.
*   Run `deno test` in `supabase/functions/` before every commit.
