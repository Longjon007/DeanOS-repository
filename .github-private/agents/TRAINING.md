# Hyperion AI Agent Training Protocols

## Overview
This document outlines the testing infrastructure established to train the Hyperion AI Agent (formerly DeanOS). The goal is to achieve 100% test coverage across all application layers.

## Testing Architecture

### 1. Frontend (Web)
*   **Path**: `web/`
*   **Framework**: Next.js 14
*   **Test Runner**: Jest + React Testing Library
*   **Config**: `web/jest.config.js`
*   **Tests**:
    *   `web/__tests__/smoke.test.js`: Verifies environment health.
    *   `web/__tests__/page.test.tsx`: Tests the main page component, mocking `next/headers` and Supabase.
*   **Run**: `npm test` (inside `web/` directory)

### 2. Mobile (App)
*   **Path**: `app/`
*   **Framework**: React Native (Expo)
*   **Test Runner**: Jest + Jest Expo + React Test Renderer
*   **Config**: `app/package.json` (jest preset)
*   **Tests**:
    *   `app/__tests__/smoke.test.js`: Snapshot testing.
    *   `app/__tests__/App.test.js`: Tests the main App component, mocking native modules and Supabase.
*   **Run**: `npm test` (inside `app/` directory)

### 3. Backend (Supabase)
*   **Path**: `supabase/functions/`
*   **Framework**: Deno Edge Functions
*   **Test Runner**: Deno Test
*   **Tests**:
    *   `supabase/functions/tests/stripe-webhook_test.ts`: Mock tests for webhook logic.
*   **Run**: `deno test` (inside `supabase/functions/` or root)

## Coverage Goals
The agent is tasked with expanding these test suites to cover:
*   All UI components and interactions.
*   All API routes and database interactions (via mocking).
*   Edge cases in payment processing (Stripe webhooks).
*   Error handling and recovery states.

## Continuous Integration
Tests are designed to run in CI/CD pipelines. Ensure dependencies are installed (`npm ci`) before running tests.
