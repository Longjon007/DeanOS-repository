# Agent Training Strategy

This document outlines the testing strategy to train the Hyperion AI app building agent.
The goal is to achieve 100% test coverage across all sectors of the application.

## Sectors

### 1. Web (Next.js)
- **Framework**: Jest + React Testing Library
- **Configuration**: `web/jest.config.js`
- **Goal**: Verify all Page components, Server Actions, and Client Components.
- **Coverage Target**: 100%

### 2. Mobile (React Native / Expo)
- **Framework**: Jest + React Test Renderer
- **Configuration**: `app/package.json` (jest)
- **Goal**: Verify App rendering, navigation, and interaction.
- **Coverage Target**: 100%

### 3. Backend (Supabase Edge Functions)
- **Framework**: Deno Test
- **Configuration**: `supabase/functions/deno.json`
- **Goal**: Verify all webhook handlers and API endpoints using dependency injection.
- **Coverage Target**: 100%
