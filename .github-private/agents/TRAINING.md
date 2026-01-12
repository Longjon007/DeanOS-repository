# Hyperion AI Agent Training - Testing Strategy

Target: 100% Test Coverage across all platforms.

## Overview

This document outlines the testing strategy for the Hyperion AI project, ensuring high reliability and stability for the "Hyperion AI" (formerly "DeanOS") platform.

## Categories

### 1. Web (Next.js)
- **Framework**: Jest + React Testing Library
- **Location**: `web/`
- **Goal**: Verify all React components, server actions, and utility functions.
- **Key Areas**:
  - Page rendering (Server & Client Components)
  - Supabase client integration (mocked)
  - User interactions (forms, buttons)

### 2. Mobile (React Native / Expo)
- **Framework**: Jest + React Native Testing Library
- **Location**: `app/`
- **Goal**: Verify mobile application logic and UI rendering.
- **Key Areas**:
  - App navigation
  - Screen rendering
  - Supabase interactions (mocked)

### 3. Backend (Supabase Edge Functions)
- **Framework**: Deno Native Test Runner
- **Location**: `supabase/functions/`
- **Goal**: Verify business logic in Edge Functions.
- **Key Areas**:
  - Webhook handling (e.g., Stripe)
  - Data processing
  - Authorization checks

## Guidelines for Agents

- **Always verify**: Run tests after every change.
- **Mock External Services**: Supabase, Stripe, and other external APIs should be mocked to ensure tests are deterministic and fast.
- **Coverage**: Aim for 100% branch and line coverage.
