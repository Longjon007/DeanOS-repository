# Hyperion AI
Autonomous experimentally trained AI

## Overview

DeanOS (Hyperion AI) is an autonomous AI system with comprehensive health monitoring, automated code review, and deployment workflows.

## Project Structure

```
DeanOS-repository/
├── web/              # Next.js web application
├── app/              # Expo/React Native mobile application
├── docs/             # Documentation
├── supabase/         # Supabase configuration
├── .github/
│   └── workflows/    # GitHub Actions workflows
└── health_check.sh   # System health check script
```

## Quick Start

### Web Application
```bash
cd web
npm install
npm run dev
```

### Mobile Application
```bash
cd app
npm install
npx expo start
```

## Automated Workflows

### 🔍 Code Review
- Automatically reviews PRs for code quality
- Checks for common issues and security concerns
- Provides actionable feedback

### 🏗️ Build Workflows
- **Web:** Builds Next.js application with artifact caching
- **Mobile:** Validates Expo/React Native configuration

### 🚀 Deployment
- Configurable deployment to multiple platforms
- Supports Vercel, Netlify, and custom servers
- Environment-based deployments (production/staging)

### 🏥 Health Checks
- Daily automated system health monitoring
- Validates repository structure and configuration
- Reports system health percentage

### 🔒 Security
- CodeQL security scanning
- Dependency vulnerability checks
- Automated security updates

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Complete build and deployment instructions
- [Health Check System](HEALTH_CHECK.md) - System monitoring documentation
- [Security Policy](SECURITY.md) - Security guidelines and reporting

## Development

1. Clone the repository
2. Copy `.env.example` to `.env` in web/ and app/ directories
3. Install dependencies: `npm install`
4. Start development server
5. Make changes and submit PR

All PRs are automatically reviewed and tested.

## System Requirements

- Node.js 20+
- npm or yarn
- Git

## Support

For issues or questions, please open an issue in the repository.
