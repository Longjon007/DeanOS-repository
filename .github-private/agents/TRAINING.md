# Agent Training & Testing Strategy

To ensure Hyperion AI is robust and reliable, we aim for **100% test coverage** across all platforms before public deployment. This document outlines the testing standards and tools for each component.

## Goals
1.  **100% Code Coverage**: Every line of code, branch, and function must be covered by automated tests.
2.  **Zero Regressions**: No existing functionality should break with new changes.
3.  **TDD (Test-Driven Development)**: Write tests before implementation whenever possible.
4.  **Isolation**: Tests should mock external services (Supabase, APIs) to ensure speed and reliability.

## Web Application (`web/`)
-   **Framework**: Next.js
-   **Testing Tools**:
    -   `jest`: Test runner.
    -   `@testing-library/react`: Component testing.
    -   `@testing-library/jest-dom`: DOM assertions.
-   **Strategy**: Unit tests for components and utilities. Integration tests for pages.

## Mobile Application (`app/`)
-   **Framework**: React Native / Expo
-   **Testing Tools**:
    -   `jest`: Test runner.
    -   `jest-expo`: Expo specific presets.
    -   `react-test-renderer`: Snapshot testing.
-   **Strategy**: Snapshot tests for UI consistency. Unit tests for logic.

## Backend (`supabase/functions/`)
-   **Runtime**: Deno (Supabase Edge Functions)
-   **Testing Tools**:
    -   `deno test`: Native Deno test runner.
-   **Strategy**: Unit tests for business logic. Handler functions should be separated from serving logic to allow testing without `Deno.serve`.
